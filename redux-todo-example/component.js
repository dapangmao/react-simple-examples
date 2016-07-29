import React, {PropTypes} from "react"
import { connect } from "react-redux"
import AppBar from 'material-ui/AppBar';
import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import {Card, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField';

let nextToDoId = 0 // global :shrug:

function TodoList({ todos, dispatch }) {
  return (
  <List>
    {todos.map( x =>
      <ListItem key={x.id} onClick={() => dispatch({"type": "TOGGLE_TODO", "id": x.id})}
        style={{"textDecoration": x.completed ? "line-through" : "none"}}
        primaryText={x.text}
        />
    )}
  </List>
)}

TodoList.propTypes = {todos: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired}

function mapStateToTodoListProps(state) {
  const {visibilityFilter, todos} = state
  switch (visibilityFilter) {
    case "SHOW_ALL":
      return {"todos": todos}
    case "SHOW_COMPLETED":
      return {"todos": todos.filter(t => t.completed)}
    case "SHOW_ACTIVE":
      return {"todos": todos.filter(t => !t.completed)}
  }
}

const VisibleTodoList = connect(mapStateToTodoListProps)(TodoList)

//------------------------------------------------------------------------------
// acitve is defined by the connector
// children and dispatch defined by global
// filter is defined by footer
function Link({ currentFilter, filter, dispatch }) {
  const str = filter.split("_")[1]
  if (currentFilter === filter)
    return <span>{str}{"  "}</span>
  return (
    <a href="#"
       onClick={e => {
         e.preventDefault()
         dispatch({ "type": "SET_VISIBILITY_FILTER", "filter": filter })
       }}
    >
      {str}{"  "}
    </a>
  )
}

const FilterLink = connect( (state) => ({currentFilter: state.visibilityFilter}) )(Link)

function Footer() {
  const filters = ["SHOW_ALL", "SHOW_ACTIVE", "SHOW_COMPLETED"]
  return (
    <p>
      <b>Show:</b>
      {filters.map( (x, i) =>
        <FilterLink key={i} filter={x}/>
      )}
    </p>
  )
}

//------------------------------------------------------------------------------
function addTodo({ dispatch, currentText }) {
  const handleTextfieldChange = (event) => {
    dispatch({
      type: "CURRENT_ADD_TODO",
      value: event.target.value
    })
  }
  const handleSubmitButtonClick = () => {
    dispatch({
      type: "ADD_TODO",
      id: nextToDoId++,
      text: currentText
    })
    dispatch({
      type: "CURRENT_ADD_TODO",
      value: ""
    })
  }
  return (
    <div>
      <TextField
        floatingLabelText="Please enter text here"
        value={currentText}
        onChange={handleTextfieldChange}
      />
      <FlatButton onClick={handleSubmitButtonClick}
        label='Add todo'
      />
    </div>
  )
}
const AddTodo = connect( (state) => ({currentText: state.currentAddTodoStore}) )(addTodo)
//------------------------------------------------------------------------------
const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})


export default function TodoApp() {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
    <Card>
      <AppBar
        title="Todo App Demo"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <CardText>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
      </CardText>
    </Card>
    </MuiThemeProvider>
  )
}
