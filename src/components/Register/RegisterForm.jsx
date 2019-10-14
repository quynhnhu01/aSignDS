import React, { useState } from 'react';
import { Link } from "react-router-dom";
function checkPasswordConfirm(password, passwordConfirm) {
    console.log("validate password ok");
    return password === passwordConfirm;
}
export default function RegisterForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    return (
        <div style={{ justifyContent: 'center', display: 'flex', margin: '5px', alignItems: 'center' }} >
            <div className="col-md-3" >
                <h3>Register new account</h3>
                <hr />
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                    </div>
                    <input name="" class="form-control" placeholder="Full name" type="text" />
                </div>
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-envelope"></i> </span>
                    </div>
                    <input name="" class="form-control" placeholder="Email address" type="email" />
                </div>
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-phone"></i> </span>
                    </div>
                    <input name="" class="form-control" placeholder="Phone number" type="text" />
                </div>
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                    </div>
                    <input class="form-control" placeholder="Create password" type="password" />
                </div>
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                    </div>
                    <input class="form-control" placeholder="Repeat password" type="password" />
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-block"> Create Account  </button>
                </div>
                <p class="text-center">Have an account? <Link className="nav-item nav-link active" to="/login">Login</Link> </p>
            </div>
        </ div>
    )
}
