import React from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Col,
  Row
} from 'react-bootstrap';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

const SelectField = ({
  name,
  label,
  input,
  options,
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
        <Col componentClass={ControlLabel} sm={horizontal ? 3 : 9}>
          {label}
          {required ? ' *' : ''}
        </Col>

        <Col sm={horizontal ? 9 : 12}>
          <FormControl componentClass="select" {...input} {...props}>
            <option />
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormControl>
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
        <FormControl componentClass="select" {...input} {...props}>
          <option />
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormControl>
      </Col>
    )}
  </FormGroup>
);

export default SelectField;
