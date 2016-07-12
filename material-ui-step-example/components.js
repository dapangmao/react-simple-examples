import React from "react"
import injectTapEventPlugin from 'react-tap-event-plugin'
import RaisedButton from 'material-ui/RaisedButton'
import {deepOrange500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import {Card,  CardHeader,  CardTitle, CardText} from 'material-ui/Card'
import {connect} from "react-redux"
import SimpleForm from "./steptwo"
import ErrorField from "./stepthree"
// import MyTable from "./datatables"
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
      title="Plan Updater"
      subtitle="Asurion"
      avatar="/static/favicon.png"
    />
    <CardTitle title="The web interface to update Min/Ideal prices" style={{textAlign: 'center', paddingTop: 10}}  />

    <CardText>
        <div style={{paddingTop: 10}}>
          <HorizontalLinearStepper/>
        </div>
    </CardText>
    </Card>
    </MuiThemeProvider>
  )
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return (
            <div>
                  Please select an Excel file and hit the submit button.
                  <br/><br/><br/>
                  <form action="/" method="post" encType="multipart/form-data">
                        <input type="file" name='file'/>
                        <input type="submit" label="upload" />
                  </form>
                  <br/><br/><br/>
            </div>
      )
    case 1:
        return (
            <SimpleForm/>
      );
    case 2:
        return (
            <ErrorField />
      );
    case 3:
        return (
            <form>
                <button formAction="/download/excel">Download the updated Excel</button>
            </form>
        );
    default:
          return 'Something wrong.'
  }
}

function horizontalLinearStepper({ stepIndex, dispatch }) {
   let finished = (stepIndex > 3)
    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Upload the Excel file</StepLabel>
          </Step>
          <Step>
            <StepLabel>Run the Python application</StepLabel>
          </Step>
          <Step>
            <StepLabel>Run the SQL Server stored procedure</StepLabel>
          </Step>
          <Step>
            <StepLabel>Generate a new Excel workbook </StepLabel>
          </Step>
        </Stepper>
        <div style={{margin: '0 16px'}}>
          {finished ? (
            <div>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  dispatch({ "type": "RESET_STEP" })
                  dispatch({ "type": "USER_LOGOUT" })
                }}
              >
                Click here
              </a> to reset the application.
            </div>
          ) : (
            <div>
              <div>{getStepContent(stepIndex)}</div>
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
                  label={stepIndex === 3 ? 'Finish' : 'Next'}
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

const HorizontalLinearStepper = connect( (state) => ({"stepIndex": state.stepStore}) )(horizontalLinearStepper)
export default Box
