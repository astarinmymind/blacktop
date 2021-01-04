import socketIOClient from "socket.io-client";

const ENDPOINT = "http://172.17.18.238:5000";
const sock = socketIOClient(ENDPOINT); 

class GameService {
	socket;
	constructor() {
	    this.socket = sock;
	}
}

export default GameService;