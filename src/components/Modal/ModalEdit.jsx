import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

import './index.scss';
import { Input } from 'antd';

export default function ModalEditor(props) {
    const { show, onHide, data, onEdit } = props;
    const [contractName, setcontractName] = useState('');
    return (
        <div className="modal_EditContract">
            <Modal show={show} onHide={() => onHide()}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Contract</Modal.Title>
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
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onHide()}>
                        Close
                        </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
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