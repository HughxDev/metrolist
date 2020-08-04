import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@components/Button';

import './ClearFiltersButton.scss';

function ClearFiltersButton( props ) {
  const $self = useRef();
  const [showUndo, setShowUndo] = useState( false );

  const handleClick = () => {
    if ( showUndo ) {
      props.undoClearFilters();
    } else {
      props.clearFilters();
    }

    setShowUndo( !showUndo );
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
      { !showUndo && <span className="ml-clear-filters-button__text">Clear filters</span> }
      { showUndo && <span className="ml-clear-filters-button__text">Undo clear filters</span> }
    </Button>
  );
}

ClearFiltersButton.displayName = 'ClearFiltersButton';

ClearFiltersButton.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "clearFilters": PropTypes.func.isRequired,
  "undoClearFilters": PropTypes.func.isRequired,
};

export default ClearFiltersButton;
