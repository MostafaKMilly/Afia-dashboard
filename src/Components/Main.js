import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import Login from '../helpers/Login'
import Dashboard from './Dashboard';

class Main extends Component {
    render() {
        if (!Boolean(localStorage.getItem('token')) || localStorage.getItem("token") === "undefined") {
            return (<Login />)
        }
        return (
            <Switch>
                <Route path={`${this.props.match.path}`} component={Dashboard} />
                <Redirect from={`${this.props.match.path}`} to="/dashboard" />
            </Switch>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})
export default withRouter(connect(mapStateToProps, null)(Main))