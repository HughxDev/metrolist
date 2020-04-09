import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, Link, useRouteMatch, useLocation, withRouter,
} from 'react-router-dom';
import {
  TransitionGroup,
  CSSTransition,
} from "react-transition-group";

import { hasOwnProperty } from '@util/objects';

import Button from '@components/Button';
import ProgressBar from '@components/ProgressBar';
import Row from '@components/Row';
import Stack from '@components/Stack';
import Alert from '@components/Alert';

import HouseholdSize from './_AmiCalculatorHouseholdSize';
import HouseholdIncome from './_AmiCalculatorHouseholdIncome';

import './AmiCalculator.scss';

function AmiCalculator( props ) {
  // const { match, location, history } = props;
  const { path, url } = useRouteMatch();
  const location = useLocation();
  const [step, setStep] = useState( 1 );
  const noErrors = {
    "alert": {
      "message": "",
      "ref": useRef(),
    },
    "householdSize": {
      "message": "",
      "ref": useRef(),
    },
    "householdIncome": {
      "message": "",
      "ref": useRef(),
    },
  };
  const [errors, setErrors] = useState( noErrors );
  const formRef = useRef();
  const totalSteps = 4;
  const badErrorMessageElementError = ( showHide = 'show/hide' ) => (
    console.error(
      `Can’t ${showHide} UI error message: the value passed to \`${showHide}ErrorMessage\` is “${typeof $errorMessage}”;`
      + ` should be a DOM element or a React ref pointing to a DOM element.`,
    )
  );

  const hideErrorMessage = ( $errorMessage ) => {
    if ( $errorMessage ) {
      if ( hasOwnProperty( $errorMessage, 'current' ) ) {
        $errorMessage = $errorMessage.current;
      }

      if ( !$errorMessage ) {
        badErrorMessageElementError( 'hide' );
        return;
      }

      $errorMessage.classList.remove( '--visible' );

      setTimeout( () => {
        $errorMessage.hidden = true;
      }, 62.5 );
    } else {
      badErrorMessageElementError( 'hide' );
    }
  };

  const showErrorMessage = ( $errorMessage, index ) => {
    if ( $errorMessage ) {
      if ( hasOwnProperty( $errorMessage, 'current' ) ) {
        $errorMessage = $errorMessage.current;
      }

      if ( !$errorMessage ) {
        badErrorMessageElementError( 'show' );
        return;
      }

      $errorMessage.hidden = false;

      setTimeout( () => {
        $errorMessage.classList.add( '--visible' );

        if ( index === 0 ) {
          $errorMessage.focus();
        }
      }, 62.5 );
    } else {
      badErrorMessageElementError( 'show' );
    }
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
    setStep( step + 1 );
    props.history.push( `${path}/household-income` );
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
        showErrorMessage( newErrors[newError].ref );
      } );

      setErrors( newErrors );
      event.preventDefault();
    } else {
      newErrorList.forEach( ( newError ) => {
        hideErrorMessage( newErrors[newError].ref );
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
        <Stack space="1">{/* ami-calculator-navigation */}
          <nav>
            <Link to={`${path}`}>Step 1</Link><br/>
            <Link to={`${path}/household-income`}>Step 2</Link>
          </nav>
          <TransitionGroup className="step">
            {/*
              This is no different than other usage of
              <CSSTransition>, just make sure to pass
              `location` to `Switch` so it can match
              the old location as it animates out.
            */}
            <CSSTransition
              key={location.key}
              classNames="fade"
              timeout={450}
            >
              <Switch location={location}>
                <Route exact path={ path }>
                  <HouseholdSize error={ errors.householdSize } />
                </Route>
                <Route path={ `${path}/household-income` }>
                  <HouseholdIncome error={ errors.householdIncome } />
                </Route>
              </Switch>
            </CSSTransition>
          </TransitionGroup>
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
  // "match": PropTypes.object.isRequired,
  // "location": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
};

export default withRouter( AmiCalculator );
// export default AmiCalculator;
