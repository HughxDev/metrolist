import React from 'react';
import PropTypes from 'prop-types';

import Row from '@components/Row';
import Stack from '@components/Stack';
import Reveal from '@components/Reveal';

import './Checkbox.scss';

function renderText( text ) {
  return <span className="ml-checkbox__text">{ text }</span>;
}

function renderLabel( children, props ) {
  const { subcategoriesOnly } = props;
  let { value } = props;

  if ( subcategoriesOnly ) {
    return (
      <span className="ml-checkbox__label">
        { renderText( children ) }
      </span>
    );
  }

  if ( !value ) {
    if ( typeof children === 'string' ) {
      value = children.trim();
    }
  }

  return (
    <label className="ml-checkbox__label">
      <Row className="ml-checkbox__label-content" space="panel" align="middle">
        <span className="ml-checkbox__form-control-container">
          <input
            className="ml-checkbox__form-control"
            type="checkbox"
            name={ props.criterion }
            value={ value }
            required={ props.required }
            // defaultChecked={ props.checked }
            checked={ props.checked }
            onChange={ () => {} }
          />
          <span className="ml-checkbox__form-control-ui"></span>
        </span>
        { renderText( children ) }
      </Row>
    </label>
  );
}

function renderChoices( props ) {
  const {
    children, hasSubcategories, subcategoriesOnly, required,
  } = props; // eslint-disable-line react/prop-types

  switch ( hasSubcategories ) {
    case false:
      return renderLabel( children, props );

    case true: {
      let firstRenderedChoice;
      const childArray = React.Children.toArray( children );
      const firstChild = childArray.shift();

      if ( firstChild.type && firstChild.type.displayName === 'FilterLabel' ) {
        firstRenderedChoice = renderLabel( firstChild, props );
      } else {
        childArray.unshift( firstChild );
      }

      return (
        <Stack space="subcategories">
          { firstRenderedChoice }
          <Reveal
            className="ml-checkbox__subcategories"
            stack={ { "space": "1", "indent": ( firstRenderedChoice ? 'checkbox' : false ) } }
          >
            { childArray }
          </Reveal>
        </Stack>
      );
    }

    default:
      return children;
  }
}

function Checkbox( props ) {
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
  "required": PropTypes.bool,
  "hasSubcategories": PropTypes.bool,
};

Checkbox.defaultProps = {
  "required": false,
  "hasSubcategories": false,
};

export default Checkbox;
