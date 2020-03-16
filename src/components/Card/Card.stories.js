/* eslint-disable no-script-url */
import React from 'react';
import PropTypes from 'prop-types';
import Card from './index';

const cardStyles = {
  "width": "50vw",
};

const placeholderImage = {
  "src": "/images/placeholder.png",
  "srcSet": "/images/placeholder.png 1x, /images/placeholder@2x.png 2x, /images/placeholder@3x.png 3x",
  "width": "284",
  "alt": " ",
};

const Background = ( { children } ) => (
  <div style={ {
    "backgroundColor": "#eee",
    "height": "100vh",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
  } }>
    { children }
  </div>
);

Background.propTypes = {
  "children": PropTypes.node,
};

export default {
  "title": "Card",
  "component": Card,
  "subcomponents": {
    "CardImage": Card.Image,
    "CardText": Card.Text,
    "CardTopicText": Card.TopicText,
    "CardTitle": Card.TopicText,
  },
};

export const TextOnly = () => (
  <Background>
    <Card style={ cardStyles }>
      <Card.Text>Card</Card.Text>
    </Card>
  </Background>
);

export const Linked = () => (
  <Background>
    <Card href="#" style={ cardStyles }>
      <Card.Text>Card</Card.Text>
    </Card>
  </Background>
);

export const WithImage = () => (
  <Background>
    <Card style={ cardStyles }>
      <Card.Image { ...placeholderImage } />
      <Card.Text>Card</Card.Text>
    </Card>
  </Background>
);

export const Complete = () => (
  <Background>
    <Card href="#" style={ cardStyles }>
      <Card.Image { ...placeholderImage } />
      <Card.Text>
        <Card.TopicText>Topic:</Card.TopicText>
        <Card.Title>Qualifying for Affordable Housing</Card.Title>
      </Card.Text>
    </Card>
  </Background>
);
