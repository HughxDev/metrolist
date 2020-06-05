import React, {
  useEffect, useRef, forwardRef,
} from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
import Scale from '@components/Scale';
import FormErrorMessage from '@components/FormErrorMessage';

import { updatePageTitle } from '@util/a11y-seo';

import './AmiEstimatorHouseholdSize.scss';

const AmiEstimatorHouseholdSize = forwardRef( ( props, ref ) => {
  const selfRef = ( ref || useRef() );
  const isRequired = true;

  useEffect( () => {
    updatePageTitle( 'Household Size', 'AMI Estimator' );
    props.setStep( props.step );
    props.adjustContainerHeight( selfRef );
  }, [] );

  return (
    <div ref={ selfRef } className="ml-ami-estimator__household-size ml-ami-estimator__prompt" data-testid="ml-ami-estimator__household-size">
      <fieldset className="ml-ami-estimator__prompt-inner">
        <legend className="ml-ami-estimator__prompt-question">How many people live in your household of any age?<span className="ml-required">{ isRequired ? '*' : '' }</span></legend>
        <div className="ml-ami-estimator__prompt-answer">
          <Icon className="ml-ami-estimator__prompt-answer-icon" icon="family2" width="227" alt="icon: a family" />
          <Scale
            className={ `ml-ami-estimator__prompt--answer-input` }
            criterion="householdSize"
            values="1,2,3,4,5,6+"
            // units={ { "one": "person", "many": "people" } }
            // unitLabel={ { "type": "aria", "affix": "append" } }
            value={ props.formData.householdSize.value }
            aria-describedby="ami-estimator-household-size-error"
            required={ isRequired }
          />
          <FormErrorMessage
            ref={ props.formData.householdSize.errorRef }
            id="ami-estimator-household-size-error"
            className="ml-ami-estimator__prompt-answer-error"
          >{ props.formData.householdSize.errorMessage }</FormErrorMessage>
        </div>
      </fieldset>
    </div>
  );
} );

AmiEstimatorHouseholdSize.propTypes = {
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
  "adjustContainerHeight": PropTypes.func,
};

AmiEstimatorHouseholdSize.displayName = "HouseholdSize";

export default AmiEstimatorHouseholdSize;
