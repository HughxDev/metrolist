import React from 'react';
import PropTypes from 'prop-types';

import Column from '@components/Column';
import Logo from '../MetrolistLogo';
import Tagline from '../MetrolistTagline';

import './MetrolistHeader.scss';

function MetrolistHeader() {
  return (
    <header className="cob-metrolist-header">
      <Column>
        <hgroup className="cob-metrolist-header__heading-container">
          <h1 className="cob-metrolist-header__heading">
            <Logo width="145" />
          </h1>
          <h2 className="cob-metrolist-header__subheading" role="presentation">
            <Tagline />
          </h2>
        </hgroup>
      </Column>
    </header>
  );
}

export default MetrolistHeader;
