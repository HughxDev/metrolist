import React from 'react';
import MetrolistLogo from '../MetrolistLogo';
import './App.css';

function App() {
  return (
    <>
      <header>
        <hgroup>
          <h1><MetrolistLogo width="145" /></h1>
          <h2 className="metrolist-tagline" role="presentation">Affordable housing in Boston and beyond.</h2>
        </hgroup>
      </header>
      <div className="sh cl">
        <h2 className="sh-title">Start Your Search</h2>
      </div>
    </>
  );
}

export default App;
