import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";
const sock = socketIOClient(ENDPOINT); 

export default class GameService {
	socket;
	constructor() {
	    this.socket = sock;
	}
}