import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Moment from 'react-moment';
import shortid from 'shortid';

const confirmModal = ( props ) => {
    return (
        <Modal {...props} show={props.show}>
          <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>{props.body}</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>Close</Button>
            <Button variant="primary" onClick={props.saveChanges}>Save changes</Button>
          </Modal.Footer>
        </Modal>
    );
}

export default confirmModal;
