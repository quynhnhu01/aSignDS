import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import AppTest from './appTest';
import AuthProvider from "./contexts/auth.context";

ReactDOM.render(
    <BrowserRouter>
        <AuthProvider>
            {/* <App /> */}
            <AppTest />
        </AuthProvider>
    </BrowserRouter>,
    document.getElementById("root")
);
registerServiceWorker();
