import express, {Application} from "express";
import { Server, createServer } from "http";
import socketIO from 'socket.io';
import morgan from 'morgan';
import path from 'path';
import cors from "cors";
import helmet from "helmet";

import indexRoutes from './routes/indexRoutes';

export class App {
    private app: Application;
    private server: Server;
    private io: SocketIO.Server;
    private readonly port: number | string;

    constructor(port?: number | string){
        this.app = express();
        this.port = port || 4000;
        this.settings();
        this.middlewares();
        this.routes();
        this.server = createServer(this.app);
        this.io = socketIO(this.server);
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
        await this.app.listen(this.app.get('port'));
        
        this.io.on('connect', (socket: any) => {
            socket.emit('connection', (client: any) => {
                console.log('Connected client on port %s.', this.port);
            })
        });
        console.log('> Server on port ', this.app.get('port'));
    }
}