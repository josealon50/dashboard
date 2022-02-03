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
import styles from './Inventory.css';
import Moment from 'react-moment';
import shortid from 'shortid';
import FunctionalModal from '../../components/Modal/FunctionalModal';
import Badge from 'react-bootstrap/Badge';
import moment from 'moment';


class Inventory extends Component {
    state = {
        hospital_id: this.props.hospital_id,
        inventory: null,
        headers : {
            dashboard: [ 'Product Group', 'Current Inv', 'CMV Neg', 'Ship', 'Proj Inv', 'Exp Soon', 'Par Level', 'Crit Level' ],
        }
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

    componentDidMount() {
        this.getHospitalInventory( this.state.hospital_id );
    }

    render () {
        let body = [];

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
        return ( 
            <React.Fragment>
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
            </React.Fragment>
        )
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

export default connect( mapStateToProps, mapDispatchToProps )( Inventory );
