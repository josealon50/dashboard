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
import styles from './Dashboard.css';
import Moment from 'react-moment';
import shortid from 'shortid';
import FunctionalModal from '../../components/Modal/FunctionalModal';



class Dashboard extends Component {
    state = {
        hospital_id: this.props.match.params.id,
        hospital : null,
        inventory: null,
        levels: null,
        groups: null,
        num_orders: null,
        num_shipments: null,
        not_found: false
        
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
                    }
                            
                    component_levels.push(tmp);
                });
                _this.setstate({ levels: component_levels });

            })
            .catch(function (error) {

            });
    }

    getHospitalInventory = ( hospital_id ) => {
        const _this = this;
        axios.get( '/hospital/' + this.state.hospital_id + '/inventory')
            .then(function (response) {
                _this.setState({ inventory: response.data.data });

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
        let hospital = null
        if ( this.state.hospital ){
            hospital = <h1>{this.state.hospital.name}</h1>;
        }         
        return (
            <React.Fragment>
                {hospital}
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
