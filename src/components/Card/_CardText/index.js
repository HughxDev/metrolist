import React from 'react';
import PropTypes from 'prop-types';

import './CardText.scss';

function CardText( props ) {
  return (
    <div className="cob-card__text">
      { props.children }
    </div>
  );
}

CardText.propTypes = {
  "children": PropTypes.node,
};

export default CardText;
