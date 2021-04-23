import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Moment from 'react-moment';
import shortid from 'shortid';

const componentModal = ( props ) => {
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
                                    <td key={shortid.generate()}>{body['unit_number']}</td>
                                    <td key={shortid.generate()}>{body['component_code']}</td>
                                    <td key={shortid.generate()}>{body['blood_type']}</td>
                                    <td key={shortid.generate()}>{body['group']}</td>
                                    <td key={shortid.generate()}>{body['crossover']}</td>
                                    <td key={shortid.generate()}>{ body['expiration_date'] ? <Moment format="MM-DD-YYYY HH:MM:SS">{body['expiration_date']}</Moment> : ' ' }</td> 
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

export default componentModal;
