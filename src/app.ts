import express, {Application} from "express";
import morgan from 'morgan';
import path from 'path';
import cors from "cors";
import helmet from "helmet";

import indexRoutes from './routes/indexRoutes';

export class App {
    private app: Application;
    private readonly port: number | string;

    constructor(port?: number | string){
        this.app = express();
        this.port = port || 4000;
        this.settings();
        this.middlewares();
        this.routes();
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

        console.log('> Server on port ', this.app.get('port'));
    }
}