import React from 'react';
import { withRouter } from 'react-router-dom';
export const AuthButton = withRouter(({ history, isAuthenticated }) => {
    const ButtonLogout = props => (
        <button onClick={() => {
            props.logout();
            history.push('/');
        }}> Logout </button>
    );
    return isAuthenticated ? ButtonLogout : (<p>You are not authenticated</p>);
})