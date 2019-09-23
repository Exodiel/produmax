import express, {Application} from "express";
import { Server, createServer } from "http";
import WebSocket from 'ws';
import morgan from 'morgan';
import path from 'path';
import cors from "cors";
import helmet from "helmet";

// import { Gateway } from './gateway';
import indexRoutes from './routes/indexRoutes';

export class App {
    private app: Application;
    private server: Server;
    private wss: WebSocket.Server;
    private readonly port: number | string;

    constructor(port?: number | string){
        this.app = express();
        this.port = port || 4000;
        this.settings();
        this.middlewares();
        this.routes();
        this.server = createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
    }

    private settings(): void {
        this.app.set('port', process.env.PORT || this.port);
    }
    

    private middlewares(): void{
        this.app.use(morgan('dev'));
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
    }

    private routes(): void{
        this.app.use('/api', indexRoutes);
        
        //folder for store public files
        this.app.use('/uploads', express.static(path.resolve('uploads')));
    }

    async listen(): Promise<void>{
        await this.server.listen(this.app.get('port'));
        
        this.wss.on('connection', (ws: WebSocket) => {
            
            ws.on('message', (message: string) => {
                console.log('received: %s', message);
                ws.send(`Hello, you sent -> ${message}`);
            });

            ws.on('product_created', (data: any) => {
                ws.send(data);
            });
            
            ws.send('Hola, soy un servidor de websockets');
        });
        console.log('> Server on port ', this.app.get('port'));
    }
}