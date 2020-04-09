import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
import Checkbox from '@components/Checkbox';
import Row from '@components/Row';
// import Column from '@components/Column';

import './AmiCalculatorHouseholdIncome.scss';

function AmiCalculatorHouseholdIncome( props ) {
  const [money, setMoney] = useState( '' );

  function pad( num, size ) {
    let s = `${num}`;
    while ( s.length < size ) s = `0${s}`;
    return s;
  }

  const format = ( string ) => {
    const sanitized = string.trim().replace( /[^0-9]+/g, '' );
    // const float = parseFloat( sanitized );

    // if ( !Number.isNaN( float ) ) {
    //   // Via: https://blog.abelotech.com/posts/number-currency-formatting-javascript/
    //   const formatted = float.toString().replace( /(\d)(?=(\d{3})+(?!\d))/g, '$1,' );
    //   const currency = `$${formatted}`;
    //   return currency;
    // }

    return sanitized;
  };
  const handleMoneyChange = ( event ) => {
    const formatted = format( event.target.value );

    if ( formatted.length <= 2 ) {
      setMoney( `$0.${pad( formatted, 2 )}` );
    } else {
      setMoney( `${formatted.substring( 0, formatted.length - 2 )}.${formatted.substr( -2 )}` );
    }
    event.stopPropagation();
  };

  return (
    <fieldset className={ `ml-ami-calculator__household-income ml-ami-calculator__prompt` }>
      <legend className="ml-ami-calculator__prompt-question">What is the total combined income all 3 people who live in your household before taxes?</legend>
      <Icon className="ml-ami-calculator__prompt-answer-icon" icon="deposit check" width="212" />
      <div className="wallet">
        <input className="money" type="text" pattern="[0-9]+" placeholder="$0.00" onChange={ handleMoneyChange } />
        <output className="money-formatted">{ money }</output>
      </div>
      <Row>
        <Checkbox>Yearly</Checkbox>
        <Checkbox>Monthly</Checkbox>
      </Row>
    </fieldset>
  );
}

AmiCalculatorHouseholdIncome.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default AmiCalculatorHouseholdIncome;
