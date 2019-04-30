import React from 'react';
import PropTypes from 'prop-types';
import * as BButton from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const propTypes = {
  buttonSize: PropTypes.string,
  buttonStyle: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string
};

const defaultProps = {
  buttonStyle: 'default',
  onClick: () => {},
  buttonText: '',
  icon: null,
  className: ''
};

const Button = ({
  buttonSize,
  buttonStyle,
  onClick,
  buttonText,
  icon,
  className
}) => (
  <BButton
    bsStyle={buttonStyle}
    bsSize={buttonSize || null}
    onClick={onClick}
    className={className}
  >
    {icon && <Glyphicon glyph={icon} style={{ marginRight: '3px' }} />}
    {buttonText}
  </BButton>
);

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
