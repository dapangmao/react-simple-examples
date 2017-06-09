import React, {Component} from "react";
import "./App.css";
import axios from "axios";


const Card = (props) => {
    return (
        <div style={{margin: '3em'}}>
            <img width="75" src={props.avatar_url} alt="Sorry"/>
            <div style={{display: 'inline-block', marginLeft: 10}}>
                <div style={{fontSize: '1.25em', fontWeight: 'bold'}}>
                    {props.name}
                </div>
                <div>{props.company} </div>
            </div>
        </div>
    )
};

const CardList = (props) => {
    return (
        <div>
            {props.data.map(
                x => <Card {...x} key={x.id}/>
            )}
        </div>
    )
};


class Form extends Component {

    state = {username: ''}

    handleSubmit = (event) => {
        event.preventDefault();
        axios.get(`https://api.github.com/users/${this.state.username}`)
            .then(
                resp => {
                    this.props.onSubmit(resp.data);
                }
            )
    };

    render(){
        return (
            <form onSubmit={this.handleSubmit} style={{margin: '2em'}}>
                <input type="text"
                       placeholder="Githubname"
                       onChange={
                           e => this.setState({username: e.target.value})
                       }
                       required
                />
                <button type="submit">Add card</button>
            </form>
        )
    }
}


class App extends Component {

    state = {
        cards: []
    };

    addNewCard = (x) => {
        console.log(x);
        this.setState(
            prevState => (
                {cards: prevState.cards.concat(x)}
            )
        )
    } ;

    render() {
        return (
            <div>
                <Form onSubmit={this.addNewCard}/>
                <CardList data={this.state.cards}/>
            </div>

        );
    }
}

export default App;
