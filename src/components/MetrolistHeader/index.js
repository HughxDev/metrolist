import React from 'react';
import PropTypes from 'prop-types';

import Column from '../Column';
import MetrolistLogo from '../MetrolistLogo';
import MetrolistTagline from '../MetrolistTagline';

import './MetrolistHeader.scss';

function MetrolistHeader( props ) {
  return (
    <header className="cob-metrolist-header">
      <Column>
        <hgroup className="cob-metrolist-header__heading-container">
          <h1 className="cob-metrolist-header__heading">
            <MetrolistLogo width="145" />
          </h1>
          <h2 className="cob-metrolist-header__subheading" role="presentation">
            <MetrolistTagline />
          </h2>
        </hgroup>
      </Column>
    </header>
  );
}

MetrolistHeader.propTypes = {
  "children": PropTypes.node,
};

export default MetrolistHeader;
