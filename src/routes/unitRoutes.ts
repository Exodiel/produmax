import { Router } from "express";
import unitController from './../controllers/unit.controller';

/**
 * @author Jipson Saad
 * 
 * @class clase para el control de las rutas o endpoints de la unidad para un producto
 */
class UnitRoutes {
    router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    routes(): void{
        this.router.route('/units')
            .get(unitController.getUnits)
            .post(unitController.createUnit);

        this.router.route('/units/:id')
            .get(unitController.getUnit)
            .delete(unitController.deleteUnit)
            .put( unitController.updateUnit);
    }
}

const unitRoutes = new UnitRoutes();
unitRoutes.routes();

export default unitRoutes.router;