import React, { Component } from 'react';
import './App.css';
import './css/SeamaNav.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from 'actions';
import { Router } from 'react-router-dom';
import { Page, SemaLogin } from 'components';
import { history } from './utils';

class App extends Component {
  userIsValid() {
    if (this.props.auth.currentUser) {
      const now = Date.now() / 1000;
      if (now < this.props.auth.currentUser.exp) {
        console.log('Token is valid - Proceed to home page');
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <Router history={history}>
        {this.userIsValid() ? <Page /> : <SemaLogin />}
      </Router>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
