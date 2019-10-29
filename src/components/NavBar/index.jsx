import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import If from "../../helpers/If";
const HiddenWithAuth = ({ component: Component, isAuthenticated }) => (
    <If condition={isAuthenticated} component={Component} />
)
const Login = () => <Link className="nav-item nav-link active" to="/login">Login</Link>
const Register = () => <Link className="nav-item nav-link active" to="/register">Register</Link>


export default function NavBar() {
    const accessToken = window.sessionStorage.getItem('access_token');
    const isAuthenticated = accessToken && accessToken.length > 0;
    return (
        <React.Fragment>
            <div className={styles.skipLink}>
                <a href="#mainContent">Skip to Main Content</a>
            </div>
            <nav className="navbar navbar-expand-sm navbar-light border-bottom justify-content-between">
                <Link className="navbar-brand" to="/" style={{ fontWeight: 'bold' }}>
                    <img src="logo.png" alt="logo" width="162px" height="54px" />
                </Link>
                <div className="navbar-nav">
                    <Link className="nav-item nav-link active" to="/">Home</Link>
                    <If condition={!isAuthenticated} component={Login} />
                    <If condition={!isAuthenticated} component={Register} />

                    <Link className="nav-item nav-link active" to="/about">About</Link>
                    <Link className="nav-item nav-link active" to="/upload">Upload</Link>
                    <Link className="nav-item nav-link active" to="/logout">Logout</Link>
                    <Link className="nav-item nav-link active" to="/profile">Profile</Link>
                </div>
            </nav>
        </React.Fragment>
    );
}
