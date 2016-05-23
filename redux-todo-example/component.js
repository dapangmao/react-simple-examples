import React, {PropTypes} from "react"
import { connect } from "react-redux"


let nextToDoId = 0 // global :shrug:
//------------------------------------------------------------------------------
function Todo({id, completed, text, dispatch}) {
  return (
    <li onClick={() => dispatch({"type": "TOGGLE_TODO", "id": id})}
      style={{textDecoration: completed ? "line-through" : "none"}}
    >
      {text}
    </li>
  )
}

const Todo2 = connect()(Todo)
//------------------------------------------------------------------------------

function TodoList({ todos }) {
  return (
  <ul>
    {todos.map(todo =>
      <Todo2
        key={todo.id}
        {...todo}
      />
    )}
  </ul>
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
      <button onClick={() => {
        dispatch({"type": "ADD_TODO", "id": nextToDoId++, "text": input.value})
        input.value = ""
      }}>
        Add todo
      </button>
    </div>
  )
}
const AddTodo2 = connect()(AddTodo)
//------------------------------------------------------------------------------

export default function TodoApp() {
  return (
    <div>
      <AddTodo2 />
      <VisibleTodoList />
      <Footer />
    </div>
  )
}
