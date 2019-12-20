import React from 'react';
import matchSorter from 'match-sorter';
import './index.scss';
const ActionInput = ({ member, contract, handleEdit, handleDelete, handleAdd, handleView }) => {
    return (
        <div className="UserProfile__page--table__action">
            <div className="UserProfile__page--table__action-edit" onClick={() => handleEdit(member, contract)} style={{ cursor: 'pointer' }}>
                <img src="https://cdn2.iconfinder.com/data/icons/education-2-45/48/71-512.png" alt="icon-edit" />
            </div>
            <div className="UserProfile__page--table__action-add" onClick={() => handleAdd(contract)} style={{ cursor: 'pointer' }} >
                <img src="https://cdn4.iconfinder.com/data/icons/ios7-essence/22/add_plus-512.png" alt="icon-add" />
            </div>
            <div className="UserProfile__page--table__action-delete" onClick={() => handleDelete(member, contract)} style={{ cursor: 'pointer' }}>
                <img src="https://cdn2.iconfinder.com/data/icons/apple-inspire-white/100/Apple-64-512.png" alt="icon-delete" />
            </div>
            <div className="UserProfile__page--table__action-delete" onClick={() => handleView(contract)} style={{ cursor: 'pointer' }}>
                <img src="eyes.png" alt="icon-view" />
            </div>
        </div>
    )
}
const No = {
    Header: 'No',
    width: 70,
    id: 'NoId',
    // accessor: d => d.node.id,
    Cell: props => <div>{props.original.no}</div>,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["node-root"] }),
    filterAll: true
};
const ContractName = {
    Header: 'ContractName',
    accessor: 'contract.nameContract',
    id: 'contract._id',
    width: 250,
    Cell: props => <span>{props.original.nameContract}</span>,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["node-type"] }),
    filterAll: true
};
const Owner = () => {
    return {
        id: 'Owner',
        Header: 'Owner',
        width: 110,
        accessor: d => d.owner._id,
        Cell: props => {
            const { username } = props.original.owner;
            // console.log(props.original);
            return username
        },
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["owner"] }),
        filterAll: true
    }
};
const Counterpart = () => {
    return {
        Header: props => <span>Counterpart</span>,
        id: 'Counterpart',
        Cell: props => {
            const { partner } = props.original;
            return partner.length > 0 ? partner.map(member => <div
                className="UserProfile__page--table__action"
                key={member.username}>
                {member.username}
            </div>) : ''
        },
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["Counterpart"] }),
        filterAll: true,
        width: 170,
    }
};
const Email = () => {
    return {
        id: 'email',
        Header: 'Email',
        width: 225,
        accessor: d => d.partner.map(member => member.email),
        Cell: props => {
            const { partner } = props.original;
            return partner.length > 0 ? partner.map(member => <div
                className="UserProfile__page--table__action"
                key={member.email}
            >
                {member.email}
            </div>) : ''
        },
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["cost"] }),
        filterAll: true,
    }
};
const Action = (handleEdit, handleDelete, handleAdd, handleView) => {
    return {
        Header: 'Action',
        id: 'action',
        Cell: props => {
            const { partner } = props.original;
            return partner.length > 0 ? partner.map(member => <ActionInput
                key={member.username}
                member={member}
                contract={props.original}
                handleEdit={handleEdit}
                handleAdd={handleAdd}
                handleDelete={handleDelete}
                handleView={handleView}
            />) : (
                    <div className="UserProfile__page--table__action">
                        <div className="UserProfile__page--table__action-add" onClick={() => handleAdd(props.original)} style={{ cursor: 'pointer' }} >
                            <img src="https://cdn4.iconfinder.com/data/icons/ios7-essence/22/add_plus-512.png" alt="icon-add" />
                        </div>
                        <div className="UserProfile__page--table__action-delete" onClick={() => handleDelete('', props.original)} style={{ cursor: 'pointer' }}>
                            <img src="https://cdn2.iconfinder.com/data/icons/apple-inspire-white/100/Apple-64-512.png" alt="icon-delete" />
                        </div>
                        <div className="UserProfile__page--table__action-delete" onClick={() => handleView(props.original)} style={{ cursor: 'pointer' }}>
                            <img src="eyes.png" alt="icon-view" />
                        </div>
                    </div>
                )
        },
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["action"] }),
        filterAll: true,
        // width: 160
    }
}
const COLUMNS = { No, Owner, Counterpart, Email, Action, ContractName }
export default COLUMNS;