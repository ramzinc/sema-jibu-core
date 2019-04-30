import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  imageSrc: PropTypes.string.isRequired,
  captionText: PropTypes.string.isRequired,
  imageAlt: PropTypes.string
};

const defaultProps = {
  imageSrc: '',
  captionText: '',
  imageAlt: ''
};

const Thumbnail = ({ imageSrc, captionText, imageAlt }) => (
  <div className="thumbnail">
    <div className="caption">
      <p>{captionText}</p>
    </div>
    <img src={imageSrc} alt={imageAlt} />
  </div>
);

Thumbnail.propTypes = propTypes;
Thumbnail.defaultProps = defaultProps;

export default Thumbnail;
