import React from 'react';

import SectionHeader from '@components/SectionHeader';
import Column from '@components/Column';
import Row from '@components/Row';
import IconCard from '@components/IconCard';

// Sub-components
import Header from '../Header';
import About from '../About';
import Logo from '../Logo';
import Tagline from '../Tagline';
import AffordableHousingInfo from '../AffordableHousingInfo';

import './Homepage.scss';

function Homepage() {
  return (
    <article className="cob-homepage">
      <Header />
      <Column jumbotron>
        <SectionHeader>Start Your Search</SectionHeader>
        <Row>
          <IconCard icon="wallet" href="/income">Find housing based on your income</IconCard>
          <IconCard icon="neighborhood" href="/recent">See the most recent listings</IconCard>
        </Row>
      </Column>
      <About />
      <AffordableHousingInfo />
      {/* <MetrolistMailingListSignup /> */}
      {/* <MetrolistListYourProperty /> */}
      {/* <MetrolistWorkshopsAndClasses /> */}
      {/* <MetrolistToolsAndResources /> */}
      {/* <MetrolistFeedbackForm /> */}
    </article>
  );
}

Homepage.Header = Header;
Homepage.Logo = Logo;
Homepage.Tagline = Tagline;
Homepage.AffordableHousingInfo = AffordableHousingInfo;

export default Homepage;
