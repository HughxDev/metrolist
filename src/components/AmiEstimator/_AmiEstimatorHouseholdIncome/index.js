import React, {
  useEffect, useRef, forwardRef,
} from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
// import Checkbox from '@components/Checkbox';
import Scale from '@components/Scale';
// import Row from '@components/Row';
// import Column from '@components/Column';
import Stack from '@components/Stack';
import FormErrorMessage from '@components/FormErrorMessage';

import './AmiEstimatorHouseholdIncome.scss';

const AmiEstimatorHouseholdIncome = forwardRef( ( props, ref ) => {
  const selfRef = ( ref || useRef() );
  const incomeInputRef = useRef();
  const defaultIncomeRate = 'Monthly';

  function pad( num, size ) {
    let s = `${num}`;
    while ( s.length < size ) s = `0${s}`;
    return s;
  }

  function formatIncome( amount ) {
    // Sanitize input
    amount = amount.trim().replace( /[^0-9]+/g, '' );
    let formatted;

    // If less than or equal to two digits long, attribute the digits to cents
    if ( amount.length <= 2 ) {
      formatted = `$0.${pad( amount, 2 )}`;
    // If greater than two digits long, attribute the remaining digits to dollars
    } else {
      const dollars = amount.substring( 0, amount.length - 2 );
      const dollarAmount = parseInt( dollars, 10 );
      let formattedDollars;

      if ( dollarAmount >= 1000 ) {
        // Add thousands separators
        // Via: https://blog.abelotech.com/posts/number-currency-formatting-javascript/
        formattedDollars = dollarAmount.toString().replace( /(\d)(?=(\d{3})+(?!\d))/g, '$1,' );
      } else {
        formattedDollars = dollarAmount.toString();
      }

      const cents = amount.substr( -2 );

      formatted = `$${formattedDollars}.${cents}`;
    }

    return formatted;
  }

  function setIncomeInput( newValue ) {
    if ( newValue === '$0.00' ) {
      incomeInputRef.current.value = '';
    } else {
      incomeInputRef.current.value = formatIncome( newValue );
    }
  }

  const handleIncomeChange = ( event ) => {
    const formattedAmount = formatIncome( event.target.value );

    setIncomeInput( formattedAmount );
  };

  useEffect( () => {
    props.setStep( props.step );
    props.adjustContainerHeight( selfRef );

    const initialAmount = props.formData.householdIncome.value;

    if ( initialAmount.length ) {
      const formattedInitialAmount = formatIncome( initialAmount );

      setIncomeInput( formattedInitialAmount );
    }

    if ( !props.formData.incomeRate.value ) {
      const newFormData = {
        ...props.formData,
        "incomeRate": {
          ...props.formData.incomeRate,
          "value": defaultIncomeRate,
        },
      };

      props.setFormData( newFormData );
    }
  }, [] );

  return (
    <div ref={ selfRef } className={ `ml-ami-estimator__household-income ml-ami-estimator__prompt` } data-testid="ml-ami-estimator__household-income">
      <fieldset className="ml-ami-estimator__prompt-inner">
        <legend className="ml-ami-estimator__prompt-question">What is the total combined income of all { props.formData.householdSize.value ? `${props.formData.householdSize.value} people` : 'people' } who live in your household before taxes?</legend>
        <Icon className="ml-ami-estimator__prompt-answer-icon" icon="deposit check" width="212" />
        <Stack space="1">{/* ami-estimator-income-rate */}
          <input
            ref={ incomeInputRef }
            className="ml-ami-estimator__household-income-input"
            name="householdIncome"
            value={ ( props.formData.householdIncome.value === '$0.00' ) ? '' : props.formData.householdIncome.value }
            type="text"
            pattern="[0-9]*"
            placeholder="$0.00"
            aria-describedby="ami-estimator-form-errors ami-estimator-household-income-error"
            onChange={ handleIncomeChange }
            required
          />
          <FormErrorMessage
            ref={ props.formData.householdIncome.errorRef }
            id="ami-estimator-household-income-error"
            className="ml-ami-estimator__prompt-answer-error"
          >{ props.formData.householdIncome.errorMessage }</FormErrorMessage>
          <Scale
            criterion="incomeRate"
            values="Yearly,Monthly"
            value={ props.formData.incomeRate.value || defaultIncomeRate }
            required
            onChange={ ( event ) => {
              console.log( 'incomeRate scale changed', event.target.nodeName, event.target.value );
              // event.stopPropagation();
            } }
          />
          <FormErrorMessage
            ref={ props.formData.incomeRate.errorRef }
            id="ami-estimator-household-income-error"
            className="ml-ami-estimator__prompt-answer-error"
          >{ props.formData.incomeRate.errorMessage }</FormErrorMessage>
        </Stack>
      </fieldset>
    </div>
  );
} );

AmiEstimatorHouseholdIncome.propTypes = {
  "stepRef": PropTypes.object,
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object.isRequired,
  "setFormData": PropTypes.func.isRequired,
  "pathname": PropTypes.string,
  "adjustContainerHeight": PropTypes.func,
};

AmiEstimatorHouseholdIncome.displayName = "HouseholdIncome";

export default AmiEstimatorHouseholdIncome;
