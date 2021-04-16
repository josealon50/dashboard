import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import "./Navigation.css";
import sdbb from '../..//assets/sdbb-70yrs.png';


const navigationItems = ( props ) => (
    <Navbar className='color-nav container-fluid' variant="dark" fixed="top" expand="lg">
      <Navbar.Brand href="/"><img src={sdbb} width="30%" height="25%" className="d-inline-block align-top" alt="SDBB Dashboard"/></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
            { !props.isAuthenticated ? <Nav.Link href="/">Login</Nav.Link> : <Nav.Link href="/logout">Logout</Nav.Link> }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
);

export default navigationItems;
