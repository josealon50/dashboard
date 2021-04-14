import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/row';
import ListGroup from 'react-bootstrap/ListGroup'
import './Landing.css';
import axios from '../../axios-dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



class Landing extends Component {
    state = {
        'list_modules' : {
            'reports' : {
                'name' : 'Reports',
                'img' : 'file',
                'active' : false,
                'href' : 'Reports'
            },
            'shipments' : {
                'name' : 'Shipments',
                'img' : 'truck',
                'active' : false,
                'href' : 'Shipments'
            },
            'hospitals' : {
                'name' : 'Hospitals',
                'img' :  'hospital',
                'active' : false,
                'href' : 'Hospitals'
            },
            'alerts' : {
                'name' : 'Alerts',
                'img' : 'bell',
                'active' : false,
                'href' : 'Alerts'
            },
            'users' : {
                'name' : 'Users', 
                'img' : 'users',
                'active' : false,
                'href' : 'Users'
            },
            'phenotypes' : {
                'name' : 'Phenotypes',
                'img' : 'search',
                'active' : false,
                'href' : 'Phenotypes'
            },
            'orders' : {
                'name' : 'Orders',
                'img' : "receipt",
                'active' : false,
                'href' : 'Orders'
            }
        }
    }

    componentDidMount() {
        if( this.props.isAuthenticated ){
            const _this = this;
            axios.get( '/me', { headers : { Authorization: 'Bearer ' + localStorage.getItem('access_token') }})
                .then(function (response) {
                    let access = _this.state.list_modules;
                    response.data.data.forEach( temp => {
                        if( temp.attributes.active ){
                            access[temp.attributes.module.name].active = true;
                        }
                    });
                    _this.setState({list_modules : access});
                })
                .catch(function (error) {
                    //Alert about error
                });
        }
    }



    render () {
        let redirect = null;
        if ( !this.props.isAuthenticated ) {
            redirect = <Redirect to='/' />
        }

        let accessModules = Object.keys( this.state.list_modules )
            .map( listKey => {
                return [...Array( this.state.list_modules[listKey] )].map( ( m, i ) => {
                    if( m.active ){
                        return <ListGroup.Item key={listKey + i} action bsPrefix='button' href={m.href}><FontAwesomeIcon style={{color: 'rgb( 6, 126, 189 )', 'vertical-align': 'middle', 'font-size': '400%' }} icon={m.img}/> <span className='module_name'>{m.name}</span></ListGroup.Item> ;


                    }
                });
            });
        return (
                <div className="center">
                    {redirect}
                    <Container>
                        <Row className="justify-content-md-center">
                            <center>
                                <ListGroup horizontal='md'> 
                                    {accessModules}
                                </ListGroup>
                            </center>
                        </Row>
                    </Container>
                </div>
            );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        error: state.auth.error,
        error_msg : state.auth.error_msg,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetLandingRedirectPath: () => dispatch( actions.setLandingRedirectPath( '/' ) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Landing );
