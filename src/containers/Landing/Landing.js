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
                'href' : 'reports'
            },
            'shipments' : {
                'name' : 'Shipments',
                'img' : 'truck',
                'active' : false,
                'href' : 'shipments'
            },
            'hospitals' : {
                'name' : 'Hospitals',
                'img' :  'hospital',
                'active' : false,
                'href' : 'hospitals'
            },
            'alerts' : {
                'name' : 'Alerts',
                'img' : 'bell',
                'active' : false,
                'href' : 'alerts'
            },
            'users' : {
                'name' : 'Users', 
                'img' : 'users',
                'active' : false,
                'href' : 'users'
            },
            'phenotypes' : {
                'name' : 'Phenotypes',
                'img' : 'search',
                'active' : false,
                'href' : 'phenotypes'
            },
            'orders' : {
                'name' : 'Orders',
                'img' : "receipt",
                'active' : false,
                'href' : 'orders'
            },
            'dashboards' : {
                'name' : 'Dashboards',
                'img' : "chart-line",
                'active' : false,
                'href' : 'dashboards'
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

        let accessModulesFirstList = Object.keys( this.state.list_modules ).slice(0, 4);
        let accessModulesSecondList = Object.keys( this.state.list_modules ).slice(4, 8);
        return (
                <div className="center">
                    {redirect}
                    <Container>
                        <Row className="justify-content-md-center">
                            <center>
                                <ListGroup horizontal> 
                                    { accessModulesFirstList.map( listKey => {
                                            return [...Array( this.state.list_modules[listKey] )].map( ( m, i ) => {
                                                if( m.active ){
                                                    return <ListGroup.Item min-width='md' key={listKey + i} action bsPrefix='button' href={m.href}><FontAwesomeIcon style={{color:  '#0073cf', 'verticalAlign': 'middle', fontSize: '400%' }} icon={m.img}/> <span className='module_name'>{m.name}</span></ListGroup.Item> ;


                                                }
                                            });
                                        })
                                    }
                                </ListGroup>
                                <ListGroup horizontal> 
                                    { accessModulesSecondList.map( listKey => {
                                            return [...Array( this.state.list_modules[listKey] )].map( ( m, i ) => {
                                                if( m.active ){
                                                    return <ListGroup.Item min-width='md' key={listKey + i} action bsPrefix='button' href={m.href}><FontAwesomeIcon style={{color:  '#0073cf', 'verticalAlign': 'middle', fontSize: '400%' }} icon={m.img}/> <span className='module_name'>{m.name}</span></ListGroup.Item> ;


                                                }
                                            });
                                        })
                                    }
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
