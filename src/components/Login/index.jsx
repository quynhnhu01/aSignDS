import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import CONSTANTS from '../../constants';
import Aux from '../../HOC/auxiliary';
import LoginForm from './LoginForm';
import WarningMessage from '../WarningMessage';
import If from '../../helpers/If';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            uuid: "",
            isAuthenticated: false,
            WarningMessageOpen: false,
            WarningMessageText: "",
            redirectToRefer: false,
        }
    };
    componentDidMount() {
        const accessToken = window.sessionStorage.getItem("access_token");
        if (accessToken) {
            this.setState({ isAuthenticated: true });
        }
        else this.setState({ isAuthenticated: false });
    };
    handleLogin = async (username, password) => {
        const response = await axios.post(CONSTANTS.ENDPOINT.LOGIN, {
            username: username,
            password: password
        });
        const { data } = response;
        console.log("response from server:", response.data);
        if (typeof data.username !== "undefined") {
            console.log("login successful");
            this.setState({
                username: data.username,
                token: data.token,
                isAuthenticated: true,
                WarningMessageOpen: false,
                redirectToRefer: true
            });
            window.sessionStorage.setItem("access_token", data.token);

        }
        else {
            this.setState({ WarningMessageOpen: true, WarningMessageText: response.data.message });
        }
    };
    handleWarningClose = () => {
        this.setState({
            WarningMessageOpen: false,
            WarningMessageText: ""
        });
    }
    render() {
        const { WarningMessageOpen, WarningMessageText, redirectToRefer } = this.state;
        if (redirectToRefer) {
            const { from } = this.props.location.state;
            console.log("from: ", from);
            return (<Redirect to={from} />)
        }
        return (
            <Aux>
                <div className="mainLogin">
                    <If condition={!this.state.isAuthenticated} component={LoginForm} props={{ login: this.handleLogin }} />
                    <If condition={WarningMessageOpen} component={WarningMessage} props={
                        {
                            open: WarningMessageOpen,
                            text: WarningMessageText,
                            onWarningClose: this.handleWarningClose
                        }
                    } />
                </div>
            </Aux>
        )
    }
}