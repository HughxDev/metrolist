import React, {
  useState, useRef, useEffect, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, Link, useRouteMatch, useLocation, useHistory, withRouter,
} from 'react-router-dom';
import {
  TransitionGroup,
  CSSTransition,
} from "react-transition-group";
// import { pascalCase } from 'change-case';

import { hasOwnProperty } from '@util/objects';
import { slugify, uncapitalize, componentCase } from '@util/strings';

import Button from '@components/Button';
import ProgressBar from '@components/ProgressBar';
import Row from '@components/Row';
import Stack from '@components/Stack';
import Alert from '@components/Alert';

import HouseholdSize from './_AmiEstimatorHouseholdSize';
import HouseholdIncome from './_AmiEstimatorHouseholdIncome';
import Disclosure from './_AmiEstimatorDisclosure';
import Result from './_AmiEstimatorResult';

import './AmiEstimator.scss';

function AmiEstimator( props ) {
  // const { match, location, history } = props;
  const { path } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const [heights, setHeights] = useState( {} );

  useEffect( () => {
    console.log( { heights } );
  }, [heights] );

  const noErrors = {
    "steps": [...props.steps],
    "alert": {
      "page": "all",
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "householdSize": {
      "page": 1,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "householdIncome": {
      "page": 2,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "incomeRate": {
      "page": 2,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "disclosure": {
      "page": 3,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "amiEstimation": {
      "page": 4,
      "value": "",
      // "errorMessage": "",
      // "errorRef": useRef(),
    },
  };
  const [formData, setFormData] = useState( noErrors );
  const formRef = useRef();
  const totalSteps = props.steps.length;
  const badErrorMessageElementError = ( showHide = 'show/hide' ) => {
    throw new Error(
      `Can’t ${showHide} UI error message: the value passed to \`${showHide}ErrorMessage\` is “${typeof $errorMessage}”;`
      + ` should be a DOM element or a React ref pointing to a DOM element. Check the state object and make sure your input has an \`errorRef\` property.`,
    );
  };

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

  const reportMissingValidityProperty = ( $formControl ) => {
    throw new Error(
      `Form control `
        + `\`${$formControl.nodeName.toLowerCase()}`
        + `${$formControl.id && `#${$formControl.id}`}`
        + `${$formControl.className && `.${$formControl.className}`}\``
      + ` does not have the \`validity\` or \`checkValidity\` properties.`
      + ` This means either the current browser does not support HTML5 forms, or the React ref is misconfigured.`,
    );
  };

  const reportMissingDisplayNameProperty = ( index ) => {
    throw new Error(
      `AMI Calculator step definition is incomplete:`
      + ` the object at \`AmiEstimator.steps[${index}]\` either needs a \`relativePath\` property,`
      + ` or its constituent ami-estimator needs to specify React’s \`displayName\` property.`,
    );
  };

  const getStepNumberFromPath = () => {
    const currentRelativePath = location.pathname.replace( path, '/' ).replace( '//', '/' );

    for ( let index = 0; index < props.steps.length; index++ ) {
      const currentStep = props.steps[index];
      let relativePath;

      if ( hasOwnProperty( currentStep, 'relativePath' ) ) {
        relativePath = currentStep.relativePath;
      } else if ( hasOwnProperty( currentStep.component, 'displayName' ) ) {
        relativePath = `/${slugify( currentStep.component.displayName )}`;
      } else {
        reportMissingDisplayNameProperty( index );
      }

      if ( relativePath === currentRelativePath ) {
        return ( index + 1 );
      }
    }

    throw new Error( `Cannot find step number for ${location.pathname}; please check the \`AmiEstimator.steps\` array.` );
  };

  const [step, setStep] = useState( getStepNumberFromPath() );

  let adjustingStepSize;

  const adjustStepSize = () => {
    const $form = () => ( formRef.current || document.querySelector( 'form' ) );
    const $step = () => $form().querySelector( '.step' );
    const $prompt = () => $step().querySelector( '.ml-ami-estimator__prompt' );

    console.log( { $form, $step } );

    console.log( { '$prompt()': $prompt() } );
    console.log( 'getPropertyValue', getComputedStyle( $prompt() ).getPropertyValue( 'height' ) );

    $step().style.height = getComputedStyle( $prompt() ).getPropertyValue( 'height' );
  };

  const getNextStepPath = () => {
    const nextStep = ( step + 1 );
    const stepDefinition = props.steps[nextStep - 1];

    // console.log( `Going from step ${step} to step ${nextStep}` );
    // console.log( `props.steps[${nextStep - 1}]`, stepDefinition );

    if ( nextStep <= props.steps.length ) {
      if ( stepDefinition === props.steps[0] ) {
        return path;
      }

      let relativePath = '';

      if ( hasOwnProperty( stepDefinition, 'relativePath' ) ) {
        relativePath = stepDefinition.relativePath;
      } else if ( hasOwnProperty( stepDefinition.component, 'displayName' ) ) {
        relativePath = `/${slugify( stepDefinition.component.displayName )}`;
      } else {
        reportMissingDisplayNameProperty( nextStep - 1 );
      }

      return `${path}${relativePath}`;
    }

    return null;
  };

  const getPreviousStepPath = () => {
    const previousStep = ( step - 1 );
    const stepDefinition = props.steps[previousStep - 1];

    // console.log( `Going from step ${step} to step ${previousStep}` );
    // console.log( `props.steps[${previousStep - 1}]`, stepDefinition );

    if ( previousStep >= 0 ) {
      if ( stepDefinition === props.steps[0] ) {
        return path;
      }

      return `${path}/${slugify( stepDefinition.component.displayName )}`;
    }

    return null;
  };

  const navigateForward = () => {
    const nextStepPath = getNextStepPath();

    if ( nextStepPath !== null ) {
      props.history.push( nextStepPath );
    } else {
      console.error( 'Can’t navigate forward' );
    }
  };

  const navigateBackward = () => {
    const previousStepPath = getPreviousStepPath();

    if ( previousStepPath !== null ) {
      props.history.push( previousStepPath );
    } else {
      console.error( 'Can’t navigate backward' );
    }
  };

  const handleSubmit = ( event ) => {
    event.preventDefault();
  };

  let interval;
  const adjustParentHeight = ( selfRef ) => {
    interval = setInterval( () => {
      if ( selfRef && selfRef.current ) {
        let $step = selfRef.current.parentNode;

        while ( !$step.classList.contains( 'step' ) ) {
          $step = $step.parentNode;
        }

        if ( !$step.classList.contains( 'step' ) ) {
          throw new Error( 'Yer fucked' );
        }

        const stepHeight = getComputedStyle( $step ).getPropertyValue( 'height' );
        const promptHeight = getComputedStyle( selfRef.current ).getPropertyValue( 'height' );

        if ( stepHeight !== promptHeight ) {
          console.log( 'no match; setting' );
          $step.style.height = promptHeight;
        } else {
          console.log( 'matched; cleared' );
          clearInterval( interval );
        }
      }
    }, 1000 );
  };

  const getErrors = () => {
    const $form = formRef.current;
    const formValidity = $form.checkValidity();
    const newErrors = { ...formData };
    let numberOfErrors = 0;

    if ( !formValidity ) {
      const $elements = $form.elements;
      const radioButtons = {};

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
              "errorMessage": "Please fill out this field.",
            };

            numberOfErrors++;
          }
        } else {
          reportMissingValidityProperty( $element );
        } // if validity in $element
      } // for

      if ( numberOfErrors ) {
        newErrors.alert = {
          ...formData.alert,
          "errorMessage": "There were errors in your submission.",
        };
      }
    } else {
      Object.keys( formData ).forEach( ( errorName ) => {
        newErrors[errorName].errorMessage = '';
      } );
    }

    return [newErrors, numberOfErrors];
  };

  const clearErrors = ( errorNameList, newFormData = formData ) => {
    errorNameList.forEach( ( errorName ) => {
      try {
        hideErrorMessage( newFormData[errorName].errorRef );
      } catch ( exception ) {
        console.error( exception );
      }
    } );

    setFormData( newFormData );
  };

  const populateErrors = ( errorNameList, newFormData = formData ) => {
    errorNameList.forEach( ( errorName ) => {
      try {
        showErrorMessage( newFormData[errorName].errorRef );
      } catch ( exception ) {
        console.error( exception );
      }
    } );

    setFormData( newFormData );
  };

  const clearAlert = ( newFormData = formData ) => {
    hideErrorMessage( newFormData.alert.errorRef );
    newFormData.alert.errorMessage = '';
    setFormData( newFormData );
  };

  const handleFormInteraction = ( event ) => {
    const navigatePrevious = event.target.hasAttribute( 'data-navigate-previous' );
    const navigateNext = event.target.hasAttribute( 'data-navigate-next' );

    if ( navigatePrevious ) {
      clearAlert();
      navigateBackward();
    } else {
      const [newFormData, numberOfErrors] = getErrors();
      const errorNameList = Object.keys( newFormData )
        .filter( ( formDataKey ) => (
          ( newFormData[formDataKey].page === step )
            || ( newFormData[formDataKey].page === 'all' )
        ) );

      if (
        ( event.type === 'change' )
        || ( event.type === 'keydown' )
      ) {
        if ( formRef.current ) {
          const { name } = event.target;

          Array.from( formRef.current.elements ).forEach( ( $element, index ) => {
            if ( hasOwnProperty( newFormData, name ) ) {
              newFormData[name].value = event.target.value;
            } else {
              const nodeName = $element.nodeName.toLowerCase();
              const type = $element.getAttribute( 'type' );
              const { id, className } = $element;
              const elementName = $element.name;
              let reason;

              if ( !elementName ) {
                reason = `The form element \`${nodeName}${type ? `[type="${type}"]` : ''}${id ? `#${id}` : ''}${className ? `.${className.replace( /\s+/g, '.' )}` : ''}\` at \`formRef.current.elements[${index}]\` is missing the \`name\` attribute.`;
                console.warn( `Skipping state synchronization: ${reason}` );
              } else {
                reason = `The state object for AmiEstimator is missing a key named \`${name}\`.`;
                console.error( `Can’t synchronize React state with form state: ${reason}` );
              }
            }
          } );
        } else {
          console.error( new Error( `\`formRef.current\` returned falsy; can’t synchronize React state with form state. As a result, the AMI calculation will either be inaccurate or won’t work at all.` ) );
        }
      } // if change event

      if ( numberOfErrors > 0 ) {
        populateErrors( errorNameList, newFormData );
      } else {
        clearErrors( errorNameList, newFormData );

        if ( navigateNext ) {
          navigateForward();
        }
      }

      if ( navigateNext || navigatePrevious ) {
        event.preventDefault();
      }
    }
  };

  return (
    <Stack as="article" className={ `ml-ami-estimator${props.className ? ` ${props.className}` : ''}` } space="2">
      <h2 className="sr-only">AMI Calculator</h2>
      <Stack as="header" space="2">
        <h3 className="sh-title ml-ami-estimator__heading">Find Housing Based on Your Income &amp; Household Size…</h3>
        <ProgressBar current={ step } total={ totalSteps } />
      </Stack>
      <Alert
        id="ami-estimator-form-formData"
        ref={ formData.alert.errorRef }
        className={ `ml-ami-estimator__error-alert` }
        variant="danger"
      >
        { formData.alert.errorMessage }
      </Alert>
      <form
        ref={ formRef }
        className="ami-estimator__form"
        onSubmit={ handleSubmit }
        onChange={ handleFormInteraction }
        // onKeyDown={ handleFormInteraction }
        // onClick={ handleFormInteraction }
      >
        <Stack space="1">{/* ami-estimator-navigation */}
          {/* <nav>
            <Link to={`${path}`}>Step 1</Link><br/>
            <Link to={`${path}/household-income`}>Step 2</Link><br/>
            <Link to={`${path}/disclosure`}>Step 3</Link>
            <Link to={`${path}/results`}>Step 4</Link>
          </nav> */}
          <TransitionGroup id="step" className="step" style={ Object.keys( heights ).length ? { "height": heights[location.pathname] } : {} }>
            {/*
              This is no different than other usage of
              <CSSTransition>, just make sure to pass
              `location` to `Switch` so it can match
              the old location as it animates out.
            */}
            <CSSTransition
              key={ location.key }
              classNames="slide"
              in={ true }
              appear={ false }
              // classNames="pageSlider"
              mountOnEnter={ false }
              unmountOnExit={ false }
              timeout={ 900 }
              // timeout={ { "enter": 80000, "exit": 40000 } }
            >
              <Switch location={ location }>
                {
                  props.steps.map( ( currentStep, index ) => {
                    const isFirstStep = ( index === 0 );
                    let displayName;

                    if ( hasOwnProperty( currentStep, 'relativePath' ) && ( currentStep.relativePath !== '/' ) ) {
                      displayName = componentCase( currentStep.relativePath );
                    } else if ( hasOwnProperty( currentStep.component, 'displayName' ) ) {
                      displayName = currentStep.component.displayName;
                    } else {
                      reportMissingDisplayNameProperty( index );
                    }

                    const formDataKey = uncapitalize( displayName );
                    // const Step = React.createElement( currentStep, { setStep, "formData": formData[formDataKey] }, null );
                    const routePath = ( isFirstStep ? path : `${path}/${slugify( displayName )}` );

                    return (
                      <Route key={ formDataKey } exact={ isFirstStep } path={ routePath } render={ () => (
                        <currentStep.component
                          key={ formDataKey }
                          // adjustParentHeight={ adjustParentHeight }
                          pathname={ location.pathname }
                          step={ index + 1 }
                          setStep={ setStep }
                          formData={ formData }
                          setFormData={ setFormData }
                          heights={ heights }
                          setHeights={ setHeights }
                        />
                      ) } />
                    );
                  } ) }
              </Switch>
            </CSSTransition>
          </TransitionGroup>
          <Row as="nav" className={ `ml-ami-estimator__navigation ml-ami-estimator__navigation--step-${step}` } onClick={ handleFormInteraction }>
            <Button
              className="ml-ami-estimator__button"
              type="button"
              disabled={ ( step === 1 ) }
              data-is-navigation-button
              data-navigate-previous
            >Back</Button>
            <Button
              className="ml-ami-estimator__button"
              type="button"
              variant="primary"
              disabled={ ( step === totalSteps ) }
              data-is-navigation-button
              data-navigate-next
            >Next</Button>
          </Row>
        </Stack>

      </form>
      <Stack as="footer" className="ml-ami-estimator__footer" space="ami-estimator-footer">
        <p><a className="ml-ami-estimator__exit-link" href="#">Exit</a></p>
        <p><a className="ml-ami-estimator__email-link" href="mailto:metrolist@boston.gov" onClick={ ( e ) => e.preventDefault() }>For questions email <span className="ml-ami-estimator__email-link-email-address">metrolist@boston.gov</span></a></p>
      </Stack>
    </Stack>
  );
}

AmiEstimator.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  // "match": PropTypes.object.isRequired,
  // "location": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
  "steps": PropTypes.arrayOf(
    PropTypes.shape( {
      "relativePath": PropTypes.string,
      "component": PropTypes.oneOfType( [PropTypes.func, PropTypes.object] ).isRequired,
    } ),
  ).isRequired,
};

AmiEstimator.defaultProps = {
  "steps": [
    {
      "relativePath": "/",
      "component": HouseholdSize,
    },
    {
      "relativePath": "/household-income",
      "component": HouseholdIncome,
    },
    {
      "relativePath": "/disclosure",
      "component": Disclosure,
    },
    {
      "relativePath": "/result",
      "component": Result,
    },
  ],
};

export default withRouter( AmiEstimator );
// export default AmiEstimator;
