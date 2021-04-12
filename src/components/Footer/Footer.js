import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'


const footer = ( props ) => (
    <Navbar className='color-nav container-fluid' variant="dark" fixed="bottom" expand="lg">
      <Navbar.Brand className='ml-auto'>SDBB { (new Date().getFullYear()) }</Navbar.Brand>
    </Navbar>
);

export default footer;
