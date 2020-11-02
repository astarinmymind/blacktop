import React from 'react';
import './home.css';
import TestLogo from '../images/TestLogo.png';
import ChalkLine from '../images/ChalkLine.png';

class Home extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
      }
    }

    render() {
        return (
            <div className="home">
                <div className="manifest">
                    <img src={TestLogo}/>
                </div>
                <div className="line">
                    <img src={ChalkLine}></img>
                </div>
                <button>Host game</button>
                <button>Join game</button>
            </div>
        )
    }
}

export default Home