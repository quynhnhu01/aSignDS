import React, { Component, Fragment } from 'react'
import './index.scss'
import { AuthContext } from "../../contexts/auth.context";
import { Avatar } from 'antd';
import ReactTable from 'react-table';
import axios from 'axios';
import CONSTANTS from '../../constants';
import 'react-table/react-table.css';
import COLUMNS from './columns';
import ModalEditor from './ModalEdit';
import ModalAdder from './ModalAdd';
import Aux from '../../HOC/auxiliary';
const ProcessBar = props => (
    <div className='-loading -active'>
        Loading...
    </div>)
export default class UserProfilePage extends Component {
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
        // const index = this.state.index;
        // const newData = [...this.state.data];
        // newData[index][e.target.name] = e.target.value
        // this.setState({ data: newData })
        const { index, contracts } = this.state;
        const newContracts = [...contracts];
        newContracts[index][e.target.name] = e.target.value;
        this.setState({ contracts: newContracts })
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
    getColumn = () => {
        const columns = [
            {
                ...COLUMNS.No
            },

            {
                ...COLUMNS.ContractName
            },
            {
                ...COLUMNS.Owner('', '')
            },
            {
                ...COLUMNS.Counterpart('', '')
            },
            {
                ...COLUMNS.Email()
            },
            {
                ...COLUMNS.Action(this.handleEdit, this.handleDelete, this.handleAdd)
            }
        ];
        return columns;
    }
    render() {
        const { contracts, user } = this.state;
        return (
            <Aux>
                {/* {this.state.loading ? <Roller color='grey' /> : null} */}

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
                        handleAdd={this.handleAdd}
                    /> : null}
                    {this.state.setShow2 ? <ModalEditor
                        show={this.state.setShow2}
                        data={this.state.editting}
                        onHide={this.handleClose}
                    /> : null}

                </Fragment>
            </Aux>
        )
    }
}
