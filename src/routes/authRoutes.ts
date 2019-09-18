import { Router } from "express";
import authController from './../controllers/auth/auth.controller';


/**
 * @author Jipson Saad
 * 
 * @class clase para el control de las rutas o endpoints de la autorización de usuarios
 */
class AuthRoutes {
    router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    routes(): void{
        this.router.route('/register')
            .post(authController.register);

        this.router.route('/login')
            .post(authController.login);
    }
}

const authRoutes = new AuthRoutes();
authRoutes.routes();

export default authRoutes.router;