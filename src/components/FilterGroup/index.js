import React from 'react';
import PropTypes from 'prop-types';

import './FilterGroup.scss';

function FilterGroup( props ) {
  return (
    <div className={ `ml-filter-group${props.className ? ` ${props.className}` : ''}` }>
      { props.children }
    </div>
  );
}

FilterGroup.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default FilterGroup;
