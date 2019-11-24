import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import styles from "./navbar.module.css";
import If from "../../helpers/If";
import { useAuthContext } from "../../contexts/auth.context";
const Login = () => <Link className="nav-item nav-link active" to="/login">Login</Link>
const Register = () => <Link className="nav-item nav-link active" to="/register">Register</Link>
export const Logout = () => {
    const { onLogout } = useAuthContext();
    const history = useHistory();
    const handleClick = () => {
        history.push('/');
        onLogout();
    }
    return (
        <button className="btn btn-primary" onClick={() => handleClick()}>Logout</button>
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
