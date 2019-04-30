import React from 'react';
import PropTypes from 'prop-types';
import * as BCheckbox from 'react-bootstrap/lib/Checkbox';

const propTypes = {
  label: PropTypes.string
};

const defaultProps = {
  label: ''
};

const Checkbox = ({ label, ...rest }) => (
  <BCheckbox {...rest}>{label}</BCheckbox>
);

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
