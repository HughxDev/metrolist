import React from 'react';
import PropTypes from 'prop-types';
import { numericString } from 'airbnb-prop-types';

import './CardImage.scss';

function CardImage( props ) {
  return (
    <img className="ml-card__image" { ...props } />
  );
}

CardImage.propTypes = {
  "width": numericString(),
  "height": numericString(),
  "alt": PropTypes.string.isRequired,
};

export default CardImage;
