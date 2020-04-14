import React, { useState, useEffect, useRef } from 'react';
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
  const [money, setMoney] = useState( '' );
  const moneyInputRef = useRef();

  function pad( num, size ) {
    let s = `${num}`;
    while ( s.length < size ) s = `0${s}`;
    return s;
  }

  function formatMoney( amount ) {
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

  // function setMoneyIfGreaterThanZero( formattedAmount, $input ) {
  //   if ( formattedAmount === '$0.00' ) {
  //     setMoney( '$0.00' );

  //     // if ( $input ) {
  //     //   $input.value = '';
  //     // } else {
  //     //   moneyInputRef.current.value = '';
  //     // }
  //   } else {
  //     setMoney( formattedAmount );
  //   }
  // }

  function setMoneyInput( newValue ) {
    // let formattedNewValue = '';

    // if ( newValue.length > 2 ) {
    //   formattedNewValue = `${newValue.substring( 0, newValue.length - 2 )}.${newValue.substring( newValue.length - 2 )}`;
    // } else {
    //   formattedNewValue = newValue.replace( /\./g, '' );
    // }

    moneyInputRef.current.value = formatMoney( newValue );
  }

  const handleMoneyChange = ( event ) => {
    // Sanitize input
    // const amount = event.target.value;
    const formattedAmount = formatMoney( event.target.value );

    // setMoney( formattedAmount );
    setMoneyInput( formattedAmount );
    // setMoneyInput( amount );
  };

  useEffect( () => {
    props.setStep( props.step );

    const initialAmount = props.formControlData.householdIncome.value;

    if ( initialAmount.length ) {
      const formattedInitialAmount = formatMoney( initialAmount );

      // setMoney( formattedInitialAmount );
      setMoneyInput( formattedInitialAmount );
      // setMoneyInput( initialAmount );
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
            value={ ( props.formControlData.householdIncome.value === '$0.00' ) ? '' : props.formControlData.householdIncome.value }
            type="text"
            pattern="[0-9]*"
            placeholder="$0.00"
            aria-describedby="ami-calculator-form-errors ami-calculator-household-income-error"
            onChange={ handleMoneyChange }
            // onKeyDown={ handleMoneyChange }
            required
          />
          {/* <output className={ `money-formatted${( !money || ( money === '$0.00' ) ) ? ' money-formatted--zero' : ''}` }>{ money || '$0.00' }</output> */}
        </div>
        <FormErrorMessage
          ref={ props.formControlData.householdIncome.errorRef }
          id="ami-calculator-household-income-error"
          className="ml-ami-calculator__prompt-answer-error"
        >{ props.formControlData.householdIncome.errorMessage }</FormErrorMessage>
        {/* <Row className="ml-ami-calculator__income-rate">
          <Checkbox className="ml-ami-calculator__income-rate-option" columnWidth="1/2">Yearly</Checkbox>
          <Checkbox className="ml-ami-calculator__income-rate-option" columnWidth="1/2">Monthly</Checkbox>
        </Row> */}
        <Scale
          criterion="incomeRate"
          values="Yearly,Monthly"
          value={ props.formControlData.incomeRate.value || 'Monthly' }
          required
        />
        <FormErrorMessage
          ref={ props.formControlData.incomeRate.errorRef }
          id="ami-calculator-household-income-error"
          className="ml-ami-calculator__prompt-answer-error"
        >{ props.formControlData.incomeRate.errorMessage }</FormErrorMessage>
      </Stack>
    </fieldset>
  );
}

AmiCalculatorHouseholdIncome.propTypes = {
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formControlData": PropTypes.object,
};

AmiCalculatorHouseholdIncome.displayName = "HouseholdIncome";

export default AmiCalculatorHouseholdIncome;
