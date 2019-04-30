export const validateUserForm = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  }
  if (!values.lastName) {
    errors.lastName = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.role) {
    errors.role = 'Required';
  }
  return errors;
};

export const required = value =>
  value || typeof value === 'number' ? undefined : 'Required';

export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const maxLength3 = maxLength(3);
export const minLength3 = minLength(3);

export const exactLength3 = value =>
  value && value.length !== 3 ? `Must be 3 characters` : undefined;
