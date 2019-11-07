import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import CONSTANTS from '../../constants';
import Aux from '../../HOC/auxiliary';
import LoginForm from './LoginForm';
import AlertMessage from '../AlertMessage';
import If from '../../helpers/If';
import { AuthContext } from '../../contexts/auth.context';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            uuid: "",
            MessageOpen: false,
            MessageText: "",
            redirectToRefer: false,
        }
    };
    static contextType = AuthContext;
    handleLogin = async (username, password) => {
        const response = await axios.post(CONSTANTS.ENDPOINT.LOGIN, {
            username: username,
            password: password
        });
        const { data } = response;
        const { user, onLogin } = this.context;
        console.log("response from server:", response.data);
        if (typeof data.username !== "undefined") {
            console.log("login successful");
            this.setState({
                username: data.username,
                token: data.token,
                MessageOpen: false,
                redirectToRefer: this.props.location.state ? true : false
            });
            onLogin({ user: data });
            const { redirectToRefer } = this.state;
            const { history, location } = this.props;
            redirectToRefer ? history.push(location.state.from.pathname) : history.push('/');
        }
        else {
            this.setState({ MessageOpen: true, MessageText: response.data.message });
        }
    };
    handleClose = () => {
        this.setState({
            MessageOpen: false,
            MessageText: ""
        });
    }
    render() {
        const { MessageOpen, MessageText } = this.state;
        return (
            <Aux>
                <div className="mainLogin">
                    <LoginForm login={this.handleLogin} />
                    <If condition={MessageOpen} component={AlertMessage} props={
                        {
                            open: MessageOpen,
                            text: MessageText,
                            onClose: this.handleClose,
                            type: 'warning',
                        }
                    } />
                </div>
            </Aux>
        )
    }
}