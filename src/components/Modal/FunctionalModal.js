import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Moment from 'react-moment';
import shortid from 'shortid';

const functionalModal = ( props ) => {
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table> 
                    <thead>
                        <tr key={shortid.generate()}>
                            {
                                props.header.map((header, index) => (
                                    <th key={shortid.generate()}>{header}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((body, index) => (
                                <tr key={shortid.generate()}>
                                    <td key={shortid.generate()}>{body[0]}</td>
                                    <td key={shortid.generate()}>{body[1]}</td>
                                    { props.title == 'Status History' ? <td key={shortid.generate()}><Moment format="MM-DD-YYYY HH:MM:SS">{body[2]}</Moment></td> : <td>{body[2]}</td> }
                                </tr>
                            ))
                        
                        }
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default functionalModal;
