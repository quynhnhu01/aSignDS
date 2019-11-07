import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import If from "../../helpers/If";
import { useAuthContext } from "../../contexts/auth.context";
const HiddenWithAuth = ({ component: Component, isAuthenticated }) => (
    <If condition={isAuthenticated} component={Component} />
)
const Login = () => <Link className="nav-item nav-link active" to="/login">Login</Link>
const Register = () => <Link className="nav-item nav-link active" to="/register">Register</Link>
export const Logout = () => {
    const { onLogout } = useAuthContext();
    return (
        <button className="btn btn-primary" onClick={() => onLogout()}>Logout</button>
    )
}
const Upload = () => <Link className="nav-item nav-link active" to="/upload">Upload</Link>
const Profile = (props) => {
    return (
        <div style={{ display: 'flex' }}>
            <Link className="nav-item nav-link active"
                to="/profile"
            >{props.username}</Link>
            <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg" width="40" height="40" className="rounded-circle" />

            {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-list-4" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbar-list-4">
                <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg" width="40" height="40" className="rounded-circle" />
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a className="dropdown-item" href="#">Dashboard</a>
                            <a className="dropdown-item" href="#">Edit Profile</a>
                            <a className="dropdown-item" href="#">Log Out</a>
                        </div>
                    </li>
                </ul>
            </div> */}
        </div>
    )
}

export default function NavBar() {
    const { user } = useAuthContext();
    return (
        <React.Fragment>
            <div className={styles.skipLink}>
                <a href="#mainContent">Skip to Main Content</a>
            </div>
            <nav className="navbar navbar-dark bg-dark navbar-expand-sm border-bottom justify-content-between ">
                <Link className="navbar-brand" to="/" style={{ fontWeight: 'bold' }}>
                    <img src="logo.png" alt="logo" width="162px" height="54px" />
                </Link>
                <div className="navbar-nav">
                    <Link className="nav-item nav-link active" to="/">Home</Link>
                    <If condition={!user} component={Login} />
                    <If condition={!user} component={Register} />

                    <If condition={user} component={Upload} />
                    <If condition={user} component={Profile} props={user} />
                    <Link className="nav-item nav-link active" to="/about">About</Link>
                    <If condition={user} component={Logout} />

                </div>
            </nav>
        </React.Fragment>
    );
}
