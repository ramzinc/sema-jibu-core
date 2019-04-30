import React from 'react';
import PropTypes from 'prop-types';
import * as BModal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

const propTypes = {
  title: PropTypes.string,
  body: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func
};

const defaultProps = {
  title: '',
  body: {},
  show: false,
  onClose: () => {},
  onSave: null
};

const Modal = ({ title, onSave, show, onClose, ...rest }) => (
  <BModal show={show} onHide={onClose}>
    <BModal.Header closeButton>
      <BModal.Title>{title}</BModal.Title>
    </BModal.Header>
    <BModal.Body>{rest.children}</BModal.Body>
    <BModal.Footer>
      <Button onClick={onClose}>Close</Button>
      {onSave && <Button onClick={onSave}>Save</Button>}
    </BModal.Footer>
  </BModal>
);

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
