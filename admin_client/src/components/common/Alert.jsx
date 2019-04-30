import React from 'react';
import PropTypes from 'prop-types';
import BAlert from 'react-bootstrap/lib/Alert';

const propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'danger', 'info']).isRequired,
  message: PropTypes.string.isRequired
};

const defaultProps = {
  type: 'info',
  message: ''
};

const Alert = ({ type, message }) => <BAlert bsStyle={type}>{message}</BAlert>;

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;
export default Alert;
