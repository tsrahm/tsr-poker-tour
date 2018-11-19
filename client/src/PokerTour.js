import React, { Component } from 'react';
import axios from 'axios';
import toUpper from 'lodash/toUpper';
import './PokerTour.css';
import usaFlag from './files/usa.png';
import norwayFlag from './files/norway.png';
import swedenFlag from './files/sweden.png';
import worldFlag from './files/world.png';

class PokerTour extends Component {
  constructor(props) {
    super(props);
    this.getPlayers = this.getPlayers.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.updatePlayer = this.updatePlayer.bind(this);
    this.renderPlayers = this.renderPlayers.bind(this);
    this.renderAddPlayer = this.renderAddPlayer.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleAddChange = this.handleAddChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      data: [],
      update: {},
      add: {
        firstName: '',
        lastName: '',
        winnings: '',
        country: ''
      },
      idToUpdate: null,
      action: ''
    }
  }

  componentDidMount() {
   this.getPlayers();
  }

  getPlayers() {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => {
        const sortedData = res.data.sort((a, b) => {
          return b.winnings - a.winnings;
        });
        this.setState({ data: sortedData });
      });
  }

  addPlayer() {
    axios.post("/api/addData", this.state.add)
    .then(() => {
      this.getPlayers();
      this.setState({
        add: {
          firstName: '',
          lastName: '',
          winnings: '',
          country: ''
        },
        action: ''
      });
    })
    .catch(err => console.log('error', err.response));
  }

  updatePlayer() {
    axios.put("/api/updateData", {
      id: this.state.idToUpdate,
      update: this.state.update
    })
    .then(() => {
      const sortedData = this.state.data.sort((a, b) => {
        return b.winnings - a.winnings;
      });
      this.setState({ data: sortedData, update: {}, idToUpdate: null, action: '' });
    });
  }

  renderPlayers() {
    const staticRow = (player, index) => {
      let flag, altText;
      switch (player.country) {
        case 'NOR':
          flag = norwayFlag;
          altText = 'Norwegian Flag'
          break;
        case 'SWE':
          flag = swedenFlag;
          altText = 'Swedish Flag'
          break;
        case 'USA':
          flag = usaFlag;
          altText = 'American Flag'
          break;
        default:
          flag = worldFlag;
          altText = 'World Flag'
      }

      return (
        <div className="player-row" onClick={() => this.setState({ idToUpdate: player._id, action: 'editing' })} key={player._id}>
          <span>{++index}.</span>
          <div>
            &nbsp;
            <span>{player.firstName}</span>
            &nbsp;
            <span>{player.lastName}</span>
          </div>
          <div>${player.winnings}M</div>
          <div><img alt={altText} src={flag} />&nbsp;{player.country}</div>
        </div>
      );
    };

    const dynamicRow = (player, index) => {
      return (
        <div className="player-row" key={player._id}>
          <span>{++index}.</span>
          <div>
            <input id={player._id} type="text" name="firstName" value={player.firstName} onChange={this.handleEditChange} />
            <input id={player._id} type="text" name="lastName" value={player.lastName} onChange={this.handleEditChange} />
          </div>
          <input autoFocus id={player._id} type="text" name="winnings" value={player.winnings} onChange={this.handleEditChange} />
          <input id={player._id} type="text" name="country" value={player.country} onChange={this.handleEditChange} />
        </div>
      );
    };

    if (!this.state.idToUpdate) {
      return (
        this.state.data.map((player, index) => staticRow(player, index))
      );
    }

    return (
      this.state.data.map((player, index) => {
        if (player._id === this.state.idToUpdate) {
          return dynamicRow(player, index);
        }

        return staticRow(player, index);
      })
    );
  }

  renderButtons() {
    const { action } = this.state;

    if (action === 'adding' || action === 'editing') {
      return (
        <React.Fragment>
          <button onClick={action === 'adding' ? this.addPlayer : this.updatePlayer}>Submit</button>
          <button onClick={this.handleCancel}>Cancel</button>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <button onClick={() => this.setState({ action: 'adding'})}>Add Player</button>
        <span className="edit-message">Click player to edit</span>
      </React.Fragment>
    );
  }

  renderAddPlayer() {
    if (this.state.action === 'adding') {
      const { add } = this.state;

      return (
        <div className="add-player-row">
          <h2>Add New Player</h2>
          <input autoFocus type="text" name="firstName" value={add.firstName} placeholder="First Name" required onChange={this.handleAddChange} />
          <input type="text" name="lastName" value={add.lastName} placeholder="Last Name" required onChange={this.handleAddChange} />
          <input type="text" name="winnings" value={add.winnings} placeholder="Winnings" required onChange={this.handleAddChange} />
          <input type="text" name="country" value={add.country} placeholder="Country" required onChange={this.handleAddChange} />
        </div>
      );
    }
  }

  handleAddChange(e) {
    let { value } = e.target;

    if (e.target.name === 'country') {
      value = toUpper(value);
    }

    const add = Object.assign(this.state.add, {
      [e.target.name]: value
    });

    this.setState({ add });
  }

  handleEditChange(e) {
    let { data } = this.state;
    const index = data.findIndex((player) => {
      return player._id == e.target.id;
    });
    data[index][e.target.name] = e.target.value;
    const update = Object.assign(this.state.update, {
      [e.target.name]: e.target.value
    });

    this.setState({ data, update });
  }

  handleCancel() {
    switch (this.state.action) {
      case 'editing':
        this.getPlayers();
        this.setState({ update: {}, idToUpdate: null, action: '' });
        break;
      case 'adding':
        this.setState({
          add: {
            firstName: '',
            lastName: '',
            winnings: '',
            country: ''
          },
          action: ''
        });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div>
        <header>
          <h1>TSR Poker Tour</h1>
        </header>
        <div className="poker-grid">
          <div className="heading-row">
            <span className="player-heading">Player</span>
            <span>Winnings</span>
            <span>Native Of</span>
          </div>
          {this.renderPlayers()}
          <div className="button-row">{this.renderButtons()}</div>
          {this.renderAddPlayer()}
        </div>
      </div>
    );
  }
}

export default PokerTour;
