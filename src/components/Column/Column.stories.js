import React from 'react';
import Column from './index';

export default {
  "title": "Column",
  "column": Column,
};

export const Default = () => (
  <Column>
    <div style={ {
      "border": "1px solid black",
    } }>Content</div>
  </Column>
);
