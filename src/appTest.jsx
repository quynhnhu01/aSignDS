import React, { Component } from "react";
import { Route, Switch, Redirect, Router } from "react-router-dom";
import "./App.css";
import NavBar, { Logout } from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Grid from "./components/Grid";
import About from "./components/About";
import UploadPage from "./components/UploadPage"
import UserProfilePage from "./components/UserProfilePage"
import { DefaultLayout } from "./layouts/default";
import Register from "./components/Register";
import { PrivateRoute } from "./helpers/PrivateRoute";
class AppTest extends Component {
    render() {
        return (
            <DefaultLayout>
                <Route exact path="/" component={Grid} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/about" component={About} />
                <PrivateRoute path="/upload" component={UploadPage} />
                <PrivateRoute path="/profile" component={UserProfilePage} />
                <PrivateRoute path="/logout" component={Logout} />
            </DefaultLayout>

        );
    }
}

export default AppTest;
