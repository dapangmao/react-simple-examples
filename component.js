import React, {PropTypes} from "react"
import { connect } from "react-redux"


let nextToDoId = 0 // global :shrug:

function TodoList({todos, dispatch}) {
  return (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => dispatch({"type": "TOGGLE_TODO", "id": todo.id})}
      />
    )}
  </ul>
)}

TodoList.propTypes = {todos: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired}


//------------------------------------------------------------------------------

function Todo({ onClick, completed, text }) {
  return (
    <li onClick={onClick}
      style={{textDecoration: completed ? "line-through" : "none"}}
    >
      {text}
    </li>
  )
}
//------------------------------------------------------------------------------
// acitve is defined by the connector
// children and dispatch defined by global
// filter is defined by footer
function Link({ active, children, dispatch, filter}) {
  if (active)
    return <span>{children}</span>
  return (
    <a href="#"
       onClick={e => {
         e.preventDefault()
         dispatch({"type": "SET_VISIBILITY_FILTER", "filter": filter })
       }}
    >
      {children}
    </a>
  )
}

function mapStateToFilterLinkProps(state, props) {
  return {
    active: props.filter === state.visibilityFilter
  }
}

const FilterLink = connect(
  mapStateToFilterLinkProps
)(Link)

function Footer() {
  return (
    <p>
      Show:
      {" "}
      <FilterLink
        filter="SHOW_ALL">All</FilterLink>
      {" "}
      <FilterLink
        filter="SHOW_ACTIVE">Active</FilterLink>
      {" "}
      <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
    </p>
  )
}

//------------------------------------------------------------------------------

function AddTodo({ dispatch }) {
  let input
  return (
    <div>
      <input ref={node => {
        // This is a newer 0.14 syntax where ref can be a callback.
        // n.b. no `this` available in a functional/stateless component.
        // Here, we"re making a closure over `input`, defined above.
        input = node
      }} />
      <button onClick={() => {
        dispatch({"type": "ADD_TODO", "id": nextToDoId++, "text": input.value})
        input.value = ""
      }}>
        Add todo
      </button>
    </div>
  )
}

function mapStateToTodoListProps(state) {
  // console.log(`mapStateToTodoListProps(): state.todos = ${state.todos}`)
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


const VisibleTodoList = connect(
    mapStateToTodoListProps
  )(TodoList)

const AddTodo2 = connect()(AddTodo)

function TodoApp() {
  return (
    <div>
      <AddTodo2 />
      <VisibleTodoList />
      <Footer />
    </div>
  )
}

export default TodoApp
//------------------------------------------------------------------------------
