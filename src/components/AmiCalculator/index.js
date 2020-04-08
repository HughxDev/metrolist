import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { hasOwnProperty } from '@util/objects';

import Icon from '@components/Icon';
import Scale from '@components/Scale';
import Button from '@components/Button';
import ProgressBar from '@components/ProgressBar';
import Row from '@components/Row';
import Stack from '@components/Stack';
import Alert from '@components/Alert';

import './AmiCalculator.scss';

function AmiCalculator( props ) {
  const [step, setStep] = useState( 1 );
  const noErrors = {
    "alert": {
      "message": "",
      "ref": useRef(),
    },
    "familySize": {
      "message": "",
      "ref": useRef(),
    },
  };
  const [errors, setErrors] = useState( noErrors );
  const formRef = useRef();
  const totalSteps = 4;

  const hideErrorMessage = ( $errorMessage ) => {
    if ( hasOwnProperty( $errorMessage, 'current' ) ) {
      $errorMessage = $errorMessage.current;
    }

    $errorMessage.classList.remove( '--visible' );

    setTimeout( () => {
      $errorMessage.hidden = true;
    }, 62.5 );
  };

  const showErrorMessage = ( $errorMessage, index ) => {
    if ( hasOwnProperty( $errorMessage, 'current' ) ) {
      $errorMessage = $errorMessage.current;
    }

    $errorMessage.hidden = false;

    setTimeout( () => {
      $errorMessage.classList.add( '--visible' );

      if ( index === 0 ) {
        $errorMessage.focus();
      }
    }, 62.5 );
  };

  const reportMissingValidityProperty = ( $formControl ) => (
    console.error(
      `Form control `
        + `\`${$formControl.nodeName.toLowerCase()}`
        + `${$formControl.id && `#${$formControl.id}`}`
        + `${$formControl.className && `.${$formControl.className}`}\``
      + ` does not have the \`validity\` or \`checkValidity\` properties.`
      + ` This means either the current browser does not support HTML5 forms, or the React ref is misconfigured.`,
    )
  );

  const handleSubmit = ( event ) => {
    event.preventDefault();
  };

  const getErrors = () => {
    const $form = formRef.current;
    const formValidity = $form.checkValidity();
    const newErrors = { ...errors };
    let numberOfErrors = 0;

    if ( !formValidity ) {
      const $elements = $form.elements;
      const radioButtons = {};

      newErrors.alert = {
        ...errors.alert,
        "message": "There were errors in your submission.",
      };

      for ( let index = 0; index < $elements.length; index++ ) {
        const $element = $elements[index];
        const { name } = $element;

        if ( hasOwnProperty( radioButtons, $element.name ) ) {
          break;
        }

        if ( 'validity' in $element ) {
          const { validity } = $element;

          if ( validity.valueMissing === true ) {
            if ( $element.type === 'radio' ) {
              radioButtons[name] = true;
            }

            newErrors[name] = {
              ...newErrors[name],
              "message": "Please fill out this field.",
            };

            numberOfErrors++;
          }
        } else {
          reportMissingValidityProperty( $element );
        } // if validity in $element
      } // for
    }

    return [newErrors, numberOfErrors];
  };

  const handleFormInteraction = ( event ) => {
    const [newErrors, numberOfErrors] = getErrors();
    const newErrorList = Object.keys( newErrors );

    if ( numberOfErrors ) {
      newErrorList.forEach( ( newError ) => {
        showErrorMessage( newErrors[newError].ref.current );
      } );

      setErrors( newErrors );
      event.preventDefault();
    } else {
      newErrorList.forEach( ( newError ) => {
        hideErrorMessage( newErrors[newError].ref.current );
      } );

      setErrors( noErrors );
    }
  };

  return (
    <Stack as="article" className={ `ml-ami-calculator${props.className ? ` ${props.className}` : ''}` } space="2">
      <h2 className="sr-only">AMI Calculator</h2>
      <Stack as="header" space="2">
        <h3 className="sh-title ml-ami-calculator__heading">Find Housing Based on Your Income &amp; Household Size…</h3>
        <ProgressBar current={ step } total={ totalSteps } />
      </Stack>
      <Alert
        id="ami-calculator-form-errors"
        ref={ errors.alert.ref }
        className={ `ml-ami-calculator__error-alert` }
        variant="danger"
      >
        { errors.alert.message }
      </Alert>
      <form
        ref={ formRef }
        className="ami-calculator__form"
        onSubmit={ handleSubmit }
        onChange={ handleFormInteraction }
        // onClick={ handleFormInteraction }
      >
        <Stack space="ami-calculator-navigation">
          <fieldset className="ml-ami-calculator__prompt">
            <legend className="ml-ami-calculator__prompt-question">How many people live in your household of any age?</legend>
            <div className="ml-ami-calculator__prompt-answer">
              <Icon className="ml-ami-calculator__prompt-answer-icon" icon="family2" width="227" />
              <Scale
                className={ `ml-ami-calculator__prompt--answer-input` }
                criterion="familySize"
                value="1,2,3,4,5,6+"
                aria-describedby="ami-calculator-form-errors ami-calculator-family-size-error"
                required
              />
              <div
                ref={ errors.familySize.ref }
                id="ami-calculator-family-size-error"
                className={ `t--subinfo t--err m-t100 ml-ami-calculator__prompt-answer-error` }
                aria-live="polite"
              >{ errors.familySize.message }</div>
            </div>
          </fieldset>
          <Row as="nav" className={ `ml-ami-calculator__navigation ml-ami-calculator__navigation--step-${step}` } onClick={ handleFormInteraction }>
            { ( step > 1 ) && <Button className="ml-ami-calculator__button" data-is-navigation-button>Back</Button> }
            <Button className="ml-ami-calculator__button" variant="primary" disabled={ ( step === totalSteps ) } data-is-navigation-button>Next</Button>
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
