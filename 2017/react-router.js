import React, { Component } from 'react'
import {Switch, Route, Link} from "react-router-dom"


const PlayerAPI = {
    players: [
        { number: 1, name: "Ben Blocker", position: "G" },
        { number: 2, name: "Dave Defender", position: "D" },
        { number: 3, name: "Sam Sweeper", position: "D" },
        { number: 4, name: "Matt Midfielder", position: "M" },
        { number: 5, name: "William Winger", position: "M" },
        { number: 6, name: "Fillipe Forward", position: "F" }
    ],
    all: function() { return this.players},
    get: function(id) {
        const isPlayer = p => p.number === id
        return this.players.find(isPlayer)
    }
};


const FullRoster = () => (
    <div>
        <ul>
            {
                PlayerAPI.all().map(p => (
                    <li key={p.number}>
                        <Link to={`/roster/${p.number}`}>{p.name}</Link>
                    </li>
                ))
            }
        </ul>
    </div>
);


function Player(props) {
    const player = PlayerAPI.get(
        parseInt(props.match.params.number, 10)
    );

    if (!player) {
        return <div>Sorry, but the player was not found</div>
    }
    return (
        <div>
            <h1>{player.name} (#{player.number})</h1>
            <h2>Position: {player.position}</h2>
            <Link to='/roster'>Back</Link>
        </div>
    )
}


const Roster = () => (
    <Switch>
        <Route exact path='/roster' component={FullRoster}/>
        <Route path='/roster/:number' component={Player}/>
    </Switch>
);

const Schedule = () => (
    <div>
        <ul>
            <li>6/5 @ Evergreens</li>
            <li>6/8 vs Kickers</li>
            <li>6/14 @ United</li>
        </ul>
    </div>
);


const Home = () => (
    <div>
        <h1>Welcome to the Tornadoes Website!</h1>
    </div>
);


const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/roster' component={Roster}/>
            <Route path='/schedule' component={Schedule}/>
        </Switch>
    </main>
);

// The Header creates links that can be used to navigate
// between routes.
const Navigation = () => (
    <header>
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/roster'>Roster</Link></li>
                <li><Link to='/schedule'>Schedule</Link></li>
            </ul>
        </nav>
    </header>
)



class App extends Component {
  render() {
    return (
        <div>
            <Navigation/>
            <Main/>
        </div>
    )
  }
}

export default App;
