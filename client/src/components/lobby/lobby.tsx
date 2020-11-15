import React from 'react';
import { Input } from 'semantic-ui-react'
import './lobby.css';
import TestLogo from './images/TestLogo.png';
import TestCard from './images/TestCard.png';
import ChalkLine from './images/ChalkLine.png';
import PlushCat from './images/PlushCat.gif';
import Werewolf from './images/Werewolf.gif';
import src from '*.avif';

interface IProps {
}

interface IState {
  name?: string;
  icon?: any;
}

class Lobby extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {name: '', icon: <img />};

        this.setName = this.setName.bind(this);
        this.setIcon = this.setIcon.bind(this);

        //this.setState({name: "Player", icon: <img src={TestCard}/>});
      }

      setName(event: any) {
        this.setState({name: event.target.value});
      }

      setIcon(newIcon: any) {
        this.setState({icon: newIcon});
      }

    render() {
        return (
            <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0}}>
                <div className="manifest">
                    <img src={TestLogo}/>
                </div>
                <img src={ChalkLine} />
                <div className="columns">
                    <div style={{textAlign: "right"}}>
                        <h1>Game Code: </h1>
                        <h1>Name: </h1>
                        <h1>Icon: </h1>
                    </div>
                    <div>
                        <h1>Random code here!</h1>
                        <input name="name" type="text" maxLength={12} placeholder="Type name here" value={this.state.name} onChange={this.setName}/>
                        <div className="icon-gallery">
                            <>
                                <img src={Werewolf} onClick={() => this.setIcon(Werewolf)}/>
                                <img src={PlushCat} onClick={() => this.setIcon(PlushCat)}/>
                                <img src={Werewolf} onClick={() => this.setIcon(Werewolf)}/>
                                <img src={PlushCat} onClick={() => this.setIcon(PlushCat)}/>
                            </>
                            <>
                                <img src={PlushCat} onClick={() => this.setIcon(PlushCat)}/>
                                <img src={PlushCat} onClick={() => this.setIcon(PlushCat)}/>
                                <img src={Werewolf} onClick={() => this.setIcon(Werewolf)}/>
                                <img src={Werewolf} onClick={() => this.setIcon(Werewolf)}/>
                            </>
                            <>
                                <img src={Werewolf} onClick={() => this.setIcon(Werewolf)}/>
                                <img src={PlushCat} onClick={() => this.setIcon(PlushCat)}/>
                                <img src={PlushCat} onClick={() => this.setIcon(PlushCat)}/>
                                <img src={Werewolf} onClick={() => this.setIcon(Werewolf)}/>
                            </>
                        </div>
                    </div>
                    <div>
                        <div>
                            <img src={this.state.icon}/>
                            {this.state.name}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Lobby;