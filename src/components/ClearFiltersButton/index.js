import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Button from '@components/Button';

import './ClearFiltersButton.scss';

function ClearFiltersButton( props ) {
  const $self = useRef();

  const handleClick = () => {
    props.clearFilters();
  };

  return (
    <Button
      ref={ $self }
      type="submit"
      data-testid="ml-clear-filters-button"
      className={ `ml-clear-filters-button${props.className ? ` ${props.className}` : ''}` }
      onClick={ handleClick }
    >
      <span className="ml-clear-filters-button__icon" aria-hidden="true">&times;</span>{ ' ' }
      <span className="ml-clear-filters-button__text">Clear filters</span>
    </Button>
  );
}

ClearFiltersButton.displayName = 'ClearFiltersButton';

ClearFiltersButton.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "clearFilters": PropTypes.func.isRequired,
};

export default ClearFiltersButton;
