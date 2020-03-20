import React from 'react';
import PropTypes from 'prop-types';

import './Callout.scss';

function Callout( props ) {
  return (
    <div className={ `ml-callout${props.className ? ` ${props.className}` : ''}` }>
      { props.children }
    </div>
  );
}

Callout.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

Callout.Heading = ( { children } ) => ( <h3 className="ml-callout__heading">{ children }</h3> );
Callout.Heading.displayName = 'CalloutHeading';
Callout.Heading.propTypes = {
  "children": PropTypes.node,
};

Callout.Text = ( { children } ) => <div className="ml-callout__text">{ children }</div>;
Callout.Text.displayName = 'CalloutText';
Callout.Text.propTypes = {
  "children": PropTypes.node,
};

export default Callout;
