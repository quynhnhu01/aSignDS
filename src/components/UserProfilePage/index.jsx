import React, { Component, Fragment } from 'react'
import './index.scss'
import { AuthContext } from "../../contexts/auth.context";
import { Redirect } from 'react-router-dom';
import { Avatar } from 'antd';

const data = [
    {
        id: 1,
        ContractName: 'Hop Dong A',
        Owner: 'Nguyen THi A',
        Counterpart: 'Nguyen Dinh Tai'
    },
    {
        id: 2,
        ContractName: 'Hop Dong D',
        Owner: 'Nguyen THi A',
        Counterpart: 'Nguyen Van A'
    },
    {
        id: 3,
        ContractName: 'Hop dong C',
        Owner: 'Nguyen THi A',
        Counterpart: 'Tran Thi C'
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

        }
    }
    static contextType = AuthContext;
    componentDidMount() {
    }

    handleDelete = () => {

    }

    handleEdit = () => {
        
    }
    
    handleAdd = () => {
        
    }
    render() {
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
                                            <td className="UserProfile__page--table__action">
                                                
                                                <div className="UserProfile__page--table__action-edit">
                                                    <img src="https://cdn2.iconfinder.com/data/icons/education-2-45/48/71-512.png" alt="icon-edit" />
                                                </div>
                                                <div className="UserProfile__page--table__action-add">
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
            </Fragment>
        )
    }
}
