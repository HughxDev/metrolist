import React from 'react';

import SectionHeader from '@components/SectionHeader';
import Column from '@components/Column';
import Row from '@components/Row';
import IconCard from '@components/IconCard';
import AppHeader from '@components/AppHeader';
import About from '@components/About';
import AffordableHousingInfo from '@components/AffordableHousingInfo';
import MailingListSignup from '@components/MailingListSignup';

import './Homepage.scss';

function Homepage() {
  return (
    <article className="ml-homepage">
      <AppHeader />
      <Column jumbotron>
        <SectionHeader>Start Your Search</SectionHeader>
        <Row>
          <IconCard icon="wallet" href="/income">Find housing based on your income</IconCard>
          <IconCard icon="neighborhood" href="/recent">See the most recent listings</IconCard>
        </Row>
      </Column>
      <About />
      <AffordableHousingInfo />
      <MailingListSignup />
      {/* <MetrolistListYourProperty /> */}
      {/* <MetrolistWorkshopsAndClasses /> */}
      {/* <MetrolistToolsAndResources /> */}
      {/* <MetrolistFeedbackForm /> */}
    </article>
  );
}

export default Homepage;
