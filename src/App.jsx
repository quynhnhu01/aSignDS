import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Grid from "./components/Grid";
import About from "./components/About";
import { DefaultLayout } from "./layouts/default";
import Register from "./components/Register";
//TODO Web Template Studio: Add routes for your new pages here.
class App extends Component {
    render() {
        return (
            <DefaultLayout>
                <Switch>
                    <Redirect exact path="/" to="/Grid" />
                    <Route path="/Grid" component={Grid} />
                    <Redirect exact path="/" to="/login" />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Redirect exact path="/" to="/about" />
                    <Route path="/about" component={About} />
                </Switch>
            </DefaultLayout>
        );
    }
}

export default App;
