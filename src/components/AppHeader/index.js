import React from 'react';

import Inset from '@components/Inset';
import Logo from '@components/Logo';
import Tagline from '@components/Tagline';

import './AppHeader.scss';

function AppHeader() {
  return (
    <header className="ml-app-header">
      <Inset>
        <hgroup className="ml-app-header__heading-container">
          <h1 className="ml-app-header__heading">
            <Logo width="145" />
          </h1>
          <h2 className="ml-app-header__subheading" role="presentation">
            <Tagline />
          </h2>
        </hgroup>
      </Inset>
    </header>
  );
}

export default AppHeader;
