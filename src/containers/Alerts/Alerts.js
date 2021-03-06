import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';
import ConfirmModal from '../../components/Modal/ConfirmModal/ConfirmModal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from '../../axios-dashboard';
import Moment from 'react-moment';
import shortid from 'shortid';
import moment from 'moment';



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
        alertId : '',
        showModal : false,
        headers:  {
            main : [ 'Unit Number', 'Component Code', 'Alert', 'Cleared By', 'Cleared On', '' ],
        },

    }

    componentDidMount() {
        if( this.props.isAuthenticated ){
            this.props.onAlertGetStart();
            this.getHospitalAlerts();
        }

    }

    getHospitalAlerts() {
        const _this = this;

        axios.get( '/alerts', { headers : { Authorization: 'Bearer ' + this.props.access_token }})
            .then(function (response) {
                _this.props.onAlertGetSuccess();
                _this.setState({ ..._this.state, alerts: response.data, pagination: response.data.links })
            })
            .catch(function (error) {
                if ( error.request.status == 401 ){
                    //_this.props.onAuthFail("Unauthorized") ;
                    _this.props.onAuthFail("Session Has Expired. Please log back in.") ;
                    _this.props.onAlertFailHandle();
                    _this.setState({ ..._this.state, setModalShow: false });
                    _this.props.onLogout();
                }
            
            });
    }


    clearHospitalAlert = (id) => {
        this.setState({ ...this.state, alertId: id, showModal: true });
    }

    onGetPage = ( pagination )  => {
        this.props.onAlertGetStart();
        if( this.props.isAuthenticated ){
            const _this = this;
            axios.get( pagination, { headers : { Authorization: 'Bearer ' + this.props.access_token }})
                .then(function (response) {
                    _this.props.onAlertGetSuccess();
                    _this.setState({ ..._this.state, alerts: response.data, pagination: response.data.links })
                })
                .catch(function (error) {
                    if ( error.request.status == 401 ){
                        _this.props.onAuthFail("Unauthorized") ;
                        _this.setState({ ..._this.state, setModalShow: false});
                    }
                });
        }

    }

    clearAlert = (id) =>  {
        if( this.props.isAuthenticated ){
            this.props.onAlertGetStart();
            const _this = this;

            axios.put( '/alert/' + id + '/clear', null, { headers : { Authorization: 'Bearer ' + this.props.access_token }})
                .then(function (response) {
                    _this.props.onAlertGetSuccess();
                    _this.setState({ ..._this.state, showModal: false })
                    _this.getHospitalAlerts();

                })
                .catch(function (error) {
                    if ( error.request.status == 401 ){
                        _this.props.onAuthFail("Unauthorized") ;
                        _this.setState({ ..._this.state, setModalShow: false});
                    }
                });
        }
    }

    setModalShow = ( show ) => {
        this.setState({ ...this.state, showModal: show });
    }
    onCloseErrorAlert = () =>{
        window.setTimeout(()=>{
            this.props.onOrderFailHandle();
        },100);
    }


    render () {
        let redirect = null;
        let hospitalName = null;
        let body = [];
        let next = null;
        let prev = null;

        if ( !this.props.isAuthenticated ) {
            redirect = <Redirect to='/' />
        }

        let errorMessage = null;
        if ( this.props.error ){
            //Create the alert
            errorMessage = <Alert style={{zIndex:99999}}  show={this.props.error} onClose={this.onCloseErrorAlert} dismissible variant="danger">{this.props.error_msg}</Alert>;

        }
        if( this.state.alerts.data.length > 0 ){
            hospitalName = this.state.alerts.data[0].attributes.hospital.name + " Alerts ";

            this.state.alerts.data.forEach((halert, index) => {
                body.push(
                    <tr key={shortid.generate()}>
                        <td key={shortid.generate()}>{halert.attributes.component.unit_number}</td>
                        <td key={shortid.generate()}>{halert.attributes.component.component_code.component_code}</td>
                        <td key={shortid.generate()}>{halert.attributes.alert.alert}</td>
                        <td key={shortid.generate()}>{halert.attributes.cleared_by}</td>
                        <td key={shortid.generate()}>{halert.attributes.cleared_on ? <Moment format="MM-DD-YYYY hh:mm">{moment(halert.attributes.cleared_on).local()}</Moment> : ''}</td>
                        <td key={shortid.generate()}>{!halert.attributes.cleared_by ? <Button variant="success" onClick={() => this.clearHospitalAlert(halert.id)}>Clear</Button> : null}</td>
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
                {redirect}
                {errorMessage}
                <ConfirmModal 
                    show = {this.state.showModal}
                    title={'Hospital Alert'}
                    body={'Are you sure you want clear the alert?'}
                    onHide={ () => this.setModalShow(false)}
                    saveChanges={ () => this.clearAlert(this.state.alertId)}
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
        access_token: state.auth.access_token,
        isAuthenticated: state.auth.access_token !== null,
        error: state.auth.error,
        error_msg : state.auth.error_msg,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAlertGetStart: () => dispatch( actions.alertGetStart() ),
        onAlertGetSuccess: () => dispatch( actions.alertGetSuccess() ),
        onAuthFail: ( error ) => dispatch( actions.authFail( error )),
        onAlertFailHandle: () => dispatch( actions.authFailHandle() ),
        onCheckAuth :  () => dispatch( actions.authCheckState() ),
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Alerts );
