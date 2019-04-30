import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import 'App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions, healthCheckActions } from 'actions';
import { withRouter } from 'react-router';

class SeamaToolbar extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('tokenExpired', this.handleExpiredEvent.bind(this));
  }

  handleExpiredEvent(event) {
    console.log('tokenExpired');
    this.props.authActions.logout();
  }

  componentWillUnmount() {
    window.removeEventListener('tokenExpired', this.handleExpiredEvent);
  }

  logOut() {
    console.log('logout');
    this.props.authActions.logout();
  }

  render() {
    const {
      Version,
      healthCheck,
      currentUser: { firstName, lastName }
    } = this.props;

    return (
      <div>
        <Navbar fixedTop fluid bsStyle="inverse">
          <Navbar.Collapse>
            <Navbar.Text>{`Welcome ${firstName} ${lastName} `}</Navbar.Text>
            <Navbar.Text>
              {`Version: ${Version} Server: ${healthCheck.version}`}
            </Navbar.Text>
            <Nav pullRight>
              <NavItem onClick={this.logOut} href="#">
                Logout
              </NavItem>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Toggle />
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logState: state.auth.LogState,
    currentUser: state.auth.currentUser,
    healthCheck: state.healthCheck
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SeamaToolbar)
);
