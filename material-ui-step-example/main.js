import React from "react"
import { render } from "react-dom"
import { createStore, combineReducers } from "redux"
import { Provider, connect} from "react-redux"
import injectTapEventPlugin from 'react-tap-event-plugin'
import RaisedButton from 'material-ui/RaisedButton'
import {deepOrange500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
injectTapEventPlugin()


function Box() {
  const muiTheme = getMuiTheme({
    palette: {
      accent1Color: deepOrange500
    }
  })


  return (
    <MuiThemeProvider muiTheme={muiTheme}>
    <Card>
    <CardHeader
      title="URL Avatar"
      subtitle="Subtitle"
      avatar="http://lorempixel.com/100/100/nature/"
    />
    <CardText>
        <div style={{textAlign: 'center', paddingTop: 200}}>
          <HorizontalLinearStepper/>
        </div>
    </CardText>
    </Card>
    </MuiThemeProvider>
  )
}

function getStepContent(stepIndex) {
  const style = {
    marginLeft: 20,
  };

  switch (stepIndex) {
    case 0:
      return (
        <p>
          Select campaign settings. Campaign settings can include your budget, network, bidding
          options and adjustments, location targeting, campaign end date, and other settings that
          affect an entire campaign.
        </p>
      );
    case 1:
      return (
        <div>
        <TextField floatingLabelText="First name" style={style} underlineShow={false} />
        <Divider />
        <TextField floatingLabelText="Middle name" style={style} underlineShow={false} />
        <Divider />
        <TextField floatingLabelText="Last name" style={style} underlineShow={false} />
        <Divider />
        <TextField floatingLabelText="Email address" style={style} underlineShow={false} />
        <Divider />
          <p>
            Ad group status is different than the statuses for campaigns, ads, and keywords, though the
            statuses can affect each other. Ad groups are contained within a campaign, and each campaign can
            have one or more ad groups. Within each ad group are ads, keywords, and bids.
          </p>
          <p>Something something whatever cool</p>
        </div>
      );
    case 2:
      return (
        <p>
          Try out different ad text to see what brings in the most customers, and learn how to
          enhance your ads using features like ad extensions. If you run into any problems with your
          ads, find out how to tell if they are running and how to resolve approval issues.
        </p>
      );
    default:
      return 'You\'re a long way from home sonny jim!';
  }
}

function HorizontalLinearStepper_({ stepIndex, dispatch }) {
   let finished = (stepIndex >= 2)
    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select campaign settings</StepLabel>
          </Step>
          <Step>
            <StepLabel>Create an ad group</StepLabel>
          </Step>
          <Step>
            <StepLabel>Create an ad</StepLabel>
          </Step>
        </Stepper>
        <div style={{margin: '0 16px'}}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  dispatch({ "type": "RESET_STEP" })
                }}
              >
                Click here
              </a> to reset the example.
            </p>
          ) : (
            <div>
              <p>{getStepContent(stepIndex)}</p>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={ ()  => {
                      dispatch({ "type": "DECREASE_STEP" })
                      }
                    }
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  primary={true}
                  onTouchTap={ () => {
                    dispatch({ "type": "INCREASE_STEP" })
                    }
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

const HorizontalLinearStepper = connect( (state) => ({"stepIndex":
  state.stepStore}) )(HorizontalLinearStepper_)

//-------------------------------------------------------------------

function stepStore(state = 0, action) {
  if (action.type === "INCREASE_STEP") {
    return state + 1
  }
  if (action.type === "DECREASE_STEP") {
    return state - 1
  }
  if (action.type === "RESET_STEP") {
    return 0
  }
  return state
}

const StepStore = combineReducers({
  stepStore
})
const store = createStore(StepStore)

render(
  <Provider store={store}>
    <Box />
  </Provider>
  ,
  document.getElementById("root")
)
