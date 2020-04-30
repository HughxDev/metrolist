import React, {
  useEffect, useState, useRef, forwardRef,
} from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
import Scale from '@components/Scale';
import FormErrorMessage from '@components/FormErrorMessage';

import './AmiEstimatorHouseholdSize.scss';

const AmiEstimatorHouseholdSize = forwardRef( ( props, ref ) => {
  const selfRef = useRef();
  const [hasSetHeights, setHasSetHeights] = useState( false );

  useEffect( () => {
    props.setStep( props.step );
  }, [] );

  // useEffect( () => {
  //   props.adjustParentHeight( selfRef );
  // }, [props.step, selfRef.current] );

  useEffect( () => {
    setTimeout( () => {
      // if ( !hasSetHeights ) {
      const newHeights = {
        ...props.heights,
      };
      newHeights[props.pathname] = getComputedStyle( selfRef.current.querySelector( '.ml-ami-estimator__prompt-inner' ) ).getPropertyValue( 'height' );

      props.setHeights( newHeights );

      // setHasSetHeights( true );
      // }
    }, 1000 );
  }, [] );

  return (
    <div ref={ selfRef } className="ml-ami-estimator__household-size ml-ami-estimator__prompt">
      <fieldset className="ml-ami-estimator__prompt-inner">
        <legend className="ml-ami-estimator__prompt-question">How many people live in your household of any age?</legend>
        <div className="ml-ami-estimator__prompt-answer">
          <Icon className="ml-ami-estimator__prompt-answer-icon" icon="family2" width="227" />
          <Scale
            className={ `ml-ami-estimator__prompt--answer-input` }
            criterion="householdSize"
            values="1,2,3,4,5,6+"
            // value={ props.formData.householdSize.value }
            value={ '4' }
            aria-describedby="ami-estimator-form-errors ami-estimator-household-size-error"
            required
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
  "stepRef": PropTypes.object,
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
};

AmiEstimatorHouseholdSize.displayName = "HouseholdSize";

export default AmiEstimatorHouseholdSize;
