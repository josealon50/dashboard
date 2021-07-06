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
        
    }

    componentDidMount() {
        //Do calls to the endpoints  
        const _this = this;

        axios.get( '/hospitals/' + this.state.hospital_id)
            .then(function (response) {
                _this.setState({ hospital: response.data.data.attributes });
                console.log(_this.state);
            })
            .catch(function (error) {
                if( error.request.status == 404 ){
                }
            });

        axios.get( '/hospital/' + this.state.hospital_id + '/shipments')
            .then(function (response) {
            })
            .catch(function (error) {
                if( error.request.status == 404 ){
                }
            });
        axios.get( '/hospital/' + this.state.hospital_id + '/levels')
            .then(function (response) {
            })
            .catch(function (error) {
                if( error.request.status == 404 ){
                }
            });
        axios.get( '/hospital/' + this.state.hospital_id + '/inventory')
            .then(function (response) {
            })
            .catch(function (error) {
                if( error.request.status == 404 ){
                }
            });

    }


    render () {
        console.log(this.state.hospital_id);
        return (
            <React.Fragment>
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
