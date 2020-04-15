import React from 'react';
import PropTypes from 'prop-types';

import './WizardStep.scss';

class WizardStep extends React.Component {
  constructor( props ) {
    super();
    this._baseFormControlState = {
      "step": 0,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    };
    Object.freeze( this._baseFormControlState );
    this.formControls = [];
  }

  render() {
    return (
      <div className={ `ml-wizard__step${this.props.className ? ` ${this.props.className}` : ''}` }>
        { this.props.children }
      </div>
    );
  }
}

WizardStep.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default WizardStep;
