import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import './DetailItem.scss';

function DetailItem( props ) {
  return (
    <div className="detail-item" data-bos_context_type="Sidebar Item W Icon">
      <div className="detail-item__left">
        <div className="icon icon-email"></div>
      </div>
      <div className="detail-item__content">
        <div className="detail-item__label">Have questions? Contact us:</div>
        <div className="detail-item__body ">
          <address>
            <a href={ `mailto:${props.emailAddress}` } rel="nofollow">{ props.emailAddress }</a>
          </address>
        </div>
      </div>
    </div>
  );
}

DetailItem.propTypes = {
  "children": PropTypes.node,
  "emailAddress": PropTypes.string,
};

export default DetailItem;
