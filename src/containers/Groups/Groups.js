import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from '../../axios-dashboard';
import Moment from 'react-moment';
import shortid from 'shortid';
import './Groups.css'


class Groups extends Component {
    state = {
        groups: {
            data: []
        },
        component_group_name : null,
        component_group_codes: {
            data: []
        },
        pagination:{
            prev: null,
            next: null,
            first: null,
            last: null
        },
        showModal : false,
        headers:  {
            main : [ 'Group Name', 'Default', 'Remaining Life', 'Expiring Soon' ],
            component_code : [ 'Abbreviation', 'Component Code', 'Group', 'Delete' ]
        }

    }
    componentDidMount() {
        if( this.props.isAuthenticated ){
            const _this = this;
            axios.get( '/component/groups', { headers : { Authorization: 'Bearer ' + this.props.access_token }})
                .then(function (response) {
                    //_this.props.onAlertGetSuccess();
                    _this.setState({ ..._this.state, groups: response.data, pagination: response.data.links })
                })
                .catch(function (error) {
                    _this.props.onAlertGetFail("Unauthorized") ;
                });
        }
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
                    if( error.request.status == 401 ){
                        _this.onAlertGetFail("Unauthorized");
                    }
                });
        }

    }


    showComponentCodes = ( id, name ) => {
        this.getComponentGroupCodes( id, name );

    }

    getComponentGroupCodes = ( id, name ) => {
        if( this.props.isAuthenticated ){
            const _this = this;
            axios.get( '/component/groups/' + id, { headers : { Authorization: 'Bearer ' + this.props.access_token }})
                .then(function (response) {
                    //_this.props.onAlertGetSuccess();
                    _this.setState({ ..._this.state, component_group_name: name, group_component_codes: response.data, pagination: response.data.links });
                    _this.setModalShow( true );
                }
            )
                .catch(function (error) {
                    _this.props.onAlertGetFail("Unauthorized");
                }
            );
        }

    }

    setModalShow = ( show ) => {
        this.setState({ ...this.state, showModal: show });
    }

    onCloseErrorGroups = () =>{
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
            errorMessage = <Alert style={{zIndex:99999}}  show={this.props.error} onClose= { this.onCloseErrorGroups } dismissible variant="danger">{this.props.error_msg}</Alert>;

        }
        let hospitalName = null;
        let body = [];
        let next = null;
        let prev = null;
        if( this.state.groups.data.length > 0 ){
            hospitalName = this.state.groups.data[0].attributes.hospital.name + " Component Groups ";
            this.state.groups.data.forEach((group, index) => {
                body.push(
                    <tr className='groups' key={shortid.generate()} onClick={ () => this.showComponentCodes(group.attributes.component_group.id, group.attributes.component_group.name)}>
                        <td key={shortid.generate()}>{group.attributes.component_group.name}</td>
                        <td key={shortid.generate()}>{group.attributes.component_group.is_default == 1 ? 'True' : 'False' }</td>
                        <td key={shortid.generate()}>{group.attributes.component_group.remaining_life}</td>
                        <td key={shortid.generate()}>{group.attributes.component_group.expiring_soon}</td>
                    </tr>
                );

            })
            /*
            if ( this.state.pagination.next ) {
                next = <Button style={{display: 'flex', justifyContent: 'flex-end', margin: '2px' }} onClick={() => this.onGetPage(this.state.pagination.next)} type='button'>Previous</Button> ;
            }
            if ( this.state.pagination.prev ){
                prev = <Button style={{display: 'flex', justifyContent: 'flex-end', margin: '2px'}} onClick={() => this.onGetPage(this.state.pagination.prev)} type='button'>Next</Button> ;
            }
            */

        }

        return (
            <React.Fragment>
                {errorMessage}
                <Modal show={this.state.showModal} onHide={ () => this.setModalShow(false) } backdrop="true">
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.component_group_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Body
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={ () => this.setModalShow(false)}>Close</Button>
                        <Button variant="primary" onClick={() => this.setModalShow(false)}>Ok</Button>
                    </Modal.Footer>
                  </Modal>
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
        onAlertGetFail: ( error ) => dispatch( actions.alertGetFail( error ) ),
        onAlertFailHandle: () => dispatch( actions.authFailHandle() ),
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Groups );
