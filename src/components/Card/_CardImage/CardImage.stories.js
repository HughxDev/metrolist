/* eslint-disable no-script-url */
import React from 'react';
import CardImage from './index';

const placeholderImage = {
  "src": "/images/placeholder.png",
  "srcSet": "/images/placeholder.png 1x, /images/placeholder@2x.png 2x, /images/placeholder@3x.png 3x",
  "width": "284",
  "alt": " ",
};

export default {
  "title": "Card/CardImage",
  "component": CardImage,
};

export const Default = () => <CardImage { ...placeholderImage } />;
