import React, { useContext, useMemo, useState, useEffect, createContext } from 'react';
export const AuthContext = createContext(null);
const initAuthData = {};
const AuthProvider = (props) => {
    const [authData, setAuthData] = useState(initAuthData);
    useEffect(() => {
        const userString = window.sessionStorage.getItem('user');
        const user = JSON.parse(userString);
        if (user) {
            setAuthData(user);
        }
    }, []);
    const onLogout = () => {
        setAuthData(initAuthData);
        window.sessionStorage.clear();
    }
    const onLogin = newAuthData => {
        setAuthData(newAuthData);
        window.sessionStorage.setItem('user', JSON.stringify(newAuthData));
    }
    // const authDataValue = useMemo({ ...authData, onLogout, onLogin }, [authData]);
    const authDataValue = { ...authData, onLogout, onLogin };
    return <AuthContext.Provider value={authDataValue} {...props} />
};
export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;