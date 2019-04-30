import React from 'react';
import { Col, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

import Checkbox from './Checkbox';

const CheckboxGroup = ({
  name,
  input,
  className,
  label,
  meta,
  options,
  required,
  ...rest
}) => {
  const { onChange, onBlur } = input;
  const inputValue = input.value;

  const renderOptions = options =>
    options.map((option, index) => (
      <Checkbox
        key={index}
        onChange={handleChange}
        value={option.value}
        label={option.label}
        checked={input.value.indexOf(option.value) > -1}
      />
    ));

  const handleChange = event => {
    const arr = [...inputValue];
    if (event.target.checked) {
      arr.push(event.target.value);
    } else {
      arr.splice(arr.indexOf(event.target.value), 1);
    }
    onBlur(arr);
    return onChange(arr);
  };

  return (
    <Col sm={12}>
      <FormGroup
        controlId={name}
        validationState={meta.invalid && meta.touched ? 'error' : null}
      >
        <ControlLabel>
          {label}
          {required ? ' *' : ''}
        </ControlLabel>

        {meta.invalid &&
          meta.touched &&
          meta.error && <HelpBlock>{meta.error}</HelpBlock>}

        {renderOptions(options)}
      </FormGroup>
    </Col>
  );
};

export default CheckboxGroup;
