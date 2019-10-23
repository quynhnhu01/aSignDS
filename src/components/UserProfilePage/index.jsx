import React, { Component, Fragment } from 'react'
import './index.scss'

const data = [
  {
    id: 1,
    ContractName: 'Hop Dong A',
    Counterpart: 'Nguyen Dinh Tai'
  },
  {
    id: 2,
    ContractName: 'Hop Dong D',
    Counterpart: 'Nguyen Van A'
  },
  {
    id: 3,
    ContractName: 'Hop dong C',
    Counterpart: 'Tran Thi C'
  }
]
const person = {
  photo: 'https://api-cdn.spott.tv/rest/v004/image/images/e91f9cad-a70c-4f75-9db4-6508c37cd3c0?width=587&height=599',
  userName: "Nguyen Dinh Tai",
  email :  "16521051@gm.uit.edu.vn",
  job: "student",
  address: "abc1245"

}

 

export default class UserProfilePage extends Component {
  render() {
    return (
      <Fragment>
        <div className='UserProfile__page'>
          <div className='UserProfile__page--table'>
          <h1>CONTRACT</h1>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Contract Name</th>
                  <th scope="col">Counterpart</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((data) =>
                    <tr>
                      <th scope="row">{data.id}</th>
                      <td>{data.ContractName}</td>
                      <td>{data.Counterpart}</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
          <div className='UserProfile__page--profile'>
            <div className="container">
              <h1>PROFILE</h1>
              <div className="row">
                <div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                      <div className="well profile col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                          <figure>
                            {/* <img src={photo} alt="" className="img-circle"  id="user-img"/> */}
                          </figure>
                          <h5 ><strong id="user-name">{person.userName}</strong></h5>
                          <p id="user-frid">{person.address} </p>
                          <p id="user-email">{person.email}</p>
                          <p ><strong>A/C status: </strong><span className="tags" id="user-status">Active</span></p>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 divider text-center"></div>
                          <p ><strong>Job role</strong></p>
                          <p id="user-role">{person.job}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}
