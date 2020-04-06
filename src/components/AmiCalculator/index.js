import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
import Scale from '@components/Scale';
import Button from '@components/Button';
import ProgressBar from '@components/ProgressBar';
import Row from '@components/Row';
import Stack from '@components/Stack';

import './AmiCalculator.scss';

function AmiCalculator( props ) {
  const [step, setStep] = useState( 1 );
  const totalSteps = 4;
  const nextButtonOnClick = ( event ) => {
    setStep( step + 1 );
    event.preventDefault();
  };
  const previousButtonOnClick = ( event ) => {
    setStep( step - 1 );
    event.preventDefault();
  };

  return (
    <Stack as="article" className={ `ml-ami-calculator${props.className ? ` ${props.className}` : ''}` } space="ami-calculator">
      <h2 className="sr-only">AMI Calculator</h2>
      <Stack as="header" className="ml-ami-calculator__header" space="2">
        <h3 className="sh-title ml-ami-calculator__heading">Find Housing Based on Your Income &amp; Household Size…</h3>
        <ProgressBar current={ step } total={ totalSteps } />
      </Stack>
      <form>
        <Stack space="ami-calculator-navigation">
          <fieldset className="ml-ami-calculator__prompt">
            <legend className="ml-ami-calculator__prompt-question">How many people live in your household of any age?</legend>
            <div className="ml-ami-calculator__prompt-answer">
              <Icon className="ml-ami-calculator__prompt-answer-icon" icon="family2" width="227" />
              <Scale className="ml-ami-calculator__prompt--answer-input" criterion="familySize" value="1,2,3,4,5,6+" />
            </div>
          </fieldset>
          <Row as="nav" className={ `ml-ami-calculator__navigation ml-ami-calculator__navigation--step-${step}` }>
            { ( step > 1 ) && <Button className="ml-ami-calculator__button" onClick={ previousButtonOnClick }>Back</Button> }
            <Button className="ml-ami-calculator__button" variant="primary" onClick={ nextButtonOnClick } disabled={ step === totalSteps }>Next</Button>
          </Row>
        </Stack>
      </form>
      <Stack as="footer" className="ml-ami-calculator__footer" space="ami-calculator-footer">
        <p><a className="ml-ami-calculator__exit-link" href="#">Exit</a></p>
        <p><a className="ml-ami-calculator__email-link" href="mailto:metrolist@boston.gov" onClick={ ( e ) => e.preventDefault() }>For questions email <span className="ml-ami-calculator__email-link-email-address">metrolist@boston.gov</span></a></p>
      </Stack>
    </Stack>
  );
}

AmiCalculator.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default AmiCalculator;
