import React from 'react';
import PropTypes from 'prop-types';

import CardImage from './_CardImage';
import CardTopicText from './_CardTopicText';
import CardTitle from './_CardTitle';
import CardText from './_CardText';

import './Card.scss';

function Card( props ) {
  let CardElement;

  if ( props.href ) {
    CardElement = React.createElement( 'a', { "className": "ml-card", ...props }, props.children );
  } else {
    CardElement = React.createElement( 'div', { "className": "ml-card", ...props }, props.children );
  }

  return CardElement;
}

Card.propTypes = {
  "children": PropTypes.node,
};

Card.TopicText = CardTopicText;
Card.Image = CardImage;
Card.Title = CardTitle;
Card.Text = CardText;

export default Card;
