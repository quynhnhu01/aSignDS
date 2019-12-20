import React, { Component, Fragment } from 'react'
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
import { withRouter } from 'react-router-dom'

const ProcessBar = props => (
    <div className='-loading -active'>
        Loading...
    </div>)
class UserProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddEmail: false,
            showEditContract: false,
            setShow2: false,
            setShow: false,
            counterpartEmail: '',
            id: 0,
            index: 0,
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
        console.log("componentDidMount");
        const { user } = this.context;
        if (user) {
            const token = user.token;
            this.setState({ user, loading: true });
            const response = await axios.get(`${CONSTANTS.ENDPOINT.USER}/contract`, {
                headers: {
                    authorization: "Bearer " + token
                }
            });
            console.log('contract user', response.data);
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

    handleDelete = (member, contract) => {
        console.log("handleDelete", member, contract);
    }

    handleEdit = (member, contract) => {
        console.log("handleEdit", member, contract);
        this.setState({ setShow2: true, editting: { member, contract } });
    }

    handleAdd = (contract, email) => {
        this.setState({ setShow: true, adding: contract });
        console.log("add new user to contract", contract.nameContract, email);

    }

    handleClose = () => {
        this.setState({ setShow: false, setShow2: false, id: 0, index: 0 })
        console.log(this.state.id)
    }

    handleShow = (id) => {
        this.setState({ setShow: true, id })
        console.log(this.state.id)
    }

    handleChangeEmail = (e) => {
        const id = this.state.id;
        const newData = [...this.state.data];
        newData[id - 1].Email = e.target.value
        this.setState({ data: newData })
    }

    handleChange = (e) => {
        const { index, contracts } = this.state;
        const newContracts = [...contracts];
        newContracts[index][e.target.name] = e.target.value;
        this.setState({ contracts: newContracts })
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
    handleAddPartner = async () => {
        const id = this.state.id;
        const newData = [...this.state.data];
        console.log(newData[id - 1].Email);
        // const response = await axios.post(CONSTANTS.ENDPOINT.ADDPARTNER, {
        //     // file: pdf
        // });
        this.setState({ setShow: false })

    };
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
            let newContracts;
            if (response.data) {
                console.log("response update contract", response.data);
                if (response.data.message) {
                    this.setState({ MessageOpen: true, MessageText: response.data.message });
                    return;
                }
                const oldContracts = [...this.state.contracts];
                newContracts = oldContracts.map(contract => {
                    if (contract._id === contractId) {
                        return { ...response.data, no: contract.no };
                    }
                    return contract;
                });
                console.log(newContracts);
            }
            this.setState({ MessageOpen: true, MessageText: "Updated successful!", contracts: [...newContracts] });

        } catch (error) {
            console.log("Error", error);
            this.setState({
                MessageOpen: true,
                MessageText: error.response.data.message,
                MessageType: 'warning'
            })
        }
    }
    onAdd = async (contractId, email) => {
        try {
            console.log("call add user to contract", contractId, email);
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
    render() {
        const { contracts, user } = this.state;
        return (
            <Aux>
                <Fragment>
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
                    {this.state.setShow ? <ModalAdder
                        show={this.state.setShow}
                        data={this.state.adding}
                        onHide={this.handleClose}
                        onAdd={this.onAdd}
                    /> : null}
                    {this.state.setShow2 ? <ModalEditor
                        show={this.state.setShow2}
                        data={this.state.editting}
                        onHide={this.handleClose}
                        onEdit={this.onEdit}
                    /> : null}

                </Fragment>
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