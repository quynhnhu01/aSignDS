import React, { useEffect, useRef, useState } from 'react';
export default function LoginForm(props) {
    const inputElementRef = useRef(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        inputElementRef.current.focus();
    }, []);
    return (
        <div style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="col-md-3"  >
                <div className="form-group">
                    <input
                        value={username}
                        type="text"
                        placeholder="Username"
                        ref={inputElementRef}
                        className="form-control"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button onClick={() => props.login(username, password)} className="btn btn-primary">Login</button>
                </div>
            </div>
        </div>
    )
}