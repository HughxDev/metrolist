import React from 'react';
import PropTypes from 'prop-types';

import CardImage from './_CardImage';
import CardTopicText from './_CardTopicText';
import CardTitle from './_CardTitle';
import CardText from './_CardText';

import './Card.scss';

function Card( props ) {
  return (
    <a className="cob-card" { ...props }>
      { props.children }
    </a>
  );
}

Card.propTypes = {
  "children": PropTypes.node,
};

Card.TopicText = CardTopicText;
Card.Image = CardImage;
Card.Title = CardTitle;
Card.Text = CardText;

export default Card;
