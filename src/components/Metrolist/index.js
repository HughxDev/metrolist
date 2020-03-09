import React from 'react';
import Layout from '../Layout';
import Logo from '../Logo';
import './Metrolist.css';

function Metrolist() {
  return (
    <Layout>
      <article>
        <header>
          <hgroup>
            <h1><Logo width="145" /></h1>
            <h2 className="metrolist-tagline" role="presentation">Affordable housing in Boston and beyond.</h2>
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
