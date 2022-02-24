import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../../shared/utility';
import * as actions from '../../../store/actions/index';
import Modal from 'react-bootstrap/Modal'
import Moment from 'react-moment';
import shortid from 'shortid';
import Alert from 'react-bootstrap/Alert';
import axios from '../../../axios-dashboard';


class ComponentAlert extends Component {
    interval = null;
    state = {
        hospital_id: this.props.hospital_id,
        alerts: null,
        showModal : false,
    }

    componentDidMount() {
        const _this = this;
        this.interval = setInterval(() => 
            axios.get( '/alerts/hospital/' + this.state.hospital_id ).then(
                function (response) {
                    if( response.data.data.length > 0 ){
                        _this.setState({ ..._this.state, alerts: response.data, showModal: true })
                    }
                    else{
                        _this.setState({ ..._this.state, alerts: [], showModal: false })
                    }
                }
            ), 1000 );
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    setModalShow = ( show ) => {
        this.setState({...this.state, showModal: show });
    }

    render () {
        var list = [];
        if ( this.state.alerts ){
           for( const idx in this.state.alerts.data ){  
                list.push(<li key={shortid.generate()}>{this.state.alerts.data[idx].attributes.alert.alert} : {this.state.alerts.data[idx].attributes.component.unit_number}</li>);
            } 
        }

        return (
            <React.Fragment>
             <Modal show={this.state.showModal} centered>
                <Modal.Header>
                  <Modal.Title>Component Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>{list}</ul>
                </Modal.Body>
              </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        error_msg : state.auth.error_msg,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( ComponentAlert );
