import React from 'react';

import Layout from '../Layout';
import SectionHeader from '../SectionHeader';
import Column from '../Column';
import Row from '../Row';
import IconCard from '../IconCard';
import MetrolistHeader from '../MetrolistHeader';
import MetrolistInfo from '../MetrolistInfo';

import './Metrolist.scss';

function Metrolist() {
  return (
    <article className="cob-metrolist">
      <MetrolistHeader />
      <Column jumbotron>
        <SectionHeader>Start Your Search</SectionHeader>
        <Row>
          <IconCard icon="wallet" href="/income">Find housing based on your income</IconCard>
          <IconCard icon="neighborhood" href="/recent">See the most recent listings</IconCard>
        </Row>
      </Column>
      <MetrolistInfo />
      {/* <MetrolistAffordableHousingInfo /> */}
      {/* <MetrolistMailingListSignup /> */}
      {/* <MetrolistListYourProperty /> */}
      {/* <MetrolistWorkshopsAndClasses /> */}
      {/* <MetrolistToolsAndResources /> */}
      {/* <MetrolistFeedbackForm /> */}
    </article>
  );
}

export default Metrolist;
