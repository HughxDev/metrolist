import React from 'react';
import PropTypes from 'prop-types';

import Row from '@components/Row';
import Stack from '@components/Stack';

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
      <Row className="ml-checkbox__label-content" space="panel" align="middle">
        <span className="ml-checkbox__form-control-container">
          <input className="ml-checkbox__form-control" type="checkbox" />
          <span className="ml-checkbox__form-control-ui"></span>
        </span>
        { renderText( children ) }
      </Row>
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
        <Stack space="subcategories">
          { firstRenderedChoice }
          <Stack className="ml-checkbox__subcategories" space="1" indent={ firstRenderedChoice ? 'checkbox' : false }>
            { childArray }
            { ( childArray.length > 3 ) && <a className="ml-checkbox__more-link" href="#">more…</a> }
          </Stack>
        </Stack>
      );
    }

    default:
      return children;
  }
}

function Checkbox( props ) {
  if ( props.columnWidth ) {
    console.log( props.children );
  }

  let modifierClasses = '';

  if ( props.button ) {
    modifierClasses += ' ml-checkbox--button';
  }

  return (
    <div
      className={ `ml-checkbox${modifierClasses}${props.className ? ` ${props.className}` : ''}` }
      data-column-width={ props.columnWidth }
    >
      { renderChoices( props ) }
    </div>
  );
}

Checkbox.defaultProps = {
  "count": 0,
};

Checkbox.propTypes = {
  "button": PropTypes.bool,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "count": PropTypes.number,
  "criterion": PropTypes.string,
  "subcategoriesOnly": PropTypes.bool,
  "columnWidth": PropTypes.oneOfType( [PropTypes.string, PropTypes.bool] ),
};

export default Checkbox;
