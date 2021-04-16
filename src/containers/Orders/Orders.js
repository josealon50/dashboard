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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



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
                    _this.props.onOrderGetFail( error );
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
            errorMessage = <Alert style={{zIndex:99999}}  show={this.props.error} onClose={this.onCloseErrorAlert} dismissible variant="danger">{this.props.error_msg}</Alert>
        }

        let orders = null;
        if( this.state.orders.data.length > 0 ){
            orders = <td>TEST</td>;            

        }
        return (
                <div className="center">
                    {errorMessage}
                    <Container>
                        <Row>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>TEST</th>
                                        <th>TEST</th>
                                        <th>TEST</th>
                                        <th>TEST</th>
                                    </tr>
                                </thead>
                                {{orders}}
                            </Table>
                        </Row>
                    </Container>
                </div>
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
        onOrderFailHandle: () => dispatch( actions.orderGetFailHandle() ),
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Orders );
