import React, {PropTypes} from "react"
import { connect } from "react-redux"
import AppBar from 'material-ui/AppBar';
import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import {Card, CardText} from 'material-ui/Card'

let nextToDoId = 0 // global :shrug:


// const CardExampleWithAvatar = () => (
//   <Card>
//     <CardHeader
//       title="URL Avatar"
//       subtitle="Subtitle"
//       avatar="http://lorempixel.com/100/100/nature/"
//     />
//     <CardMedia
//       overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
//     >
//       <img src="http://lorempixel.com/600/337/nature/" />
//     </CardMedia>
//     <CardTitle title="Card title" subtitle="Card subtitle" />
//     <CardText>
//       Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//       Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
//       Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
//       Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
//     </CardText>
//
//   </Card>
// );


//------------------------------------------------------------------------------
function Todo({id, completed, text, dispatch}) {
  return (
    <ListItem onClick={() => dispatch({"type": "TOGGLE_TODO", "id": id})}
      style={{textDecoration: completed ? "line-through" : "none"}}

      primaryText={text}
      />
  )
}

const Todo2 = connect()(Todo)
//------------------------------------------------------------------------------

function TodoList({ todos }) {
  return (
  <List>
    {todos.map(todo =>
      <Todo2
        key={todo.id}
        {...todo}
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

//------------------------------------------------------------------------------
// This is a newer 0.14 syntax where ref can be a callback.
// n.b. no `this` available in a functional/stateless component.
// Here, we"re making a closure over `input`, defined above.
function AddTodo({ dispatch }) {
  let input
  return (
    <div>
      <input ref={node => {input = node}} />
      <FlatButton onClick={() => {
        dispatch({"type": "ADD_TODO", "id": nextToDoId++, "text": input.value})
        input.value = ""
      }}
        label = 'Add todo'
      />
    </div>
  )
}
const AddTodo2 = connect()(AddTodo)
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
        title="Title"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <CardText>
      <AddTodo2 />
      <VisibleTodoList />

      <Footer />
      </CardText>

    </Card>

    </MuiThemeProvider>

  )
}
