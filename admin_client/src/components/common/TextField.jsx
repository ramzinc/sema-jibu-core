import React from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Col,
  Row
} from 'react-bootstrap';

const TextField = ({
  name,
  label,
  input,
  meta,
  horizontal,
  size,
  required,
  ...props
}) => (
  <FormGroup
    controlId={name}
    validationState={meta.invalid && meta.touched ? 'error' : null}
    bsSize={size}
  >
    {label && (
      <Row>
        <Col componentClass={ControlLabel} sm={horizontal ? 3 : 12}>
          {label}
          {required ? ' *' : ''}
        </Col>

        <Col sm={horizontal ? 9 : 12}>
          <FormControl {...input} {...props} />
        </Col>

        <Col smOffset={horizontal ? 3 : 0} sm={9}>
          {meta.invalid &&
            meta.touched &&
            meta.error && <HelpBlock>{meta.error}</HelpBlock>}
        </Col>
      </Row>
    )}
    {!label && (
      <Col sm={12}>
        <FormControl {...input} {...props} />
      </Col>
    )}
  </FormGroup>
);

export default TextField;
