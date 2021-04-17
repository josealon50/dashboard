import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/row';
import Alert from 'react-bootstrap/alert';
import Table from 'react-bootstrap/Table'
import axios from '../../axios-dashboard';
import styles from './Orders.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Moment from 'react-moment';
import shortid from 'shortid';



class Orders extends Component {
    state = {
        orders: {
            data: []
        },
        pagination:{
            prev: null,
            next: null,
            first: null,
            last: null
        },
        header:  [ 'Employee', 'Priority', 'Status', 'Created'  ]

        
    }

    componentDidMount() {
        if( this.props.isAuthenticated ){
            this.props.onOrderGetStart();
            const _this = this;

            axios.get( '/orders', { headers : { Authorization: 'Bearer ' + localStorage.getItem('access_token') }})
                .then(function (response) {
                    _this.props.onOrderGetSuccess();
                    _this.setState({ ..._this.state, orders: response.data, pagination: response.data.links })
                })
                .catch(function (error) {
                    if( error.request.status == 401 ){
                        _this.props.onOrderGetFail("Unauthorized") ;
                    }
                });
        }
    }

    onCloseErrorAlert = () =>{
        window.setTimeout(()=>{
            this.props.onOrderFailHandle();
        },100);
    }



    render () {
        let redirect = null;
        if ( !this.props.isAuthenticated ) {
            redirect = <Redirect to='/' />
        }

        let errorMessage = null;
        if ( this.props.error ){
            //Create the alert 
            errorMessage = <Alert style={{zIndex:99999}}  show={this.props.error} onClose={this.onCloseErrorAlert} dismissible variant="danger">{this.props.error_msg}</Alert>;

            //this.onSetAuthRedirectPath('/');
        }
        let hospitalName = null;
        let body = [];
        if( this.state.orders.data.length > 0 ){
            hospitalName = this.state.orders.data[0].attributes.hospital.name + " Orders ";
            
            this.state.orders.data.forEach((order, index) => { 
                body.push(
                    <tr key={shortid.generate()}>
                        <td key={shortid.generate()}>{order.attributes.emp_initials}</td>
                        <td key={shortid.generate()}>{order.attributes.priority}</td>
                        <td key={shortid.generate()}>Order</td>
                        <td key={shortid.generate()}><Moment format="MM-DD-YYYY HH:MM:SS">{order.attributes.created_at}</Moment></td>
                    </tr>
                );
            })
        }
        
        
        return (
                <React.Fragment>
                    {errorMessage}
                    <div style={{paddingTop: '120px'}}>
                        <Container>
                            <h3>{hospitalName}</h3>
                            <center>
                                <Row className="justify-content-md-center">
                                    <Table responsive>
                                        <thead>
                                            <tr key={shortid.generate()}>
                                                { this.state.header.map((header, index) => (
                                                    <th key={shortid.generate()}>{header}</th>))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {body}
                                        </tbody>
                                    </Table>
                                </Row>
                            </center>
                        </Container>
                    </div>
                </React.Fragment>
            );
    }
}

const mapStateToProps = state => {
    return {
        access_token: state.auth.token,
        isAuthenticated: state.auth.token !== null,
        error: state.auth.error,
        error_msg : state.auth.error_msg,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderGetStart: () => dispatch( actions.orderGetStart() ),
        onOrderGetSuccess: () => dispatch( actions.orderGetSuccess() ),
        onOrderGetFail: ( error ) => dispatch( actions.orderGetFail(error) ),
        onOrderFailHandle: () => dispatch( actions.authFailHandle() ),
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Orders );
