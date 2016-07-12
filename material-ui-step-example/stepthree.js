import React from 'react'
import { connect } from "react-redux"
import {Card,  CardTitle, CardText} from 'material-ui/Card'

function errorField( {data} ){
    return (
        <Card>
          <CardTitle>Result</CardTitle>
          <CardText style={{fontSize: "11px"}}> {data} </CardText>
        </Card>
    )
}

const ErrorField = connect( (state) => ({data: state.spResultReducer}) )(errorField)

export default ErrorField
