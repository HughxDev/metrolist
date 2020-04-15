import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
// import Checkbox from '@components/Checkbox';
import Scale from '@components/Scale';
// import Row from '@components/Row';
// import Column from '@components/Column';
import Stack from '@components/Stack';
import FormErrorMessage from '@components/FormErrorMessage';

import './AmiCalculatorHouseholdIncome.scss';

function AmiCalculatorHouseholdIncome( props ) {
  const moneyInputRef = useRef();

  function pad( num, size ) {
    let s = `${num}`;
    while ( s.length < size ) s = `0${s}`;
    return s;
  }

  function formatMoney( amount ) {
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

  function setMoneyInput( newValue ) {
    if ( newValue === '$0.00' ) {
      moneyInputRef.current.value = '';
    } else {
      moneyInputRef.current.value = formatMoney( newValue );
    }
  }

  const handleMoneyChange = ( event ) => {
    const formattedAmount = formatMoney( event.target.value );

    setMoneyInput( formattedAmount );
  };

  useEffect( () => {
    props.setStep( props.step );

    const initialAmount = props.formData.householdIncome.value;

    if ( initialAmount.length ) {
      const formattedInitialAmount = formatMoney( initialAmount );

      setMoneyInput( formattedInitialAmount );
    }
  }, [] );

  return (
    <fieldset className={ `ml-ami-calculator__household-income ml-ami-calculator__prompt` }>
      <legend className="ml-ami-calculator__prompt-question">What is the total combined income all 3 people who live in your household before taxes?</legend>
      <Icon className="ml-ami-calculator__prompt-answer-icon" icon="deposit check" width="212" />
      <Stack space="1">{/* ami-calculator-income-rate */}
        <div className="ml-ami-calculator__income">{/* style={ { "width": `${money.length ? `${money.length}rem` : ''}` } } */}
          <input
            ref={ moneyInputRef }
            className="money"
            name="householdIncome"
            value={ ( props.formData.householdIncome.value === '$0.00' ) ? '' : props.formData.householdIncome.value }
            type="text"
            pattern="[0-9]*"
            placeholder="$0.00"
            aria-describedby="ami-calculator-form-errors ami-calculator-household-income-error"
            onChange={ handleMoneyChange }
            required
          />
        </div>
        <FormErrorMessage
          ref={ props.formData.householdIncome.errorRef }
          id="ami-calculator-household-income-error"
          className="ml-ami-calculator__prompt-answer-error"
        >{ props.formData.householdIncome.errorMessage }</FormErrorMessage>
        <Scale
          criterion="incomeRate"
          values="Yearly,Monthly"
          value={ props.formData.incomeRate.value || 'Monthly' }
          required
          onChange={ ( event ) => event.stopPropagation() }
        />
        <FormErrorMessage
          ref={ props.formData.incomeRate.errorRef }
          id="ami-calculator-household-income-error"
          className="ml-ami-calculator__prompt-answer-error"
        >{ props.formData.incomeRate.errorMessage }</FormErrorMessage>
      </Stack>
    </fieldset>
  );
}

AmiCalculatorHouseholdIncome.propTypes = {
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
};

AmiCalculatorHouseholdIncome.displayName = "HouseholdIncome";

export default AmiCalculatorHouseholdIncome;
