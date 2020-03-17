import React from 'react';
import PropTypes from 'prop-types';

import Row from '@components/Row';
import Column from '@components/Column';
import SectionHeader from '@components/SectionHeader';
import SubscriptionForm from '@components/SubscriptionForm';

import './MailingListSignup.scss';

function MailingListSignup( props ) {
  return (
    <Row as="section" className="cob-mailing-list-signup">
      <Column jumbotron>
        <SectionHeader>Sign up for Metrolist Emails</SectionHeader>
        <div className="cob-mailing-list-signup__content">
          <div className="cob-mailing-list-signup__text">
            <p>Receive the Metrolist email. A weekly digest featuring the most recent affordable housing listings.</p>
          </div>
          <SubscriptionForm className="cob-mailing-list-signup__form" />
        </div>
      </Column>
    </Row>
  );
}

MailingListSignup.propTypes = {
  "children": PropTypes.node,
};

export default MailingListSignup;
