import { Router, Request, Response } from "express";

import unitRoutes from "./unitRoutes";
import categoryRoutes from "./categoryRoutes";
import productRoutes from './productRoutes';
import userRoutes from "./userRoutes";
import rolRoutes from "./rolRoutes";
import orderRoutes from "./orderRoutes";
import authRoutes from "./authRoutes";

/**
 * @author Jipson Saad
 * 
 * @class clase para la integración de las rutas o endpoints de la aplicación de servidor
 */
class IndexRoutes {
    router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    public getIndex(req: Request, res: Response): void {
        res.json('Api: /api/produmax');
    }

    routes(): void{
        this.router.get('/', this.getIndex);
        this.router.use('/', unitRoutes);
        this.router.use('/', categoryRoutes);
        this.router.use('/', productRoutes);
        this.router.use('/', userRoutes);
        this.router.use('/', rolRoutes);
        this.router.use('/', orderRoutes);
        this.router.use('/auth', authRoutes)

    }
}

const indexRoutes = new IndexRoutes();
indexRoutes.routes();

export default indexRoutes.router;