import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  FormGroup,
  HelpBlock,
  Col,
  ControlLabel,
  Row
} from 'react-bootstrap';

const propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool
};

const defaultProps = {
  input: {},
  meta: {},
  label: '',
  name: '',
  required: false
};

const CheckboxField = ({
  name,
  label,
  input,
  meta,
  size,
  required,
  ...rest
}) => (
  <FormGroup
    controlId={name}
    validationState={meta.invalid && meta.touched ? 'error' : null}
    bsSize={size}
  >
    <Row>
      {label && (
        <Col componentClass={ControlLabel} sm={3}>
          {label}
          {required ? ' *' : ''}
        </Col>
      )}
      <Col sm={9}>
        <Checkbox checked={input.value} {...input} {...rest} />
      </Col>
      {meta.invalid &&
        meta.touched &&
        meta.error && <HelpBlock>{meta.error}</HelpBlock>}
    </Row>
  </FormGroup>
);

CheckboxField.propTypes = propTypes;
CheckboxField.defaultProps = defaultProps;
export default CheckboxField;
