import { Server } from 'http';
import WebSocket = require("ws");


export class Gateway {
    wss: WebSocket.Server;

    constructor(server: Server) {
        this.wss = new WebSocket.Server( {server: server} );
    }

    handleConnection(ws: WebSocket) {
        
    }
}