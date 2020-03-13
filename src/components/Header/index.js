import React from 'react';

import Column from '@components/Column';
import Logo from '../Logo';
import Tagline from '../Tagline';

import './Header.scss';

function Header() {
  return (
    <header className="cob-header">
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

export default Header;
