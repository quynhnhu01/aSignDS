import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Grid from "./components/Grid";
import About from "./components/About";
import UploadPage from "./components/UploadPage"
import UserProfilePage from "./components/UserProfilePage"
import { DefaultLayout } from "./layouts/default";
import Register from "./components/Register";
// import { PrivateRoute } from "./helpers/PrivateRoute";
class App extends Component {
    render() {
        return (
            <DefaultLayout>
                <Switch>
                    <Redirect exact path="/" to="/Grid" />
                    <Route path="/Grid" component={Grid} />
                    <Redirect exact path="/" to="/login" />
                    <Route path="/login" component={Login} />
                    <Redirect exact path="/" to="/register" />
                    <Route path="/register" component={Register} />
                    <Redirect exact path="/" to="/about" />
                    <Route path="/about" component={About} />
                    <Redirect exact path="/" to="/upload" />
                    <Route path="/upload" render={(props) => <UploadPage {...props} />} />
                    <Redirect exact path="/" to="/profile" />
                    <Route path="/profile" component={UserProfilePage} />
                    {/* <PrivateRoute path="/profile" authenticated={isAuthenticated} component={UserProfilePage} /> */}
                    <button onClick={(e) => {
                        window.sessionStorage.removeItem("access_token");
                    }}>Clear access_token</button>
                </Switch>
            </DefaultLayout>
        );
    }
}

export default App;
