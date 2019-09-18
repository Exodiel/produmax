import { Router } from "express";
import userController from './../controllers/user.controller';
import { verifyToken } from "../middlewares/verifytoken";
import { verifyRol } from "../middlewares/verifyrol";

/**
 * @author Jipson Saad
 * 
 * @class clase para el control de las rutas o endpoints del usuario
 */
class UserRoutes {
    router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    routes(): void{
        this.router.route('/users')
            .get([verifyToken, verifyRol('admin')],userController.getUsers)
            .post([verifyToken, verifyRol('admin')],userController.createUser);

        this.router.route('/users/:id')
            .get([verifyToken, verifyRol('admin')],userController.getUser)
            .delete([verifyToken, verifyRol('admin')],userController.deleteUser)
            .put([verifyToken, verifyRol('admin')],userController.updateUser);
    }
}

const userRoutes = new UserRoutes();
userRoutes.routes();

export default userRoutes.router;