import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/row';
import Alert from 'react-bootstrap/alert';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from '../../axios-dashboard';
import Moment from 'react-moment';
import shortid from 'shortid';



class Alerts extends Component {
    state = {
        alerts: {
            data: []
        },
        pagination:{
            prev: null,
            next: null,
            first: null,
            last: null
        },
        components : [],
        showModal : false,
        headers:  {
            main : [ 'Unit Number', 'Component Code', 'Component Group', 'Blood Type','Cleared By', 'Cleared On', '' ],
        }

    }

    componentDidMount() {
        if( this.props.isAuthenticated ){
            //this.props.onShipmentGetStart();
            const _this = this;

            axios.get( '/alerts', { headers : { Authorization: 'Bearer ' + this.props.access_token }})
                .then(function (response) {
                    //_this.props.onShipmentGetSuccess();
                    _this.setState({ ..._this.state, alerts: response.data, pagination: response.data.links })
                })
                .catch(function (error) {
                    //_this.props.onShipmentGetFail("Unauthorized") ;
                });
        }
    }


    clearHospitalAlert = (id) => {
        //Confirm modal
    }

    onGetPage = ( pagination )  => {
        //this.props.onShipmentGetStart();
        if( this.props.isAuthenticated ){
            const _this = this;
            axios.get( pagination, { headers : { Authorization: 'Bearer ' + this.props.access_token }})
                .then(function (response) {
                    //_this.props.onShipmentGetSuccess();
                    _this.setState({ ..._this.state, alerts: response.data, pagination: response.data.links })
                })
                .catch(function (error) {
                    if( error.request.status == 401 ){
                        //_this.onShipmentGetFail("Unauthorized");
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

        }
        let hospitalName = null;
        let body = [];
        let next = null;
        let prev = null;
        if( this.state.alerts.data.length > 0 ){
            hospitalName = this.state.alerts.data[0].attributes.hospital.name + " Alerts ";

            this.state.alerts.data.forEach((halert, index) => {
                body.push(
                    <tr key={shortid.generate()}>
                        <td key={shortid.generate()}>{halert.attributes.component.unit_number}</td>
                        <td key={shortid.generate()}>{halert.attributes.component.component_code.component_code}</td>
                        <td key={shortid.generate()}>{halert.attributes.component.component_code.group}</td>
                        <td key={shortid.generate()}>{halert.attributes.component.blood_type_id.blood_type}</td>
                        <td key={shortid.generate()}>{halert.attributes.cleared_by}</td>
                        <td key={shortid.generate()}>{halert.attributes.cleared_on ? <Moment format="MM-DD-YYYY HH:MM:SS">halert.attributes.cleared_on</Moment> : ''}</td>
                        <td key={shortid.generate()}>{halert.attributes.cleared_by === '' ? <Button variant="success" onClick={() => this.clearHospitalAlert(halert.id)}>Clear</Button> : null}</td>
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
        access_token: state.auth.access_token,
        isAuthenticated: state.auth.access_token !== null,
        error: state.auth.error,
        error_msg : state.auth.error_msg,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //onAlertGetStart: () => dispatch( actions.shipmentGetStart() ),
        //onAlertGetSuccess: () => dispatch( actions.shipmentGetSuccess() ),
        //onAlertGetFail: ( error ) => dispatch( actions.shipmentGetFail( error ) ),
        //onAlertFailHandle: () => dispatch( actions.authFailHandle() ),
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Alerts );
