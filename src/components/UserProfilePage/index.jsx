import React, { Component } from 'react'
import './index.scss'
import { AuthContext } from "../../contexts/auth.context";
import { Avatar } from 'antd';
import ReactTable from 'react-table';
import axios from 'axios';
import AlertMessage from '../AlertMessage';
import CONSTANTS from '../../constants';
import 'react-table/react-table.css';
import COLUMNS from './columns';
import ModalEditor from '../Modal/ModalEdit';
import ModalAdder from '../Modal/ModalAdd';
import Aux from '../../HOC/auxiliary';
import Axios from 'axios';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Button from '@material-ui/core/Button';
import If from '../../helpers/If';
import { withRouter } from 'react-router-dom'
import ModalVerify from '../Modal/ModalVerify';

const ProcessBar = () => (
    <div className='-loading -active'>
        Loading...
    </div>)
class UserProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setShow2: false,
            setShow: false,
            showVerify: false,
            contracts: [],
            user: {},
            editting: {},
            deleting: {},
            adding: {},
            loading: false,
            MessageOpen: false,
            MessageText: "",
            MessageType: 'success'
        }
    }
    static contextType = AuthContext;
    async componentDidMount() {
        const { user } = this.context;
        if (user) {
            const token = user.token;
            this.setState({ user, loading: true });
            const response = await axios.get(`${CONSTANTS.ENDPOINT.USER}/contract`, {
                headers: {
                    authorization: "Bearer " + token
                }
            });
            const { data } = response.data;
            const dataState = data.map((contract, index) => {
                return {
                    ...contract,
                    no: index + 1
                }
            });
            if (response.data.data.length) {
                this.setState({ contracts: dataState, loading: false });
            }
        }
    }

    handleDelete = async (member, contract) => {
        try {
            const response = await Axios.delete(`${CONSTANTS.ENDPOINT.CONTRACT}/${contract._id}`, {
                headers: {
                    authorization: `Bearer ${this.context.user.token}`
                }
            });
            console.log(response.data);
            const { data } = response;
            if (data.success) {
                const cloneContracts = [...this.state.contracts];
                const newContracts = cloneContracts.filter(contract => contract._id !== data.data._id);
                this.setState({
                    MessageOpen: true,
                    MessageText: data.message,
                    MessageType: "success",
                    contracts: newContracts
                });
            }
            else {
                this.setState({
                    MessageOpen: true,
                    MessageText: data.message,
                    MessageType: "warning",
                });
            }

        } catch (error) {
            console.log(error);

        }
    }

    handleEdit = (member, contract) => {
        this.setState({ setShow2: true, editting: { member, contract } });
    }

    handleAdd = (contract, email) => {
        this.setState({ setShow: true, adding: contract });
    }

    handleClose = () => {
        this.setState({ setShow: false, setShow2: false, showVerify: false })
    }

    handleView = async (contract) => {
        axios(`${CONSTANTS.ENDPOINT.CONTRACT}/${contract._id}`, {
            responseType: "blob",
            method: "get",
        })
            .then(async res => {
                if (res.data.type === "application/json") {
                    const text = await res.data.text();
                    console.log("response file:", text);
                    const json = JSON.parse(text);
                    this.setState({ MessageOpen: true, MessageText: json.message, MessageType: "warning" });
                    return;
                }
                const blob = new Blob([res.data], {
                    type: "application/pdf"
                });
                const file = new File([blob], "contract.pdf", { type: blob.type });
                console.log("file", file);
                this.props.history.push({
                    pathname: '/upload',
                    state: {
                        file, contract
                    }
                });
            })
    }
    handleCloseAlert = () => {
        this.setState({ MessageOpen: false, MessageText: '' })
    }
    getColumn = () => {
        const columns = [{ ...COLUMNS.No }, { ...COLUMNS.ContractName }, { ...COLUMNS.Owner('', '') },
        { ...COLUMNS.Counterpart('', '') }, { ...COLUMNS.Email() },
        {
            ...COLUMNS.Action(this.handleEdit, this.handleDelete, this.handleAdd, this.handleView)
        }
        ];
        return columns;
    }
    onEdit = async (contractId, body) => {
        try {
            const { token } = this.state.user;
            const response = await Axios.put(`${CONSTANTS.ENDPOINT.CONTRACT}/${contractId}`, body, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });
            if (response.data) {
                console.log("response update contract", response.data);
                if (response.data.message) {
                    this.setState({ MessageOpen: true, MessageText: response.data.message });
                    return;
                }
                const cloneContracts = [...this.state.contracts];
                const index = cloneContracts.findIndex(contract => contract._id === contractId);
                if (~index) {
                    cloneContracts[index] = {
                        ...response.data,
                        no: cloneContracts[index].no
                    };
                    this.setState({ MessageOpen: true, MessageText: "Updated successful!", contracts: cloneContracts });
                }
            }

        } catch (error) {
            console.log("Error", error);
            this.setState({
                MessageOpen: true,
                MessageText: error.response.data.message,
                MessageType: 'warning'
            })
        }
    }
    handleShowVerify = () => {
        this.setState({ showVerify: true })
    }
    onAdd = async (contractId, email) => {
        try {
            const response = await Axios.get(`${CONSTANTS.ENDPOINT.MAIL}/invite/${contractId}&${email}`, {
                headers: {
                    authorization: `Bearer ${this.state.user.token}`,
                }
            });
            if (response.data) {
                this.setState({ MessageOpen: true, MessageText: response.data.message });
            }
        } catch (error) {
            console.log("error add", error);
            this.setState({ MessageOpen: true, MessageText: error.response.data.message });
        }
    }
    onVerify = async (code) => {
        try {
            const response = await Axios.get(`${CONSTANTS.ENDPOINT.VERIFY}/${code}`, {
                headers: {
                    authorization: `Bearer ${this.state.user.token}`,
                }
            });
            if (response.data) {
                this.setState({ MessageOpen: true, MessageText: response.data.message });
            }
        } catch (error) {
            console.log("error verify", error);
            this.setState({ MessageOpen: true, MessageText: error.response.data.message });
        }
    }
    render() {
        const { contracts, user } = this.state;
        return (
            <Aux>
                <Button
                    variant="contained"
                    onClick={() => this.handleShowVerify()}
                    color="primary"
                    startIcon={<VerifiedUserIcon />}
                >Verify</Button>
                <div className='UserProfile__page'>
                    <div className='UserProfile__page--table'>
                        <h1>CONTRACT</h1>
                        <ReactTable
                            data={contracts}
                            columns={this.getColumn()}
                            className="-striped -highlight"
                            defaultPageSize={5}
                            loading={this.state.loading}
                            LoadingComponent={() => this.state.loading ? <ProcessBar /> : null}
                        />
                    </div>
                    <div className='UserProfile__page--profile'>
                        <div className="container">
                            <h1>PROFILE</h1>

                            <div>
                                <Avatar size={64} icon="user" />
                                <h5 ><strong id="user-name">{user.username}</strong></h5>
                                <p id="user-frid">{user.address || 'Address'} </p>
                                <p id="user-email">{user.email}</p>
                                <p ><strong>A/C status: </strong><span className="tags" id="user-status">Active</span></p>
                                <p ><strong>Job role</strong></p>
                                <p id="user-role">user</p>
                            </div>
                        </div>

                    </div>
                </div>
                <If condition={this.state.setShow} component={ModalAdder} props={{
                    onHide: this.handleClose,
                    show: this.state.setShow,
                    onAdd: this.onAdd,
                    data: this.state.adding,
                }} />
                <If condition={this.state.setShow2} component={ModalEditor} props={{
                    onHide: this.handleClose,
                    show: this.state.setShow2,
                    onEdit: this.onEdit,
                    data: this.state.editting,
                }} />
                <If condition={this.state.showVerify} component={ModalVerify} props={{
                    onHide: this.handleClose,
                    show: this.state.showVerify,
                    onVerify: this.onVerify
                }} />
                <AlertMessage
                    open={this.state.MessageOpen}
                    text={this.state.MessageText}
                    onClose={this.handleCloseAlert}
                    type={this.state.MessageType}
                />
            </Aux>
        )
    }
}
export default withRouter(UserProfilePage);