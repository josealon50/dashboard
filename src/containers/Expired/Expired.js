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
import Moment from 'react-moment';
import shortid from 'shortid';
import FunctionalModal from '../../components/Modal/FunctionalModal';
import Badge from 'react-bootstrap/Badge';
import moment from 'moment';



class Expired extends Component {
    state = {
        hospital_id: this.props.hospital_id,
        headers : {
            expired: [ 'Unit number', 'Component Code', 'Expiration Date', 'Remaining Time' ]
        }
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
        this.getHospitalComponentsAboutToExpire( this.state.hospital_id );

    }

    render () {
        let units_to_expire = [];
        let expired = [];
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

export default connect( mapStateToProps, mapDispatchToProps )( Expired );
