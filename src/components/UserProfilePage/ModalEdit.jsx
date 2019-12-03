import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './index.scss';
import { Input } from 'antd';

export default function ModalEditor(props) {
    const { show, onHide, data, onEdit } = props;
    const [contractName, setcontractName] = useState('');
    return (
        <div className="modal_EditContract">
            <Modal show={show} onHide={() => onHide()}>
                <Modal.Header closeButton>
                    <Modal.Title>Add A Counterpart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Contract Name</p>
                    <Input
                        type="text"
                        placeholder={data.contract.nameContract}
                        onChange={(e) => setcontractName(e.target.value)}
                    />
                    <p>Owner</p>
                    <input
                        type="text"
                        name="Owner"
                        value={data.contract.owner.username}
                        disabled
                    />
                    <p>Counterpart</p>
                    <input
                        type="text"
                        name="Counterpart"
                        value={data.member.username}
                        disabled
                    />
                    <p>Couterpart Email</p>
                    <input
                        name="Email"
                        type="text"
                        value={data.member.email}
                        // onChange={e => setEmail(e.target.value)}
                        disabled
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onHide()}>
                        Close
                        </Button>
                    <Button variant="primary" onClick={() => {
                        onHide();
                        onEdit(data.contract._id, { nameContract: contractName });
                    }}>
                        Save
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}