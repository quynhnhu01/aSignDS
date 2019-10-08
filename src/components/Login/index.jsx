import React, { Component } from 'react';
import axios from 'axios';
import CONSTANTS from '../../constants';
import Aux from '../../HOC/auxiliary';
import LoginForm from './LoginForm';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            uuid: "",
            isLoggedIn: false
        }
    };
    componentDidMount() {

    };
    handleLogin = async ({ username, password }) => {
        const response = await axios.post(CONSTANTS.ENDPOINT.LOGIN, {
            username: username,
            password: password
        });
        this.setState({ username: response.data.username, token: response.data.token });
    }
    render() {
        return (
            <Aux>
                <div className="mainLogin">
                    <LoginForm />
                </div>
            </Aux>
        )
    }
}