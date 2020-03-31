import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@components/Stack';

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
      <Stack space="panel" toppleUntil="large" align={ ['middle'] } alignAt={ ['xsmall'] }>
        { props.children }
      </Stack>,
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

Callout.Heading = ( { className, children } ) => ( <h3 className={ `ml-callout__heading${className ? ` ${className}` : ''}` }>{ children }</h3> );
Callout.Heading.displayName = 'CalloutHeading';
Callout.Heading.propTypes = {
  "className": PropTypes.string,
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
