import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, withRouter } from 'react-router'
import Parse from 'parse'
// import withExampleBasename from '../withExampleBasename'

Parse.initialize("myAppId");
Parse.serverURL = 'https://www.jhuangs.com/parse'
// const todocloud = Parse.Object.extend("todo")


const App = React.createClass({
  getInitialState() {
    return {
      loggedIn: Parse.User.current()
    }
  },

  updateAuth(loggedIn) {
    this.setState({
      loggedIn
    })
  },

  // componentWillMount() {
  //   auth.onChange = this.updateAuth
  //   auth.login()
  // },

  render() {
    return (
      <div>
        <ul>
          <li>
            {this.state.loggedIn ? (
              <Link to="/logout">Log out</Link>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
          </li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/dashboard">Dashboard</Link> (authenticated)</li>
        </ul>
        {this.props.children || <p>You are {!this.state.loggedIn && 'not'} logged in.</p>}
      </div>
    )
  }
})

const Dashboard = React.createClass({
  render() {
    // const token = auth.getToken()

    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
      </div>
    )
  }
})

const Login = withRouter(
  React.createClass({

    getInitialState() {
      return {
        error: false
      }
    },

    handleSubmit(event) {
        event.preventDefault()

        const username = this.refs.username.value
        const pass = this.refs.pass.value

        Parse.User.logIn(username, pass, {
            success: function(user) {
                // const {
                //     location
                // } = this.props
                //
                // if (location.state && location.state.nextPathname) {
                //     this.props.router.replace(location.state.nextPathname)
                // } else {
                //     this.props.router.replace('/')
                // }
            },
            error: function(user, error) {
                this.setState({
                    error: true
                })
                console.log(error)
            }
         })
    },

    render() {
      return (
        <form >
          <label><input ref="username" placeholder="username" defaultValue="joe@example.com" /></label>
          <label><input ref="pass" placeholder="password" /></label> (hint: password1)<br />
          <Link to="/dashboard" onClick={this.handleSubmit}>Click to login</Link>
          {this.state.error && (
            <p>Bad login information</p>
          )}
        </form>
      )
    }
  })
)

const About = React.createClass({
  render() {
    return <h1>About</h1>
  }
})

const Logout = React.createClass({
  componentDidMount() {
    Parse.User.logOut()
  },

  render() {
    return <p>You are now logged out</p>
  }
})

function requireAuth(nextState, replace) {
  if (!Parse.User.current()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="about" component={About} />
      <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById('root'))
