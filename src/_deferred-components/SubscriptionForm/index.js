import React from 'react';
import PropTypes from 'prop-types';

import './SubscriptionForm.scss';

function SubscriptionForm( props ) {
  return (
    <form className={ `ml-subscription-form${props.className ? ( ` ${props.className}` ) : ''}` } action="https://www.boston.gov" method="GET">
      <div className="fs">
        <div className="fs-c fs-c--i">
          <div className="txt">
            <label htmlFor="text" className="txt-l">Your Email Address</label>
            <input id="text" type="text" defaultValue="" placeholder="you@example.com" className="txt-f" />
          </div>
          <div className="txt">
            <label htmlFor="text" className="txt-l">Zip Code</label>
            <input id="text" type="text" defaultValue="" placeholder="02201" className="txt-f" size="10" />
          </div>
        </div>
        <div className="bc bc--r">
          <button type="submit" className="btn btn--700">Sign Up</button>
        </div>
      </div>
    </form>
  );
}

SubscriptionForm.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default SubscriptionForm;
