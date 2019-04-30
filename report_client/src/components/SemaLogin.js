import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, Button, Alert } from 'react-bootstrap';
import { BounceLoader } from 'react-spinners';
import 'css/SemaLogin.css';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import {
	authActions,
	healthCheckActions,
	kioskActions
} from 'actions';

// const ImageStyle = {
// 	display: 'block',
// 	marginLeft: '10%',
// 	// marginRight: 'auto',
// 	// paddingRight: "8%"
//
// 	// resize:"both",
// 	// width:'100%',
// 	// height:'100%',
// 	// maxWidth: '100%',
// 	// marginBottom: '5px'
// };

class SemaLogin extends Component {
	constructor(props, context) {
		super(props, context);

		console.log("SemaLogin-constructor");

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		console.log("SemaLogin - handleClick");
		this.props.authActions.login(this.inputUser.value, this.inputPassword.value);

		event.preventDefault();
	}

	componentWillUnmount() {
		this.props.healthCheckActions.fetchHealthCheck();
		this.props.kioskActions.fetchKiosks();
	}

	render() {
		return (
			<div className="LogIn">
				{/*<div>*/}
					{/*{<img  src={require('images/swe-logo.png')} alt="logo" style={ImageStyle} />}*/}
				{/*</div>*/}

				<Form horizontal className="normal">
					<FormGroup controlId="formUser">
						<Col sm={10}>
							<FormControl type="text" placeholder="Username or Email" inputRef={ref => { this.inputUser = ref; }}/>
						</Col>
					</FormGroup>

					<FormGroup controlId="formPassword">
						<Col sm={10}>
							<FormControl type="password" placeholder="Password" inputRef={ref => { this.inputPassword = ref; }}/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col sm={10}>
							<Button type="submit" onClick={this.handleClick}
									style={{width: "100%", color: "white", background: "rgb(40,88,167)"}}>Sign in</Button>
						</Col>
					</FormGroup>
					<div>
						<BounceLoader color={'red'} loading={this.props.logState === "loading"} />
					</div>
				</Form>

				{ this.props.logState === "noService" ? <NoService
					header="Service Not Currently Available"
					message="The Service is not currently available. Please try again later."/> : null }
				{ this.props.logState === "badCredentials" ? <NoService
					header="Invalid Credentials"
					message="User name and/or password are not valid"/> : null }
			</div>

		);
	};
}

class NoService extends Component {
	constructor(props, context) {
		super(props, context);
		console.log("NoService-constructor");
		this.handleClick = this.handleClick.bind(this);

		this.state ={
			show: ""
		};
	}

	handleClick(event) {
		console.log("SemaLogin - handleClick");

		this.setState({ show: 'hidden' });

		event.preventDefault();
	};

	render() {
		return (
			<Alert bsStyle="info" className={`${this.state.show} SemaServiceError`} style={{textAlign:"center", height:"130px"}}>
				<h4>{this.props.header}</h4>
				<p>{this.props.message}</p>
				<Button bsStyle="info" onClick={this.handleClick} style={{marginTop:"15px"}}>Ok</Button>
			</Alert>
		);
	}

}

SemaLogin.propTypes = {
	authActions: PropTypes.object,
	logState: PropTypes.string
};

function mapStateToProps(state) {
	return {
		logState: state.auth.logState
	};
}

function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch),
		kioskActions: bindActionCreators(kioskActions, dispatch)
	};
}

const connectedLoginPage = connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaLogin);

export { connectedLoginPage as SemaLogin };
