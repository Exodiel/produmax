import { Router } from "express";
import productController from './../controllers/product.controller';
import multer from "../libs/multer";
import { verifyToken } from "../middlewares/verifytoken";
import { verifyRol } from "../middlewares/verifyrol";

class ProductRoutes {
    router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    routes(): void{
        this.router.route('/products')
            .get(productController.getProducts)
            .post([verifyToken, verifyRol("admin"), multer.single('image')], productController.createProduct);

        this.router.route('/products/:id')
            .get(productController.getProduct)
            .delete([verifyToken, verifyRol("admin")], productController.deleteProduct)
            .put([verifyToken, verifyRol("admin"), multer.single('image') ], productController.updateProduct);
    }
}

const productRoutes = new ProductRoutes();
productRoutes.routes();

export default productRoutes.router;