import React, { Component, Fragment } from 'react'
import './index.scss'
import { AuthContext } from "../../contexts/auth.context";
import { Redirect } from 'react-router-dom';
import { Avatar } from 'antd';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import CONSTANTS from '../../constants';

const data = [
    {
        id: 1,
        ContractName: 'Hop Dong A',
        Owner: 'Nguyen THi A',
        Counterpart: 'Nguyen Dinh Tai',
        Email: ''
    },
    {
        id: 2,
        ContractName: 'Hop Dong D',
        Owner: 'Nguyen THi A',
        Counterpart: 'Nguyen Van A',
        Email: ''
    },
    {
        id: 3,
        ContractName: 'Hop dong C',
        Owner: 'Nguyen THi A',
        Counterpart: 'Tran Thi C',
        Email: ''
    }
]
const person = {
    photo: 'https://api-cdn.spott.tv/rest/v004/image/images/e91f9cad-a70c-4f75-9db4-6508c37cd3c0?width=587&height=599',
    userName: "Nguyen Dinh Tai",
    email: "16521051@gm.uit.edu.vn",
    job: "student",
    address: "abc1245"

}



export default class UserProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: data,
            person: person,
            showAddEmail: false,
            showEditContract: false,
            setShow2: false,
            setShow: false,
            counterpartEmail: '',
            id: 0,
            index: 0,
            contracts: []
        }
    }
    static contextType = AuthContext;
    async componentDidMount() {
        const { token } = this.context.user;
        const response = await axios.get(`${CONSTANTS.ENDPOINT.USER}/contract`, {
            headers: {
                authorization: "Bearer " + token
            }
        });
        console.log('contract user', response.data);
        if (response.data.data.length) {
            this.setState({ contracts: response.data.data })
        }
    }

    handleDelete = () => {

    }

    handleEdit = () => {

    }

    handleAdd = (index) => {
        this.setState({ setShow2: true, index: index - 1 })
        console.log(this.state.index)
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

    render() {
        const { person, data, contracts, index } = this.state;
        const { user } = this.context;
        return (
            <Fragment>
                <div className='UserProfile__page'>
                    <div className='UserProfile__page--table'>
                        <h1>CONTRACT</h1>
                        <table className="table">
                            <thead>
                                <tr>

                                    <th scope="col">No</th>
                                    <th scope="col">Contract Name</th>
                                    <th scope="col">Owner</th>
                                    <th scope="col">Counterpart</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.contracts.map((contract, index) =>
                                        <tr key={contract._id}>
                                            <th scope="row">{index}</th>
                                            <td>{contract.nameContract}</td>
                                            <td>{contract.owner.username}</td>
                                            <td>{contract.partner[0] ? contract.partner[0].username : ''}</td>
                                            <td>{contract.partner[0] ? contract.partner[0].email : ''}</td>
                                            <td className="UserProfile__page--table__action">

                                                <div className="UserProfile__page--table__action-edit" onClick={() => this.handleAdd(data.id)} style={{ cursor: 'pointer' }}>
                                                    <img src="https://cdn2.iconfinder.com/data/icons/education-2-45/48/71-512.png" alt="icon-edit" />
                                                </div>
                                                <div className="UserProfile__page--table__action-add" onClick={() => this.handleShow(data.id)} style={{ cursor: 'pointer' }} >
                                                    <img src="https://cdn4.iconfinder.com/data/icons/ios7-essence/22/add_plus-512.png" alt="icon-add" />
                                                </div>
                                                <div className="UserProfile__page--table__action-delete" style={{ cursor: 'pointer' }}>
                                                    <img src="https://cdn2.iconfinder.com/data/icons/apple-inspire-white/100/Apple-64-512.png" alt="icon-delete" />
                                                </div>

                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
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
                                <p id="user-role">{person.job}</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="modal__AddEmail">
                    <Modal show={this.state.setShow} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add A Counterpart</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Enter Couterpart Email</p>
                            <input
                                className="email"
                                type="text"
                                placeholder="Example: abc@gmail.com"
                                onChange={this.handleChangeEmail}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                        </Button>
                            <Button variant="primary" onClick={this.handleAddPartner}>
                                Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="modal_EditContract">
                    <Modal show={this.state.setShow2} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add A Counterpart</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Contract Name</p>
                            <input
                                type="text"
                                name="ContractName"
                                // value={contracts[index].nameContract}
                                onChange={this.handleChange}
                            />
                            <p>Owner</p>
                            <input
                                type="text"
                                name="Owner"
                                // value={contracts[this.state.index].owner}
                                onChange={this.handleChange}
                            />
                            <p>Counterpart</p>
                            <input
                                type="text"
                                name="Counterpart"
                                // value={contracts[this.state.index].partner[0].fullName}
                                onChange={this.handleChange}
                            />
                            <p>Couterpart Email</p>
                            <input
                                name="Email"
                                type="text"
                                // value={contracts[this.state.index].partner[0].email}
                                onChange={this.handleChange}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                        </Button>
                            <Button variant="primary" onClick={this.handleClose}>
                                Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Fragment>
        )
    }
}
