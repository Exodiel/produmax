import { Router } from "express";
import rolController from './../controllers/rol.controller';
import { verifyToken } from "../middlewares/verifytoken";
import { verifyRol } from "../middlewares/verifyrol";

/**
 * @author Jipson Saad
 * 
 * @class clase para el control de las rutas o endpoints del rol para un usuario
 */
class RolRoutes {
    router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    routes(): void{
        this.router.route('/roles')
            .get([verifyToken, verifyRol("admin")], rolController.getRols)
            .post([verifyToken, verifyRol("admin")], rolController.createRol);
            
        this.router.route('/rol').get([verifyToken, verifyRol("admin")], rolController.getRolOne);    

        this.router.route('/roles/:id')
            .get([verifyToken, verifyRol("admin")], rolController.getRol)
            .delete([verifyToken, verifyRol("admin")], rolController.deleteRol)
            .put([verifyToken, verifyRol("admin")], rolController.updateRol);
    }
}

const rolRoutes = new RolRoutes();
rolRoutes.routes();

export default rolRoutes.router;