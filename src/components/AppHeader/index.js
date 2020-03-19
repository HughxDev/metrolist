import React from 'react';

import Column from '@components/Column';
import Logo from '../Logo';
import Tagline from '../Tagline';

import './AppHeader.scss';

function AppHeader() {
  return (
    <header className="ml-app-header">
      <Column>
        <hgroup className="ml-app-header__heading-container">
          <h1 className="ml-app-header__heading">
            <Logo width="145" />
          </h1>
          <h2 className="ml-app-header__subheading" role="presentation">
            <Tagline />
          </h2>
        </hgroup>
      </Column>
    </header>
  );
}

export default AppHeader;
