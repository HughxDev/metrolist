import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.scss';

function renderText( text ) {
  return <span className="ml-checkbox__text">{ text }</span>;
}

function renderLabel( children, subcategoriesOnly ) {
  if ( subcategoriesOnly ) {
    return (
      <span className="ml-checkbox__label">
        { renderText( children ) }
      </span>
    );
  }

  return (
    <label className="ml-checkbox__label">
      <span className="ml-checkbox__form-control-container">
        <input className="ml-checkbox__form-control" type="checkbox" />
        <span className="ml-checkbox__form-control-ui"></span>
      </span>
      { renderText( children ) }
    </label>
  );
}

function renderChoices( { children, subcategoriesOnly } ) {
  switch ( typeof children ) {
    case 'string':
      return renderLabel( children, subcategoriesOnly );

    case 'object': {
      let firstRenderedChoice;
      const childArray = React.Children.toArray( children );
      const firstChild = childArray.shift();

      if ( firstChild.type.displayName === 'FilterLabel' ) {
        firstRenderedChoice = renderLabel( firstChild, subcategoriesOnly );
      }

      return (
        <>
          { firstRenderedChoice }
          <div className="ml-checkbox__subcategories">
            { childArray }
            { ( childArray.length > 3 ) && <a className="ml-checkbox__more-link" href="#">more…</a> }
          </div>
        </>
      );
    }

    default:
      return children;
  }
}

function Checkbox( props ) {
  return (
    <div className={ `ml-checkbox${props.className ? ` ${props.className}` : ''}` }>
      { renderChoices( props ) }
    </div>
  );
}

Checkbox.defaultProps = {
  "count": 0,
};

Checkbox.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "count": PropTypes.number,
  "criterion": PropTypes.string,
  "subcategoriesOnly": PropTypes.bool,
};

export default Checkbox;
