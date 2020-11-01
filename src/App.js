import React, { Component } from 'react';
//import Game from './containers/game';
import Home from './containers/home';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { play: false };
    this.name = '';
    this.play = this.play.bind(this);
    this.setName = this.setName.bind(this);
  }

  play() {
    this.setState({ play: true });
  }

  setName(e) {
    this.name = e.target.value;
  }

  render() {
    return (
      <div>
        { this.state.play ?
          false :
          <Home play={this.play} setName={this.setName} />
        }
      </div>
    );
  }
}

export default App;
