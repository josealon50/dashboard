import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/alert';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from '../../axios-dashboard';
import styles from './Dashboard.css';
import Moment from 'react-moment';
import shortid from 'shortid';
import FunctionalModal from '../../components/Modal/FunctionalModal';
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
            dashboard: [ 'Product Group', 'Current Inventory', 'CMV Neg', 'Ship', 'Projected Inv', 'Exp Soon', 'Par Level', 'Crit Level' ],
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

    getHospitalLevels = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/levels')
            .then(function (response) {
                let levels = response.data.data;
                let component_levels = [];
                Object.keys(levels).forEach(function(item) { 
                    let tmp = 
                    {  
                            component_code: levels[item].attributes.component_group_id.name, 
                            critical: levels[item].attributes.critical,
                            internal_low: levels[item].attributes.internal_low,
                            internal_par: levels[item].attributes.internal_par,
                            low: levels[item].attributes.low,
                            par: levels[item].attributes.par,
                            expiring_soon: levels[item].attributes.component_group_id.expiring_soon,
                            remaining_life: levels[item].attributes.component_group_id.remaining_life,
                            inventory: 0,
                            cmv_neg: 0,
                    }
                            
                    component_levels[levels[item].attributes.component_group_id.name] = tmp;
                });
                _this.setState({ levels: component_levels });

            })
            .catch(function (error) {

            });
    }

    getHospitalInventory = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/inventory')
            .then(function (response) {
                let inv = response.data.data;
                let inventory = [];
                Object.keys(inv).forEach(function(idx) { 
                    let tmp = 
                    {  
                            unit_number: inv[idx].attributes.component.unit_number, 
                            expiration_date: inv[idx].attributes.component.expiration_date,
                            component_code: inv[idx].attributes.component.component_code.component_code,
                            cmv_neg: inv[idx].attributes.component.special_label.id == 1,
                    }
                            
                    inventory.push(tmp);
                });
                _this.setState({ inventory: inventory });

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
        this.getHospitalLevels( this.state.hospital_id );
        this.getHospitalInventory( this.state.hospital_id );

    }


    render () {
        let hospital = null;
        let units_to_expire = [];
        let body = [];
        let hospitalName = null;

        if ( this.state.hospital ){
            hospitalName = this.state.hospital.name;
        }         
        
        if( this.state.inventory && this.state.levels ){
            //Create inventory object group by component code with appropriate inventory levels
            this.state.inventory.forEach(( cmp, idx ) => {
                if( cmp['component_code'] in this.state.levels ){
                    if( cmp['cmv_neg'] ){
                        this.state.levels[cmp['component_code']].cmv_neg += 1;
                    }
                    else{
                        this.state.levels[cmp['component_code']].inventory += 1;
                    }

                    //Check for expire soon components
                    let now = moment(new Date());
                    let expire = moment(cmp.expiration_date).add(this.state.levels[cmp['component_code']].expiring_soon, 'hours'); 
                    let diff = moment.duration(expire.diff(now));
                    if ( diff.asHours() < 24 ){
                        units_to_expire.push( cmp ); 
                    }
                }
                    
            });

            for( const idx in this.state.levels ){
                if( typeof idx !== 'undefined' ){
                    body.push(
                        <tr key={shortid.generate()}>
                            <td key={shortid.generate()}>{this.state.levels[idx].component_code}</td>
                            <td key={shortid.generate()}>{this.state.levels[idx].inventory}</td>
                            <td key={shortid.generate()}>{this.state.levels[idx].cmv_neg}</td>
                            <td key={shortid.generate()}>0</td>
                            <td key={shortid.generate()}>{this.state.levels[idx].inventory + this.state.levels[idx].cmv_neg}</td>
                            <td key={shortid.generate()}>{units_to_expire.length}</td>
                            <td key={shortid.generate()}>{this.state.levels[idx].par}</td>
                            <td key={shortid.generate()}>{this.state.levels[idx].critical}</td>
                        </tr>
                    );
                }
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
                                <h4 style={{float: 'left'}}>Orders: {this.state.num_orders}  Shipments: {this.state.num_shipments}</h4>
                                <h4 style={{float: 'right'}}>Units To Expire</h4>
                            </Col>
                        </Row>
                    </Container>
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col>
                                <Table responsive>
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
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <Table responsive>
                                            <thead>
                                                <tr key={shortid.generate()}>
                                                    { this.state.headers.expired.map((header, index) => (
                                                        <th key={shortid.generate()}>{header}</th>))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
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
