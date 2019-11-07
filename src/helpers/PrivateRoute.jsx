import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/auth.context';

export const PrivateRoute = ({ component: Component, ...options }) => {
    const { user } = useAuthContext();
    return (
        <Route {...options} render={props => (
            user ?
                <Component {...props} /> :
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )}>
        </Route>)
}