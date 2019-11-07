import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
function checkPasswordConfirm(password, passwordConfirm) {
    return password === passwordConfirm;
}
export default function RegisterForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const inputElementRef = useRef(null);
    useEffect(() => {
        inputElementRef.current.focus();
    }, []);
    return (
        <div style={{ justifyContent: 'center', display: 'flex', margin: '5px', alignItems: 'center' }} >
            <div className="col-md-3" >
                <h3>Register new account</h3>
                <hr />
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                    </div>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="form-control"
                        placeholder="Full name"
                        type="text"
                        ref={inputElementRef}
                    />
                </div>
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                    </div>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" placeholder="Username" type="text" />
                </div>
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                    </div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email address" type="email" />
                </div>
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-phone"></i> </span>
                    </div>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder="Phone number" type="text" />
                </div>
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                    </div>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Create password" type="password" />
                </div>
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                    </div>
                    <input value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="form-control" placeholder="Repeat password" type="password"
                        onBlur={(e) => checkPasswordConfirm(password, e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block"
                        onClick={(e) => {
                            const isMatch = checkPasswordConfirm(password, passwordConfirm)
                            if (!isMatch) {
                                alert("Wrong repeat password");
                                return;
                            };
                            const user = {
                                username: username,
                                email: email,
                                fullName: fullName,
                                password: password,
                                phone: phone,
                            }
                            props.register(user);
                        }}
                    > Create Account  </button>
                </div>
                <p className="text-center">Have an account? <Link className="nav-item nav-link active" to="/login">Login</Link> </p>
            </div>
        </ div>
    )
}
