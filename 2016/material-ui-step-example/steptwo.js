import React  from 'react'
import { connect } from "react-redux"
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import TimePicker from 'material-ui/TimePicker'
import DatePicker from 'material-ui/DatePicker'
import request from "superagent"


function simpleForm( {data,isSubmit,dispatch} ) {
    const handleTicketChange = (event) => {
        dispatch({
            type: "SIMPLE_FORM_DISPATCHER",
            filter: "ticket",
            text: event.target.value
        })
    }
    const handleCommentsChange = (event) => {
        dispatch({
            type: "SIMPLE_FORM_DISPATCHER",
            filter: "comments",
            text: event.target.value
        })
    }
    const handleTimeChange = (event, date) => {
        dispatch({
            type: "SIMPLE_FORM_DISPATCHER",
            filter: "time",
            text: date
        })
    }
    const handleDateChange = (event, date) => {
        dispatch({
            type: "SIMPLE_FORM_DISPATCHER",
            filter: "date",
            text: date
        })
    }

    const postToApi = () => {
        request
            .post("/params")
            .send({
                    utctime: merged,
                    ticket: data.ticket,
                    comments: data.comments
                })
            .set('Content-Type', 'application/json')
            .end( function(err, res) {
                    if (res) {
                        dispatch({type: "SP_RESULT_DISPATCHER", text: res.text.slice(-1000)})
                        console.log(res.text)
                    }
                    if (err) {
                        console.error(err)
                    }
                }
             )
    }

    let handleUTCdisplay = "", merged = ""
    if (data.date != null && data.time != null) {
        const year = data.date.getFullYear(),
            month = data.date.getMonth(),
            date = data.date.getDate()
        const hour = data.time.getHours(),
            minute = data.time.getMinutes()
        merged = new Date(year, month, date, hour, minute)
        handleUTCdisplay = merged.toUTCString()
    }

    return (
        <div>
            <TextField hint="Input ticket number" floatingLabelText="Ticket"
              onChange={handleTicketChange}
              value={data.ticket}
            />
            <DatePicker hintText="Effective time: local date" mode="landscape"
              onChange={handleDateChange}
              value={data.date}
            />
            <TimePicker hintText="Effective time: local hour/minute"
              onChange={handleTimeChange}
              value={data.time}
            />
            <TextField
              disabled={true}
              hintText="Effective UTC"
              floatingLabelText="Effective UTC you choose will be on"
              value={handleUTCdisplay}
            />
            <br/>
            <TextField hint="Input comments" floatingLabelText="Comments"
              onChange={handleCommentsChange}
              value={data.comments}
            />
            <br/>
              <RaisedButton label="Submit" primary={true}
                disabled={isSubmit}
                onClick={() => {
                    postToApi({data})
                }}
            />
        </div>
    )
}

const checkSubmit = (data) => {
    if (data.ticket === "" || data.comments === "" || data.time === null || data.date === null) {
        return true
    }
    return false
}

const SimpleForm = connect((state) => ({
    data: state.simpleFormStore,
    isSubmit: checkSubmit(state.simpleFormStore)
}))(simpleForm)
export default SimpleForm
