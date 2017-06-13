import React, {Component} from "react";
import "./App.css";
import injectTapEventPlugin from "react-tap-event-plugin";
import {getMuiTheme, MuiThemeProvider} from "material-ui/styles";
import {deepOrange500} from "material-ui/styles/colors";
import {Dialog, FlatButton, RaisedButton} from "material-ui";

injectTapEventPlugin();


class App extends Component {

    state = {open: false};

    handleRequestClose = () => {
        this.setState({
            open: false
        })
    };

    handleTouchTap = () => {
        this.setState({
            open: true
        })
    };

    // child component
    standardActions = () => (
        <FlatButton label="Ok" primary={true} onTouchTap={this.handleRequestClose}/>
    );

    render() {
        return (
            <MuiThemeProvider muiTheme={
                getMuiTheme({
                    palette: {
                        accent1Color: deepOrange500
                    }
                })
            }>
                <div className="password-box">
                    <h1>Material-UI</h1>
                    <h2>example project</h2>
                    <RaisedButton label="Super Secret Password" secondary={true} onTouchTap={this.handleTouchTap}/>

                    <Dialog open={this.state.open} title="Super Secret Password" actions={this.standardActions()}
                            onRequestClose={this.handleRequestClose}>1-2-3-4-5</Dialog>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
