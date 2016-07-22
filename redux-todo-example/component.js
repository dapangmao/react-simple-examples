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
        {todos.map(x =>
            <ListItem key={x.id} onClick={() => dispatch({"type": "TOGGLE_TODO", "id": x.id})}
              style={{textDecoration: x.completed ? "line-through" : "none"}}
              primaryText={x.text}
              />
        )}
      </List>
)}

TodoList.propTypes = {todos: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired}

function mapStateToTodoListProps(state) {
  let filter = state.visibilityFilter
  let todos = state.todos
  switch (filter) {
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
function Link({ currentFilter, dispatch, filter }) {
  let str = filter.split("_")[1]
  if (currentFilter === filter)
    return <span>{str}</span>
  return (
    <a href="#"
       onClick={e => {
         e.preventDefault()
         dispatch({ "type": "SET_VISIBILITY_FILTER", "filter": filter })
       }}
    >
      {str}
    </a>
  )
}

const FilterLink = connect( (state) => ({currentFilter: state.visibilityFilter}) )(Link)

function Footer() {
  return (
    <p>
      <b>Show:</b>
      {" "}
      <FilterLink filter="SHOW_ALL"/>
      {" "}
      <FilterLink filter="SHOW_ACTIVE"/>
      {" "}
      <FilterLink filter="SHOW_COMPLETED"/>
    </p>
  )
}

function addTodo({ dispatch, currentText }) {
  let x
  return (
    <div>
      <TextField ref={node => {x = node}}
        floatingLabelText="Please enter text here"
        value = {currentText}
        onChange={() => {
            dispatch({"type": "CURRENT_ADD_TODO", "text": x.getValue()})
        }}
      />
      <FlatButton onClick={() => {
        dispatch({"type": "ADD_TODO", "id": nextToDoId++, "text": x.getValue()})
        dispatch({"type": "CURRENT_ADD_TODO", "text": ""})
      }}
        label = 'Add todo'
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
