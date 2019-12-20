import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import './index.scss';
import { Input } from 'antd';
export default function ModalVerify(props) {
    const { show, onHide, onVerify } = props;
    const [code, setcode] = useState('');
    return (
        <div className="modal__Verify">
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Verify</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter Code</p>
                    <Input
                        className="email"
                        type="text"
                        onChange={(e) => setcode(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onHide}>
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            console.log(code);
                            
                            onVerify(code);
                            onHide();
                        }}>
                        Verify
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>)
}