import React from 'react';

import Layout from '../Layout';
import Logo from '../Logo';
import Tagline from '../Tagline';
import Icon from '../Icon';

import './Metrolist.scss';

function Metrolist() {
  return (
    <Layout>
      <article className="cob-metrolist">
        <header>
          <hgroup>
            <h1><Logo width="145" /></h1>
            <h2 role="presentation"><Tagline /></h2>
          </hgroup>
        </header>
        <div className="sh cl">
          <h2 className="sh-title">Start Your Search</h2>
        </div>
        <a>
          <Icon icon="wallet" width="50" />
          <span>Find housing based on your income</span>
        </a>
        <a>
          <Icon icon="neighborhood" width="50" />
          <span>See the most recent listings</span>
        </a>
      </article>
    </Layout>
  );
}

export default Metrolist;
