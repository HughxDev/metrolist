import React from 'react';
import PropTypes from 'prop-types';

import './FilterGroup.scss';

function FilterGroup( props ) {
  return (
    <fieldset className={ `ml-filter-group${props.className ? ` ${props.className}` : ''}` }>
      { props.children }
    </fieldset>
  );
}

FilterGroup.Label = ( props ) => <legend>{ props.children }</legend>;
FilterGroup.Label.displayName = 'FilterGroupLabel';
FilterGroup.Label.propTypes = {
  "children": PropTypes.node,
};

FilterGroup.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default FilterGroup;
