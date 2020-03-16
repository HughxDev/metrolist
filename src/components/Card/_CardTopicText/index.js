import React from 'react';
import PropTypes from 'prop-types';

import './CardTopicText.scss';

function CardTopicText( props ) {
  return (
    <i className="cob-card__topic-text">{ props.children }</i>
  );
}

CardTopicText.propTypes = {
  "children": PropTypes.node,
};

export default CardTopicText;
