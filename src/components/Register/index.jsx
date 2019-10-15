import React, { Component } from 'react';
import RegisterForm from './RegisterForm';
import CONSTANTS from '../../constants';
import Axios from 'axios';
import If from '../../helpers/If';
import Aux from '../../HOC/auxiliary';
import WarningMessage from '../WarningMessage';
export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            uuid: "",
            isAuthenticated: false,
            WarningMessageOpen: false,
            WarningMessageText: ""
        }
    };
    handleRegister = async (user) => {
        const response = await Axios.post(CONSTANTS.ENDPOINT.REGISTER, { ...user });
        console.log(response);
        const { data } = response;
    }
    render() {
        const { WarningMessageOpen, WarningMessageText } = this.state;
        return (
            <Aux>
                <RegisterForm register={this.handleRegister} />
                <If condition={WarningMessageOpen} component={WarningMessage} props={
                    {
                        open: WarningMessageOpen,
                        text: WarningMessageText,
                        onWarningClose: this.handleWarningClose
                    }
                } />
            </Aux>
        )
    }
}