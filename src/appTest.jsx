import React, { Component } from "react";
import { Route, Switch, Redirect, Router } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Grid from "./components/Grid";
import About from "./components/About";
import UploadPage from "./components/UploadPage"
import UserProfilePage from "./components/UserProfilePage"
import { DefaultLayout } from "./layouts/default";
import Register from "./components/Register";
import { PrivateRoute } from "./helpers/PrivateRoute";
//TODO Web Template Studio: Add routes for your new pages here.
class AppTest extends Component {
    render() {
        return (
            <DefaultLayout>
                    <Route exact path="/" component={Grid} />
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/profile" component={UserProfilePage} />
            </DefaultLayout>

        );
    }
}

export default AppTest;
