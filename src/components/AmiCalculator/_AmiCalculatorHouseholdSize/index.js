import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
import Scale from '@components/Scale';

import './AmiCalculatorHouseholdSize.scss';

function AmiCalculatorHouseholdSize( props ) {
  useEffect( () => props.setStep( props.step ), [] );

  return (
    <fieldset className="ml-ami-calculator__household-size ml-ami-calculator__prompt">
      <legend className="ml-ami-calculator__prompt-question">How many people live in your household of any age?</legend>
      <div className="ml-ami-calculator__prompt-answer">
        <Icon className="ml-ami-calculator__prompt-answer-icon" icon="family2" width="227" />
        <Scale
          className={ `ml-ami-calculator__prompt--answer-input` }
          criterion="householdSize"
          value="1,2,3,4,5,6+"
          aria-describedby="ami-calculator-form-errors ami-calculator-household-size-error"
          required
        />
        <div
          ref={ props.formControlData.errorRef }
          id="ami-calculator-household-size-error"
          className={ `t--subinfo t--err m-t100 ml-ami-calculator__prompt-answer-error` }
          aria-live="polite"
        >{ props.formControlData.errorMessage }</div>
      </div>
    </fieldset>
  );
}

AmiCalculatorHouseholdSize.propTypes = {
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formControlData": PropTypes.object,
};

AmiCalculatorHouseholdSize.displayName = "HouseholdSize";

export default AmiCalculatorHouseholdSize;
