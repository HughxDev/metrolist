import React from 'react';

import Layout from '../Layout';
import Logo from '../Logo';
import Tagline from '../Tagline';
import Icon from '../Icon';

import './Metrolist.scss';

function Metrolist() {
  return (
    <Layout>
      <article>
        <Icon icon="wallet" />
        <header>
          <hgroup>
            <h1><Logo width="145" /></h1>
            <h2 role="presentation"><Tagline /></h2>
          </hgroup>
        </header>
        <div className="sh cl">
          <h2 className="sh-title">Start Your Search</h2>
        </div>
      </article>
    </Layout>
  );
}

export default Metrolist;
