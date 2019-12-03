import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './index.scss';
import { Input } from 'antd';
export default function ModalAdder(props) {
    const { show, onHide, data, onAdd } = props;
    const [partnerEmail, setpartnerEmail] = useState('');
    return (
        <div className="modal__AddEmail">
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Add A Counterpart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter Couterpart Email</p>
                    <Input
                        className="email"
                        type="text"
                        onChange={(e) => setpartnerEmail(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
        </Button>
                    <Button variant="primary" onClick={() => {
                        onAdd(data._id, partnerEmail);
                        onHide();
                    }}>
                        Add
        </Button>
                </Modal.Footer>
            </Modal>
        </div>)
}