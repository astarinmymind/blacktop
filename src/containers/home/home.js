import React from 'react';
import '../../styles/common.css';
import '../../styles/home.css';
import TestLogo from '../../images/TestLogo.png';
import ChalkLine from '../../images/chalk-line.png';

export default (props) => (
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
);