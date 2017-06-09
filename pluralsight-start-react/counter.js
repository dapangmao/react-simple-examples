import React, {Component} from 'react'


const Button = (props) => {

    return (
        <button onClick={() => props.onClickFunction(props.incrementValue)}>
            +{props.incrementValue}
        </button>
    )
};


const Result = (props) => {
    return (
        <div> {props.counter} </div>
    )
};

class App extends Component {
    state = {counter: 0};

    incrementCounter = (x) => {
        this.setState(
            (prevState) => (
                {counter: prevState.counter + x}
            )
        )
    };

    render() {
        return (
            <div>
                <Button onClickFunction={this.incrementCounter}
                        incrementValue={1}
                />
                <Button onClickFunction={this.incrementCounter}
                        incrementValue={5}
                />
                <Button onClickFunction={this.incrementCounter}
                        incrementValue={10}
                />
                <Result counter={this.state.counter}/>
            </div>
        )
    }
}

export default App;
