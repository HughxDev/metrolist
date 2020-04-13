import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
// import Checkbox from '@components/Checkbox';
import Scale from '@components/Scale';
// import Row from '@components/Row';
// import Column from '@components/Column';
import Stack from '@components/Stack';

import './AmiCalculatorHouseholdIncome.scss';

function AmiCalculatorHouseholdIncome( props ) {
  const [money, setMoney] = useState( '' );

  function pad( num, size ) {
    let s = `${num}`;
    while ( s.length < size ) s = `0${s}`;
    return s;
  }

  const handleMoneyChange = ( event ) => {
    // Sanitize input
    const amount = event.target.value.trim().replace( /[^0-9]+/g, '' );
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

    if ( formatted === '$0.00' ) {
      setMoney( '' );
      event.target.value = '';
    } else {
      setMoney( formatted );
    }

    event.stopPropagation();
  };

  return (
    <fieldset className={ `ml-ami-calculator__household-income ml-ami-calculator__prompt` }>
      <legend className="ml-ami-calculator__prompt-question">What is the total combined income all 3 people who live in your household before taxes?</legend>
      <Icon className="ml-ami-calculator__prompt-answer-icon" icon="deposit check" width="212" />
      <Stack space="ami-calculator-income-rate">
        <div className="ml-ami-calculator__income">{/* style={ { "width": `${money.length ? `${money.length}rem` : ''}` } } */}
          <input className="money" type="number" pattern="[0-9]*" placeholder="$0.00" onChange={ handleMoneyChange } />
          <output className="money-formatted">{ money }</output>
        </div>
        {/* <Row className="ml-ami-calculator__income-rate">
          <Checkbox className="ml-ami-calculator__income-rate-option" columnWidth="1/2">Yearly</Checkbox>
          <Checkbox className="ml-ami-calculator__income-rate-option" columnWidth="1/2">Monthly</Checkbox>
        </Row> */}
        <Scale criterion="incomeRate" value="Yearly,Monthly" defaultValue="Monthly" />
      </Stack>
    </fieldset>
  );
}

AmiCalculatorHouseholdIncome.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default AmiCalculatorHouseholdIncome;
