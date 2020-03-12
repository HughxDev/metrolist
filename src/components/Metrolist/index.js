import React from 'react';

import Layout from '../Layout';
import Logo from '../Logo';
import Tagline from '../Tagline';
import SectionHeader from '../SectionHeader';
import Column from '../Column';
import Row from '../Row';
import IconCard from '../IconCard';

import './Metrolist.scss';

function Metrolist() {
  return (
    <Layout>
      <article className="cob-metrolist">
        <header>
          <Column>
            <hgroup>
              <h1><Logo width="145" /></h1>
              <h2 role="presentation"><Tagline /></h2>
            </hgroup>
          </Column>
        </header>
        <Column>
          <SectionHeader>Start Your Search</SectionHeader>
          <Row>
            <IconCard icon="wallet" href="/income">Find housing based on your income</IconCard>
            <IconCard icon="neighborhood" href="/recent">See the most recent listings</IconCard>
          </Row>
        </Column>
      </article>
    </Layout>
  );
}

export default Metrolist;
