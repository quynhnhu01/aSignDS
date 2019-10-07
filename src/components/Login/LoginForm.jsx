import React, { useEffect, useRef } from 'react';

export default function LoginForm(props) {
    const inputElementRef = useRef(null);
    useEffect(() => {
        inputElementRef.current.focus();
    }, []);
    return (
        <div style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="col-md-3"  >
                <div className="form-group">
                    <input type="text" placeholder="Username" ref={inputElementRef} className="form-control" required />
                    <input type="password" className="form-control" placeholder="Password" required />
                    <button type="submit" onClick={() => alert("login")} className="btn btn-primary">Login</button>
                </div>
            </div>
        </div>
    )
}