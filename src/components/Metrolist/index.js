import React from 'react';

import SectionHeader from '@components/SectionHeader';
import Column from '@components/Column';
import Row from '@components/Row';
import IconCard from '@components/IconCard';

// Sub-components
import Header from './MetrolistHeader';
import Info from './MetrolistInfo';
import Logo from './MetrolistLogo';
import Tagline from './MetrolistTagline';

import './Metrolist.scss';

function Metrolist() {
  return (
    <article className="cob-metrolist">
      <Header />
      <Column jumbotron>
        <SectionHeader>Start Your Search</SectionHeader>
        <Row>
          <IconCard icon="wallet" href="/income">Find housing based on your income</IconCard>
          <IconCard icon="neighborhood" href="/recent">See the most recent listings</IconCard>
        </Row>
      </Column>
      <Info />
      {/* <MetrolistAffordableHousingInfo /> */}
      {/* <MetrolistMailingListSignup /> */}
      {/* <MetrolistListYourProperty /> */}
      {/* <MetrolistWorkshopsAndClasses /> */}
      {/* <MetrolistToolsAndResources /> */}
      {/* <MetrolistFeedbackForm /> */}
    </article>
  );
}

Metrolist.Header = Header;
Metrolist.Logo = Logo;
Metrolist.Tagline = Tagline;

export default Metrolist;
