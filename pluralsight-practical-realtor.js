import React, { Component } from 'react'
import logo from './GloboLogo.png'
import './App.css'
import emailIcon from './Email.png'


export default class App extends Component {
    state = {}

    componentWillMount() {
        fetch('/houses.json')
            .then(rsp => rsp.json())
            .then(allHouses => {
                this.allHouses = allHouses
                this.determineFeaturedHouse()
                this.determineUniqueCountries()
            })
    }

    determineFeaturedHouse = () => {
        if (this.allHouses) {
            const randomIndex = Math.floor(Math.random() * this.allHouses.length)
            const featuredHouse = this.allHouses[randomIndex]
            this.setState({ featuredHouse })
        }
    }

    determineUniqueCountries = () => {
        const countries = this.allHouses
            ? Array.from(new Set(this.allHouses.map(h => h.country)))
            : []
        countries.unshift(null)
        this.setState({ countries })
    }

    filterHouses = (country) => {
        this.setState({ activeHouse: null })
        const filteredHouses = this.allHouses.filter((h) => h.country === country)
        this.setState({ filteredHouses })
        this.setState({ country })
    }

    setActiveHouse = (house) => {
        this.setState({ activeHouse: house })
    }

    render() {
        let activeComponent = null
        if (this.state.country) activeComponent = <SearchResults country={this.state.country}
                     filteredHouses={this.state.filteredHouses} setActiveHouse={this.setActiveHouse} />
        if (this.state.activeHouse) activeComponent = <House house={this.state.activeHouse} />

        if (!activeComponent)
            activeComponent = <FeaturedHouse house={this.state.featuredHouse} />

        return (
            <div className="container">
                <Header />
                <HouseFilter countries={this.state.countries} filterHouses={this.filterHouses} />
                {activeComponent}
            </div>
        )
    }
}


const SearchResults = (props) => {
    const houseRows = props.filteredHouses.map(h =>
        <SearchResultsRow key={h.id.toString()} house={h} setActiveHouse={props.setActiveHouse} />)
    return (
        <div className="mt-2" >
            <h4>Results for {props.country}:</h4>
            <table className="table table-hover">
                <tbody>
                {houseRows}
                </tbody>
            </table>
        </div>
    )
}


class House extends Component {
    state = { inquiryShown: false }

    inquiryToggle = () => {
        this.setState({ inquiryShown: !this.state.inquiryShown })
    }

    render() {
        const house = this.props.house
        const inquiry = this.state.inquiryShown ? <Inquiry house={house} /> : null
        return (
            <div>
                <div className="row mt-2">
                    <h5 className="col-md-12">{house.country}</h5>
                </div>
                <div className="row">
                    <h3 className="col-md-12">{house.address}</h3>
                </div>
                <div className="row">
                    <div className="col-md-7">
                        <img src={`https://images.pexels.com/photos/${house.photo}/pexels-photo-${house.photo}.jpeg?w=600&h=400&auto=compress&cs=tinysrgb`} alt="House" />
                    </div>
                    <div className="col-md-5">
                        <p className="price">${house.price}</p>
                        <p>{house.description}</p>
                        <img src={emailIcon} height="50" alt="inquiry" onClick={this.inquiryToggle} />
                        {inquiry}
                    </div>
                </div>
            </div>
        )
    }
}


const SearchResultsRow = (props) => {
    const setActive = (e) => {
        e.preventDefault() // must have
        props.setActiveHouse(props.house)
    }

    return <tr onClick={setActive}>
        <td>{props.house.address}</td>
        <td>{props.house.price}</td>
        <td>{props.house.likes}</td>
    </tr>
}



const FeaturedHouse = (props) => {
    if (props.house) return (
        <div>
            <div className="row featuredHouse">
                <h3 className="col-md-12 text-center">Featured house</h3>
            </div>
            <House house={props.house} />
        </div>)
    return <div>No featured house at this time</div>
}



const HouseFilter = (props) => {
    const countries = props.countries || [] // must have?

    return (
        <div className="form-group row mt-3">
            <div className="offset-md-2 col-md-4">
                Look for your dream house in country:
            </div>
            <div className="col-md-4">
                <select className="form-control"  onChange={(e) => {
                    const country = e.target.value
                    props.filterHouses(country)
                }}>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>
    )
}


const Header = () => (
    <header className="row">
        <div className="col-md-5">
            <img src={logo} className="logo" alt="logo" />
        </div>
        <div className="col-md-7 mt-5 subtitle">
            Providing houses world wide
        </div>
    </header>
)


class Inquiry extends Component {
    state = {
        name: "",
        email: "",
        remarks: ""
    }

    onNameChange = (e) => {
        e.preventDefault()
        this.setState({ name: e.target.value })
    }

    onEmailChange = (e) => {
        e.preventDefault()
        this.setState({ email: e.target.value })
    }

    onRemarksChange = (e) => {
        e.preventDefault()
        this.setState({ remarks: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault()
        // const house = this.props.house
        // const contactInfo = this.state
        //send
    }
    render() {
        return (
            <form className="mt-2">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        id="name"
                        value={this.state.name}
                        onChange={this.onNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="text"
                        id="email"
                        className="form-control"
                        placeholder="Email"
                        value={this.state.password}
                        onChange={this.onEmailChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="remarks">Remarks</label>
                    <input
                        type="text"
                        id="remarks"
                        className="form-control"
                        placeholder="Remarks"
                        value={this.state.remarks}
                        onChange={this.onRemarksChange}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    disabled={this.state.name.length === 0 || this.state.email.length === 0}
                    onClick={this.onSubmit}
                >
                    Submit
                </button>
            </form>
        )
    }
}
