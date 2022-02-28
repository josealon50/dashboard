import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faBell, faStroopwafel, faUsers, faFile, faTruck, faHospital, faSearch, faReceipt, faGlasses } from '@fortawesome/free-solid-svg-icons'

import * as actions from './store/actions/index';

import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Container from 'react-bootstrap/Container'
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Logout from './containers/Auth/Logout/Logout';


library.add( faChartLine, faBell, faStroopwafel, faUsers, faFile, faTruck, faHospital, faSearch, faReceipt, faGlasses )

const asyncAuth = asyncComponent(() => {
    return import('./containers/Auth/Auth');
});

const asyncLanding = asyncComponent(() => {
    return import('./containers/Landing/Landing');
});

const asyncOrders = asyncComponent(() => {
    return import('./containers/Orders/Orders');
});

const asyncShipments = asyncComponent(() => {
    return import('./containers/Shipments/Shipments');
});

const asyncAlerts = asyncComponent(() => {
    return import('./containers/Alerts/Alerts');
});

const asyncDashboard = asyncComponent(() => {
    return import('./containers/Dashboard/Dashboard');
});

const asyncGroups = asyncComponent(() => {
    return import('./containers/Groups/Groups');
});

class App extends Component {
    componentDidMount() {
        //this.props.onCheckAuthCheckState();
    }
    
    render () {
        let routes = (
                <Switch>
                    <Route path="/dashboard/:id" component={asyncDashboard} />
                    <Route path="/" component={asyncAuth} />
                </Switch>
        );

        if ( this.props.isAuthenticated ) {
            routes = (
                <Switch>
                    <Route path="/auth" component={asyncAuth} />
                    <Route path="/me" exact component={asyncLanding}/> 
                    <Route path="/orders" exact component={asyncOrders}/> 
                    <Route path="/shipments" exact component={asyncShipments}/> 
                    <Route path="/alerts" exact component={asyncAlerts}/> 
                    <Route path="/groups" exact component={asyncGroups}/> 
                    <Route path="/logout" exact component={Logout}/> 
                    <Route path="/" exact component={asyncAuth} />
                    <Redirect to="/me" />
                </Switch>
            );
        }
        return (
            <>
                <Navigation isAuthenticated={this.props.isAuthenticated}/>
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
        isAuthenticated: state.auth.access_token !== null,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onCheckAuthCheckState :  () => dispatch( actions.authCheckState() ),
    };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );

