import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as healthCheckActions from 'actions/healthCheckActions';
import PropTypes from 'prop-types';
import React from 'react';
import { Label} from 'react-bootstrap';

const LabelStyleRight = {
    float:"right",
    background:"none",
    marginTop:"15px",
    fontSize:"14px",
    fontWeight: "normal"
};

class SemaHealthCheck extends React.Component {
    componentWillMount() {
        this.props.healthCheckActions.fetchHealthCheck();
    }

    render() {
        if(!this.props.healthCheck){
            return null
        }else{
            return (
                <Label style={LabelStyleRight}> Server: {this.props.healthCheck.server}</Label>
          )
        }
    }
}

SemaHealthCheck.propTypes = {
    healthCheckActions: PropTypes.object,
    healthCheck: PropTypes.object
};

function mapStateToProps(state) {
    return {
        healthCheck: state.healthCheck
    };
}

function mapDispatchToProps(dispatch) {
    return {
        healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SemaHealthCheck);
