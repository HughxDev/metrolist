import React from 'react';
import PropTypes from 'prop-types';

import './Deck.scss';

function Deck( props ) {
  return (
    <div className="ml-deck">
      { props.children }
    </div>
  );
}

Deck.propTypes = {
  "children": PropTypes.node,
};

export default Deck;
