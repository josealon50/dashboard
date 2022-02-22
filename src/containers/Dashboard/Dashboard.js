import React, { Component } from 'react';
import Inventory from '../Inventory/Inventory';
import Expired from '../Expired/Expired';
import Alert from '../Alerts/Inventory/Alert';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from '../../axios-dashboard';
import styles from './Dashboard.css';
import Moment from 'react-moment';
import shortid from 'shortid';
import FunctionalModal from '../../components/Modal/FunctionalModal';
import Badge from 'react-bootstrap/Badge';
import moment from 'moment';



class Dashboard extends Component {
    state = {
        hospital_id: this.props.match.params.id,
        hospital : null,
        levels: null,
        groups: null,
        num_orders: null,
        num_shipments: null,
        not_found: false,
        headers : {
            expired: [ 'Unit number', 'Component Code', 'Expiration Date', 'Remaining Time' ]
        }
    }

    showNotFoundMessage = ( show ) => {
        this.state.not_found = show;
    }

    getHospitalInfo = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospitals/' + hospital_id)
            .then(function (response) {
                _this.setState({ hospital: response.data.data.attributes });
            })
            .catch(function (error) {

            });
    }

    getHospitalOrders = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/orders')
            .then(function (response) {
                _this.setState({ num_orders: response.data.data.num_orders });
            })
            .catch(function (error) {

            });
    }

    getHospitalShipments = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/shipments')
            .then(function (response) {
                _this.setState({ num_shipments: response.data.data.num_shipments });

            })
            .catch(function (error) {

            });
    }

    getHospitalShipments = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/shipments')
            .then(function (response) {
                _this.setState({ num_shipments: response.data.data.num_shipments });

            })
            .catch(function (error) {

            });
    }

    componentDidMount() {
        //Do calls to the endpoints  
        this.getHospitalInfo( this.state.hospital_id );

        //Put this calls on a timer every 5 mins
        this.getHospitalOrders( this.state.hospital_id );
        this.getHospitalShipments( this.state.hospital_id );

    }


    render () {
        let hospital = null;
        let hospitalName = null;
        let lastDataRefresh = null;
        let date = null;

        if ( this.state.hospital ){
            hospitalName = this.state.hospital.name;
            lastDataRefresh = <Moment format="MM-DD-YYYY hh:mm:ss">{moment.utc(this.state.hospital.last_data_refresh)}</Moment>;
        }         

        return (
            <React.Fragment>
                <div style={{paddingTop: '120px'}}>
                    <Container>
                        <Alert hospital_id={this.state.params.hospital_id} />
                        <Row>
                            <Col>
                                <div style={{display: 'block', textAlign: 'center'}}>
                                    <h4>{hospitalName}</h4>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div style={{display: 'block', textAlign: 'center'}}>
                                    <h4>Last Inventory Data Refresh: {lastDataRefresh}</h4>
                                </div>
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <h4 style={{float: 'left'}}>Orders: {this.state.num_orders}  Shipments: {this.state.num_shipments}</h4>
                                <h4 style={{float: 'right'}}>Units To Expire</h4>
                            </Col>
                        </Row>
                    </Container>
                    <Container>
                        <Row>
                            <Col xl='6'>
                                <Inventory hospital_id={this.state.hospital_id}/>
                            </Col>
                            <Col xl='6'>
                                <Expired hospital_id={this.state.hospital_id}/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Dashboard );
