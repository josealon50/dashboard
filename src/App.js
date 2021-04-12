import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Container from 'react-bootstrap/Container'
import * as actions from './store/actions/index';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';


const asyncAuth = asyncComponent(() => {
    return import('./containers/Auth/Auth');
});



class App extends Component {
    render () {
        let routes = (
            <Switch>
              <Route path="/auth" component={asyncAuth} />
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

