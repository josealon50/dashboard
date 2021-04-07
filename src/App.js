import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Container from 'react-bootstrap/Container'
import * as actions from './store/actions/index';


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
            <Container fluid>
                <div>
                    {routes}
                </div>
            </Container>
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
        onAuth: ( email, password ) => dispatch( actions.auth( email, password ) ),
        onSetAuthRedirectPath: () => dispatch( actions.setAuthRedirectPath( '/' ) )

    };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );

