import React, { Component } from 'react';
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
        inventory: null,
        levels: null,
        groups: null,
        num_orders: null,
        num_shipments: null,
        not_found: false,
        headers : {
            dashboard: [ 'Product Group', 'Current Inv', 'CMV Neg', 'Ship', 'Proj Inv', 'Exp Soon', 'Par Level', 'Crit Level' ],
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
                _this.setState({ num_orders: response.data.data.length });
            })
            .catch(function (error) {

            });
    }

    getHospitalShipments = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/shipments')
            .then(function (response) {
                _this.setState({ num_shipments: response.data.data.length });

            })
            .catch(function (error) {

            });
    }

    getHospitalInventory = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/inventory')
            .then(function (response) {
                _this.setState({ inventory: response.data });

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getHospitalComponentsAboutToExpire = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/components/expired')
            .then(function (response) {
                _this.setState({ units_to_expire: response.data });

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        //Do calls to the endpoints  
        this.getHospitalInfo( this.state.hospital_id );

        //Put this calls on a timer every 5 mins
        this.getHospitalOrders( this.state.hospital_id );
        this.getHospitalShipments( this.state.hospital_id );
        this.getHospitalInventory( this.state.hospital_id );
        this.getHospitalComponentsAboutToExpire( this.state.hospital_id );

    }


    render () {
        let hospital = null;
        let units_to_expire = [];
        let body = [];
        let expired = [];
        let hospitalName = null;
        let lastDataRefresh = null;
        let date = null;

        if ( this.state.hospital ){
            hospitalName = this.state.hospital.name;
            lastDataRefresh = <Moment format="MM-DD-YYYY hh:mm:ss">{moment(this.state.hospital.last_data_refresh).local()}</Moment>;
        }         
        
        if( this.state.inventory  ){
            for( const idx in this.state.inventory.data ){
                body.push(
                    <tr key={shortid.generate()}>
                        <td key={shortid.generate()}>{this.state.inventory.data[idx].group_name}</td>
                        <td key={shortid.generate()}>{this.state.inventory.data[idx].units_available}</td>
                        <td key={shortid.generate()}>{this.state.inventory.data[idx].cmv_neg}</td>
                        <td key={shortid.generate()}>0</td>
                        <td key={shortid.generate()}>{this.state.inventory.data[idx].units_available}</td>
                        <td key={shortid.generate()}>{this.state.inventory.data[idx].soon_to_expired}</td>
                        <td key={shortid.generate()}>{this.state.inventory.data[idx].par}</td>
                        <td key={shortid.generate()}>{this.state.inventory.data[idx].critical}</td>
                    </tr>
                );
            }

        }

        if( this.state.units_to_expire ){
            for( const idx in this.state.units_to_expire.data ){
                expired.push(
                    <tr key={shortid.generate()}>
                        <td key={shortid.generate()}>{this.state.units_to_expire.data[idx].attributes.component.unit_number}</td>
                        <td key={shortid.generate()}>{this.state.units_to_expire.data[idx].attributes.component.component_code.component_code}</td>
                        <td key={shortid.generate()}><Moment format="MM-DD-YYYY hh:mm:ss">{moment(this.state.units_to_expire.data[idx].attributes.component.expiration_date).local()}</Moment></td>
                        <td key={shortid.generate()}><Moment diff={new Date()} unit="hours">{this.state.units_to_expire.data[idx].attributes.component.expiration_date}</Moment></td>
                    </tr>
                );
            }
        }
        return (
            <React.Fragment>
                <div style={{paddingTop: '120px'}}>
                    <Container>
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
                                <Table bordered responsive>
                                    <thead>
                                        <tr key={shortid.generate()}>
                                            { this.state.headers.dashboard.map((header, index) => (
                                                <th key={shortid.generate()}>{header}</th>))
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {body}
                                    </tbody>
                                </Table>
                                <Table responsive>
                                    <tbody>
                                        <tr>
                                            <td style={{width: 'auto', border: 'none',heigth: '70%'}}>
                                                <Badge style={{margin: '5px'}} pill pill variant="success">Adequate Level </Badge>
                                                <Badge style={{margin: '5px'}} pill variant="warning">Caution </Badge>
                                                <Badge style={{margin: '5px'}} pill variant="danger">Critical Level </Badge>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col xl='6'>
                                <Table bordered responsive>
                                    <thead>
                                        <tr key={shortid.generate()}>
                                            { this.state.headers.expired.map((header, index) => (
                                                <th key={shortid.generate()}>{header}</th>))
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expired}
                                    </tbody>
                                </Table>
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
