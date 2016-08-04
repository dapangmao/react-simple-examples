import React, {Component, PropTypes} from "react"
import { connect } from "react-redux"
import AppBar from 'material-ui/AppBar';
import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import {Card, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import Parse from "parse"


Parse.initialize("myAppId");
Parse.serverURL = 'https://www.jhuangs.com/parse'
const todocloud = Parse.Object.extend("todo")

function TodoList({ todos, dispatch }) {
    return (
        <List>
            {todos.map( x =>
              <ListItem key={x.id} onClick={() => {
                  dispatch({"type": "TOGGLE_TODO", "id": x.id})
                  const query = new Parse.Query(todocloud)
                  query.equalTo("reduxid", x.id).first().then(obj => {
                      let prevComplete = obj.get('complete')
                      obj.set('complete', !prevComplete)
                      obj.save()
                  })
                }
              }
                style={{"textDecoration": x.completed ? "line-through" : "none"}}
                primaryText={x.text}
                />
            )}
        </List>
    )
}

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
        )
      }
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
    let _id = new Date().getTime().toString()
    dispatch({
      type: "ADD_TODO",
      id: _id,
      text: currentText,
      complete: false
    })
    dispatch({
      type: "CURRENT_ADD_TODO",
      value: ""
    })
    let payload = new todocloud()
    payload.save({
      reduxid: _id,
      text: currentText,
      complete: false
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

//https://github.com/reactjs/redux/issues/916
 class Todo_ extends Component{
    constructor(props) {
      super(props);
      this.muiTheme = getMuiTheme({
        palette: { accent1Color: deepOrange500}
      })
    }

    loadTodo(dispatch) {
        const query = new Parse.Query(todocloud)
        query.find({
            success: function(results) {
                results.forEach(x =>
                    dispatch({
                        type: "ADD_TODO",
                        id: x.get("reduxid"),
                        text: x.get('text'),
                        complete: x.get('complete')
                    })
                )
            }
        })
    }

    componentDidMount() {
        this.loadTodo(this.props.dispatch)
     }

    render() {
        return (
        <MuiThemeProvider muiTheme={this.muiTheme}>
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
}


const Todo = connect()(Todo_)


 class TodoApp extends Component{

     componentWillMount() {
         Parse.User.logIn("pig", "pig")
     }
     render () {
         if (!Parse.User.current())
             return (<div>sorry</div>)
         return (
             <div>
                 <Todo/>
             </div>
         )
     }
}


export default TodoApp
