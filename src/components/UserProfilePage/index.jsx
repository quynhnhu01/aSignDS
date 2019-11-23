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
            index: 0
        }
    }
    static contextType = AuthContext;
    componentDidMount() {
    }

    handleDelete = () => {

    }

    handleEdit = () => {
        
    }
    
    handleAdd = (index) => {
        this.setState({ setShow2: true, index: index - 1  })
        console.log(this.state.index)
    }
    
    handleClose = () => {
        this.setState({ setShow: false, setShow2: false, id: 0, index: 0})
        console.log(this.state.id)
    }

    handleShow = (id) => {
        this.setState({ setShow: true, id  })
        console.log(this.state.id)
    }

    handleChangeEmail= (e) => {
        const id = this.state.id;
        const newData = [...this.state.data];
        newData[id - 1].Email = e.target.value
        this.setState({ data: newData })
    }

    handleChange= (e) => {
        const index = this.state.index;
        const newData = [...this.state.data];
        newData[index][e.target.name] = e.target.value
        this.setState({ data: newData })
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
        const { person,data } = this.state
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
                                    data.map((data) =>
                                        <tr key={data.id}>
                                            <th scope="row">{data.id}</th>
                                            <td>{data.ContractName}</td>
                                            <td>{data.Owner}</td>
                                            <td>{data.Counterpart}</td>
                                            <td>{data.Email}</td>
                                            <td className="UserProfile__page--table__action">
                                                
                                                <div className="UserProfile__page--table__action-edit" onClick={() => this.handleAdd(data.id)}>
                                                    <img src="https://cdn2.iconfinder.com/data/icons/education-2-45/48/71-512.png" alt="icon-edit" />
                                                </div>
                                                <div className="UserProfile__page--table__action-add" onClick={() => this.handleShow(data.id)} >
                                                    <img src="https://cdn4.iconfinder.com/data/icons/ios7-essence/22/add_plus-512.png" alt="icon-add" />
                                                </div>
                                                <div className="UserProfile__page--table__action-delete">
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
                                <h5 ><strong id="user-name">{person.userName}</strong></h5>
                                <p id="user-frid">{person.address} </p>
                                <p id="user-email">{person.email}</p>
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
                            value={this.state.data[this.state.index].ContractName}
                            onChange={this.handleChange}
                            />
                            <p>Owner</p>
                            <input
                            type="text"
                            name="Owner"
                            value={this.state.data[this.state.index].Owner}
                            onChange={this.handleChange}
                            />
                            <p>Counterpart</p>
                            <input
                            type="text"
                            name="Counterpart"
                            value={this.state.data[this.state.index].Counterpart}
                            onChange={this.handleChange}
                            />
                            <p>Couterpart Email</p>
                            <input
                            name="Email"
                            type="text"
                            value={this.state.data[this.state.index].Email}
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
