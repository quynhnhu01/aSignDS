import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import If from '../../helpers/If';
import Aux from '../../HOC/auxiliary';
import AlertMessage from '../AlertMessage';
import { register } from '../../services/authen.service';
import { useAuthContext } from '../../contexts/auth.context';

export default function Register(props) {
    const [MessageOpen, setMessageOpen] = useState(false);
    const [MessageText, setMessageText] = useState('');
    const [MessageType, setMessageType] = useState('');
    const { user } = useAuthContext();
    const handleRegister = async user => {
        const response = await register(user)
        const { message, error, success } = response.data;
        const typeAlert = error || !success ? 'warning' : 'success';
        setMessageType(typeAlert);
        setMessageOpen(true);
        setMessageText(message);
        if (typeAlert === 'success') {
            props.history.push('/login');
        }
    }
    const handleClose = () => {
        setMessageOpen(false);
        setMessageText('');
    }
    if (user) props.history.push('/');
    return (
        <Aux>
            <RegisterForm register={handleRegister} />
            <If condition={MessageOpen} component={AlertMessage} props={
                {
                    open: MessageOpen,
                    text: MessageText,
                    onClose: handleClose,
                    type: MessageType
                }
            } />
        </Aux>
    )
}