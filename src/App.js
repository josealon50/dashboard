import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

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
            <div>
                {routes}
            </div>
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

