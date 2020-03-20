import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@components/Checkbox';
import Scale from '@components/Scale';

import './Filter.scss';

function renderFormControl( props ) {
  switch ( props.type ) { // eslint-disable-line react/prop-types
    case 'scale':
      return <Scale { ...props } />;
    case 'checkbox':
      return <Checkbox { ...props } />;
    default:
      return <Checkbox subcategoriesOnly { ...props } />;
  }
}

function Filter( props ) {
  return renderFormControl( props );
}

Filter.propTypes = {
  "className": PropTypes.string,
  "type": PropTypes.oneOf( ['checkbox', 'scale'] ),
  "criterion": PropTypes.string,
  "value": PropTypes.string,
};

Filter.Label = ( props ) => <>{ props.children }</>;
Filter.Label.displayName = "FilterLabel";
Filter.Label.propTypes = { "children": PropTypes.node };

export default Filter;
