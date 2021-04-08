import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import './Auth.css';


class Auth extends Component {
    state = {
        username : null,
        password : null
    }
    componentDidMount () {
        if ( this.props.authRedirectPath !== '/' ) {
            this.props.onSetAuthRedirectPath();
        }
    }

    submitHandler = ( event ) => {
        event.preventDefault();
        if ( this.state.username && this.state.password  ){
            const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());
            this.props.onAuth( formDataObj.username, formDataObj.password );
        }
    }

    onCloseAlert = () =>{
        window.setTimeout(()=>{
            this.props.onAuthFailHandle();
        },100);
    }

    setUsername = ( username ) => {
        this.setState({'username' : username}); 
    }
    setPassword = ( password ) => {
        this.setState({'password' : password}); 
    }


    render () {
        let authRedirect = null;
        if ( this.props.isAuthenticated ) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        let errorMessage = null;
        if ( this.props.error ) {
            errorMessage = <Alert show={this.props.error} onClose={this.onCloseAlert} dismissible variant="danger">{this.props.error_msg}</Alert>
        }


        let form =  
            <React.Fragment>
                <Container>
                    <Row className="justify-content-md-center">
                        <center>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="email" placeholder="Username" name="username" onChange={ e => this.setUsername(e.target.value) }/>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" name="password" onChange={ e => this.setPassword(e.target.value) }/>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </center>
                    </Row>
                </Container>
            </React.Fragment>

        return (
                <div>
                    {errorMessage}
                    {authRedirect}
                    <Container>
                        <Row className="center">
                            <form onSubmit={this.submitHandler}>
                                {form}
                            </form>
                        </Row>
                    </Container>
                </div>
            );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        error: state.auth.error,
        error_msg : state.auth.error_msg,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( email, password ) => dispatch( actions.auth( email, password ) ),
        onAuthFailHandle:  () => dispatch( actions.authFailHandle() ),
        onSetAuthRedirectPath: () => dispatch( actions.setAuthRedirectPath( '/' ) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Auth );
