import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import './IconCard.scss';

function IconCard( props ) {
  return (
    <a className="ml-icon-card" href={ props.href }>
      <span className="ml-icon-card__content">
        <Icon className="ml-icon-card__image" icon={ props.icon } width="50" />
        <span className="ml-icon-card__text">{ props.children }</span>
      </span>
    </a>
  );
}

IconCard.propTypes = {
  "children": PropTypes.node,
  "icon": PropTypes.string,
  "href": PropTypes.string,
};

export default IconCard;
