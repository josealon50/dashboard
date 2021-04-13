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
                'active' : false
            },
            'shipments' : {
                'name' : 'Shipments',
                'img' : 'truck',
                'active' : false
            },
            'hospitals' : {
                'name' : 'Hospitals',
                'img' :  'hospital',
                'active' : false
            },
            'components' : {
                'name' : 'Components',
                'img' : 'glasses',
                'active' : false
            },
            'users' : {
                'name' : 'Users', 
                'img' : 'users',
                'active' : false
            },
            'phenotypes' : {
                'name' : 'Phenotypes',
                'img' : 'search',
                'active' : false
            },
            'orders' : {
                'name' : 'Orders',
                'img' : "receipt",
                'active' : false
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
                        return <ListGroup.Item key={listKey + i}><FontAwesomeIcon icon={m.img}/> {m.name} </ListGroup.Item> ;


                    }
                });
            });
        return (
                <div className="center">
                    {redirect}
                    <Container>
                        <Row className="justify-content-md-center">
                            <center>
                                <ListGroup horizontal> 
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
