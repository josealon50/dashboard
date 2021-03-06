import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from '../../axios-dashboard';
import styles from './Orders.css';
import Moment from 'react-moment';
import shortid from 'shortid';
import FunctionalModal from '../../components/Modal/FunctionalModal';



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
        components : [],
        statusHistory: [],
        showModal : false,
        headers:  {
            main : [ 'Employee', 'Priority', 'Status',  'Component Codes', 'Created'  ],
            orderStatus : [ 'Status Code', 'Description', 'Status Added' ],
            shipment : [ 'Abbreviation', 'Component', 'Quantity' ]
        }
        

        
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

    

    onGetPage = ( pagination )  => {
        if( this.props.isAuthenticated ){
            this.props.onOrderGetStatusStart();
            const _this = this;

            axios.get( '/orders', { headers : { Authorization: 'Bearer ' + localStorage.getItem('access_token') }})
                .then(function (response) {
                    _this.props.onOrderGetStatusSuccess();
                    _this.setState({ ..._this.state, orders: response.data, pagination: response.data.links })
                })
                .catch(function (error) {
                    if( error.request.status == 401 ){
                        _this.props.onOrderGetStatusFail("Unauthorized");
                    }
                });
        }

    }

    showOrderStatusHistory = ( order ) => {
        this.props.onOrderGetStatusStart();
        if( this.props.isAuthenticated ){
            this.props.onOrderGetStart();

            const _this = this;
            axios.get( '/order/' + order + '/status', { headers : { Authorization: 'Bearer ' + localStorage.getItem('access_token') }})
                .then(function (response) {
                    _this.props.onOrderGetStatusSuccess();
                    let statusData = [];
                    for( const key of Object.keys(response.data.data) ){
                        let tmp = [];
                        tmp[0] = response.data.data[key].attributes.order_status.status_code;
                        tmp[1] = response.data.data[key].attributes.order_status.description;
                        tmp[2] = response.data.data[key].attributes.order_status.created_at;
                        statusData.push(tmp);
                    }
                    _this.setState({ ..._this.state, statusHistory: statusData, showModal: true, components: [] });
                })
                .catch(function (error) {
                    if( error.request.status == 401 ){
                        _this.props.onOrderGetFail("Unauthorized");
                    }
                });
        }
    }

    showComponents = ( order ) => {
        this.props.onOrderGetStatusStart();
        if( this.props.isAuthenticated ){
            this.props.onOrderGetComponentStart();

            const _this = this;
            axios.get( '/order/' + order + '/components', { headers : { Authorization: 'Bearer ' + localStorage.getItem('access_token') }})
                .then(function (response) {
                    _this.props.onOrderGetComponentSuccess();
                    let comps = [];
                    for( const key of Object.keys(response.data.data) ){
                        let tmp = [];
                        tmp[0] = response.data.data[key].attributes.component_code.abbreviation;
                        tmp[1] = response.data.data[key].attributes.component_code.description;
                        tmp[2] = response.data.data[key].attributes.quantity;;
                        comps.push(tmp);
                    }
                    _this.setState({ ..._this.state, components: comps, showModal: true, statusHistory: [] });
                })
                .catch(function (error) {
                    if( error == 401 ){
                        _this.onOrderGetComponentFail("Unauthorized");
                    }
                });
        }
    }

    setModalShow = ( show ) => {
        this.setState({ ...this.state, showModal: false });
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
        let next = null;
        let prev = null;
        if( this.state.orders.data.length > 0 ){
            hospitalName = this.state.orders.data[0].attributes.hospital.name + " Orders ";
            
            this.state.orders.data.forEach((order, index) => { 
                body.push(
                    <tr key={shortid.generate()}>
                        <td hidden key={shortid.generate()}>{order.id}</td>
                        <td key={shortid.generate()}>{order.attributes.emp_initials}</td>
                        <td key={shortid.generate()}>{order.attributes.priority}</td>
                        <td key={shortid.generate()}><Button variant='link' onClick={ () => this.showOrderStatusHistory(order.id) }>History</Button></td>
                        <td key={shortid.generate()}><Button variant='link' onClick={ () => this.showComponents(order.id)}>Component Codes</Button></td>
                        <td key={shortid.generate()}><Moment format="MM-DD-YYYY HH:MM:SS">{order.attributes.created_at}</Moment></td>
                    </tr>
                );
            })
            if ( this.state.pagination.next ) {
                next = <Button style={{display: 'flex', justifyContent: 'flex-end', margin: '2px' }} onClick={() => this.onGetPage(this.state.pagination.next)} type='button'>Previous</Button> ;
            }
            if ( this.state.pagination.prev ){
                prev = <Button style={{display: 'flex', justifyContent: 'flex-end', margin: '2px'}} onClick={() => this.onGetPage(this.state.pagination.prev)} type='button'>Next</Button> ;
            }

        }
        
        return (
            <React.Fragment>
                {errorMessage}
                <FunctionalModal 
                        show={this.state.showModal} 
                        onHide={() => this.setModalShow(false)} 
                        header={this.state.statusHistory.length > 0 ? this.state.headers.orderStatus : this.state.headers.shipment} 
                        data={ this.state.statusHistory.length > 0 ? this.state.statusHistory : this.state.components }
                        title={ this.state.statusHistory.length > 0 ? 'Status History' : 'Comoponents' } 
                /> 
                <div style={{paddingTop: '120px'}}>
                    <Container>
                        <h3>{hospitalName}</h3>
                        <center>
                            <Row className="justify-content-md-center">
                                <Table responsive>
                                    <thead>
                                        <tr key={shortid.generate()}>
                                            { this.state.headers.main.map((header, index) => (
                                                <th key={shortid.generate()}>{header}</th>))
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {body}
                                    </tbody>
                                </Table>
                            </Row>
                            <Row style={{float: 'right'}}>
                                {next}
                                {prev}
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
        error_msg : state.auth.error_msg
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderGetStart: () => dispatch( actions.orderGetStart() ),
        onOrderGetSuccess: () => dispatch( actions.orderGetSuccess() ),
        onOrderGetFail: ( error ) => dispatch( actions.orderGetFail( error ) ),
        onOrderFailHandle: () => dispatch( actions.authFailHandle() ),
        onOrderGetStatusStart: () => dispatch( actions.orderGetOrderStatusStart() ),
        onOrderGetStatusSuccess: () => dispatch( actions.orderGetOrderStatusSuccess() ),
        onOrderGetStatusFail: ( error ) => dispatch( actions.orderGetOrderStatusFail( error ) ),
        onOrderGetComponentStart: () => dispatch( actions.orderGetComponentStart() ),
        onOrderGetComponentSuccess: () => dispatch( actions.orderGetComponentSucess() ),
        onOrderGetComponentFail: ( error ) => dispatch( actions.orderGetComponentFail( error ) ),
        onOrderGetPaginationStart: () => dispatch( actions.orderGetPaginationStart() ),
        onOrderGetPaginationSuccess: () => dispatch( actions.orderGetPaginationSuccess() ),
        onOrderGetPaginationFail: ( error ) => dispatch( actions.orderGetPaginationFail( error ) ),
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Orders );
