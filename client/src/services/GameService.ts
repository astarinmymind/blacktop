import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";
const sock = socketIOClient("http://salty-headland-36058.herokuapp.com/"); 

class GameService {
	socket;
	constructor() {
	    this.socket = sock;
	}
}

export default GameService;