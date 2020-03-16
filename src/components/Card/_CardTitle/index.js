import React from 'react';
import PropTypes from 'prop-types';

import './CardTitle.scss';

function CardTitle( props ) {
  return (
    <b className="cob-card__title">
      { props.children }
    </b>
  );
}

CardTitle.propTypes = {
  "children": PropTypes.node,
};

export default CardTitle;
