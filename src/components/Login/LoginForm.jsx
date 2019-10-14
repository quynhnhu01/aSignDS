import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

export default function LoginForm(props) {
    const inputElementRef = useRef(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        inputElementRef.current.focus();
    }, []);
    return (
        <div style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="col-md-3" >
                <h3>Login to service</h3>
                <hr />
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                    </div>
                    <input
                        value={username}
                        type="text"
                        placeholder="Username"
                        ref={inputElementRef}
                        className="form-control"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                    </div>
                    {/* <input class="form-control" placeholder="Create password" type="password" /> */}
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div class="form-group">
                    <button onClick={() => props.login(username, password)} type="submit" class="btn btn-primary btn-block"> Login  </button>
                </div>
                <p class="text-center">Or create a new account?
                    <Link className="nav-item nav-link active" to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}