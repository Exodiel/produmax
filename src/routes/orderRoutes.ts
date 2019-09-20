import { Router } from "express";
import orderController from './../controllers/order.controller';
import { verifyToken } from "../middlewares/verifytoken";
import { verifyRol } from "../middlewares/verifyrol";

class OrderRoutes {
    router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    routes(): void{
        this.router.route('/products')
            .get(orderController.getOrders)
            .post([verifyToken, verifyRol("admin")], orderController.createOrder);

        this.router.route('/products/:id')
            .get(orderController.getOrder)
            .delete([verifyToken, verifyRol("admin")], orderController.deleteOrder)
            .put([verifyToken, verifyRol("admin")], orderController.updateOrder);
    }
}

const orderRoutes = new OrderRoutes();
orderRoutes.routes();

export default orderRoutes.router;