import React from 'react';
import PropTypes from 'prop-types';

import './SectionHeader.scss';

function SectionHeader( props ) {
  return (
    <header className="cob-section-header">
      <h2 className="cob-section-header__heading">{ props.children }</h2>
    </header>
  );
}

SectionHeader.propTypes = {
  "children": PropTypes.node,
};

export default SectionHeader;
