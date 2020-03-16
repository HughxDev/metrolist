/* eslint-disable no-script-url */
import React from 'react';
import Card from './index';

const placeholderImage = {
  "src": "/images/placeholder.png",
  "srcset": "/images/placeholder.png 1x, /images/placeholder@2x.png 2x, /images/placeholder@3x.png 3x",
  "width": "284",
  "alt": " ",
};

export default {
  "title": "Card",
  "card": Card,
};

export const Default = () => <Card />;

export const WithSubcomponents = () => (
  <Card>
    <Card.Image { ...placeholderImage } />
    <Card.Text>
      <Card.TopicText>Topic:</Card.TopicText>
      <Card.Title>Qualifying for Affordable Housing</Card.Title>
    </Card.Text>
  </Card>
);
