import io from 'socket.io-client'
import { ChatMessage } from './types';
import { fromEvent, Observable } from 'rxjs';

export class SocketService {
	private socket: any = {} as SocketIOClient.Socket;
	
	public init (): SocketService {
		this.socket = io('localhost:8080');
		return this;
	}
	
	public send (message: ChatMessage): void {
		this.socket.emit('message', message);
	}
	
	public onMessage (): Observable<ChatMessage> {
		return fromEvent(this.socket, 'message');
	}
	
	public disconnect (): void {
		this.socket.disconnect();
	}
}