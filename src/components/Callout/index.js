import React from 'react';
import PropTypes from 'prop-types';

import './Callout.scss';

function Callout( props ) {
  let elementName;
  const attributes = { ...props };

  if ( props.as ) {
    delete attributes.as;
    elementName = props.as;
  } else {
    elementName = 'div';
  }

  return (
    React.createElement(
      elementName,
      {
        ...attributes,
        "className": ( `ml-callout${props.className ? ` ${props.className}` : ''}` ),
      },
      props.children,
    )
  );
}

Callout.propTypes = {
  "children": PropTypes.node,
  "as": PropTypes.string,
  "className": PropTypes.string,
};

Callout.Icon = ( { className, children } ) => <div className={ `ml-callout__icon${className ? ` ${className}` : ''}` }>{ children }</div>;
Callout.Icon.displayName = 'CalloutIcon';
Callout.Icon.propTypes = {
  "className": PropTypes.string,
  "children": PropTypes.node,
};

Callout.Heading = ( props ) => {
  let elementName;
  const attributes = { ...props };

  if ( props.as ) {
    delete attributes.as;
    elementName = props.as;
  } else {
    elementName = 'h3';
  }

  return (
    React.createElement(
      elementName,
      {
        ...attributes,
        "className": ( `ml-callout__heading${props.className ? ` ${props.className}` : ''}` ),
      },
      props.children,
    )
  );
};
Callout.Heading.displayName = 'CalloutHeading';
Callout.Heading.propTypes = {
  "className": PropTypes.string,
  "as": PropTypes.string,
  "children": PropTypes.node,
};

Callout.Text = ( { className, children } ) => <div className={ `ml-callout__text${className ? ` ${className}` : ''}` }>{ children }</div>;
Callout.Text.displayName = 'CalloutText';
Callout.Text.propTypes = {
  "className": PropTypes.string,
  "children": PropTypes.node,
};

Callout.CTA = ( { className, children } ) => <div className={ `ml-callout__cta${className ? ` ${className}` : ''}` }>{ children }</div>;
Callout.CTA.displayName = 'CalloutCTA';
Callout.CTA.propTypes = {
  "className": PropTypes.string,
  "children": PropTypes.node,
};

export default Callout;
