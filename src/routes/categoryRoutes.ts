import { Router } from "express";
import categoryController from './../controllers/category.controller';
import { verifyToken } from "../middlewares/verifytoken";
import { verifyRol } from "../middlewares/verifyrol";

/**
 * @author Jipson Saad
 * 
 * @class clase para el control de las rutas o endpoints de las categorías de los productos
 */
class CategoryRoutes {
    router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    routes(): void{
        this.router.route('/categories')
            .get([verifyToken, verifyRol("admin")], categoryController.getCategories)
            .post([verifyToken, verifyRol("admin")], categoryController.createCategory);

        this.router.route('/categories/:id')
            .get([verifyToken, verifyRol("admin")], categoryController.getCategory)
            .delete([verifyToken, verifyRol("admin")], categoryController.deleteCategory)
            .put([verifyToken, verifyRol("admin")], categoryController.updateCategory);
    }
}

const categoryRoutes = new CategoryRoutes();
categoryRoutes.routes();

export default categoryRoutes.router;