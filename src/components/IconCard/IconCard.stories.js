/* eslint-disable no-script-url */
import React from 'react';
import IconCard from './index';

export default {
  "title": "IconCard",
  "icon-card": IconCard,
};

export const Default = () => <IconCard icon="wallet" />;
export const withText = () => <IconCard icon="wallet">Find housing based on your income</IconCard>;
export const hyperlinked = () => <IconCard icon="wallet" href="javascript:void(0);">Find housing based on your income</IconCard>;
