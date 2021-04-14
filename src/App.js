import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Container from 'react-bootstrap/Container'
import * as actions from './store/actions/index';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faBell, faStroopwafel, faUsers, faFile, faTruck, faHospital, faSearch, faReceipt, faGlasses } from '@fortawesome/free-solid-svg-icons'

library.add( faChartLine, faBell, faStroopwafel, faUsers, faFile, faTruck, faHospital, faSearch, faReceipt, faGlasses )

const asyncAuth = asyncComponent(() => {
    return import('./containers/Auth/Auth');
});

const asyncLanding = asyncComponent(() => {
    return import('./containers/Landing/Landing');
});


class App extends Component {
    render () {
        let routes = (
            <Switch>
                <Route path="/auth" component={asyncAuth} />
                <Route path="/me" exact component={asyncLanding}/> 
                <Route path="/" exact component={asyncAuth} />
                <Redirect to="/" />
            </Switch>
        );
        return (
            <>
                <Navigation/>
                <Container fluid>
                    <div>
                        {routes}
                    </div>
                </Container>
                <Footer/>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};
const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );

