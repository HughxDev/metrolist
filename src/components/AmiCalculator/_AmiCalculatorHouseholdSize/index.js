import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
import Scale from '@components/Scale';
import FormErrorMessage from '@components/FormErrorMessage';

import './AmiCalculatorHouseholdSize.scss';

function AmiCalculatorHouseholdSize( props ) {
  useEffect( () => {
    props.setStep( props.step );
    console.log( 'props.formControlData', props.formControlData );
  }, [] );

  return (
    <fieldset className="ml-ami-calculator__household-size ml-ami-calculator__prompt">
      <legend className="ml-ami-calculator__prompt-question">How many people live in your household of any age?</legend>
      <div className="ml-ami-calculator__prompt-answer">
        <Icon className="ml-ami-calculator__prompt-answer-icon" icon="family2" width="227" />
        <Scale
          className={ `ml-ami-calculator__prompt--answer-input` }
          criterion="householdSize"
          values="1,2,3,4,5,6+"
          value={ props.formControlData.householdSize.value }
          aria-describedby="ami-calculator-form-errors ami-calculator-household-size-error"
          required
        />
        <FormErrorMessage
          ref={ props.formControlData.householdSize.errorRef }
          id="ami-calculator-household-size-error"
          className="ml-ami-calculator__prompt-answer-error"
        >{ props.formControlData.householdSize.errorMessage }</FormErrorMessage>
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
