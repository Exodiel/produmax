import { Request, Response } from "express";
import Order from "../models/Order";
import ProductToOrder from "../models/ProductToOrder";
import User from "../models/User";
import Product from "../models/Product";

class OrderController {
    constructor() {
        this.createOrder = this.createOrder.bind(this);
        this.getOrder = this.getOrder.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
    }

    /**
     * Regresa todas las ordenes de la base de datos
     * 
     * @async función asíncrona
     * @function getOrders obtiene todas las ordenes provenientes de la base de datos
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getOrders(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await Order.find();
            return res.status(200).json({orders: orders})
        } catch (error) {
            return res.status(500).json({message: 'No se ha podido encontrar las ordenes'});
        }
    }

    /**
     * Regresa una sola orden de la base de datos
     * 
     * @async función asíncrona
     * @function getOrder obtiene una sola orden basado en su identificador
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getOrder(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const order = await Order.findById(id);
            if (!order) return res.status(404).json({message: 'Orden no encontrada'});

            return res.status(200).json({message: 'Orden encontrada satisfactoriamente', order: order});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema encontrando la orden'});
        }
    }

    /**
     * Crea una sola orden en la base de datos
     * 
     * @async función asíncrona
     * @function createOrder crea una sola orden 
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async createOrder(req: Request, res: Response): Promise<Response>{
        const { address, neigh, state, total, clientCI, details } = req.body;
        try {
            const client = await User.findOne({ ci: clientCI });
            if(!client) return res.status(404).json({message: 'Cliente no encontrado'});

            const newOrder = {
                address: address,
                neigh: neigh,
                state:state,
                total: total,
                clientId: client._id
            }
            const order = new Order(newOrder);
            await order.save();

            details.forEach(async (el: any) => {
                let pto = new ProductToOrder();
                pto.orderId = order._id;
                pto.productId = el.productId;
                pto.quantity = el.quantity;
                await pto.save();
            });

            return res.status(201).json({message: 'Categoría creada satisfactoriamente', order: order});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema creando la categoría'});
        }
    }

    /**
     * Actualiza una sola orden en la base de datos
     * (Comprueba que los detalles sean iguales, si no lo son, los elimina y agrega los nuevos detalles)
     * 
     * @async función asíncrona
     * @function updateOrder actualiza una sola orden basado en su identificador 
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async updateOrder(req: Request, res: Response): Promise<Response>{
        const { id } = req.params;
        const { address, neigh, state, total, clientCI, details } = req.body;
        try {
            
            const client = await User.findOne( { ci: clientCI } );
            if (!client)  return res.status(404).json({message: 'Usuario no se ha encontrado'});

            let order = await Order.findById(id);
            if(!order) return res.status(404).json({message: 'Orden no encontrada'});

            order.address = address;
            order.neigh = neigh;
            order.state = state;
            order.total = total;
            order.clientId = client._id;

            details.forEach(async (el: any) => {
                await ProductToOrder.updateMany({orderId: el.orderId, productId: el.productId}, 
                    {$set: {orderId: el.orderId, productId: el.productId}}, { upsert: true, omitUnidefined: true });    
            });
            
            await order.save();
            return res.status(200).json({message: 'Orden actualizada satisfactoriamente', order: order});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema actualizando la categoría'});
        }
    }

    /**
     * Elimina una sola orden y los detalles en la base de datos
     * 
     * @async función asíncrona
     * @function deleteOrder eliminar una sola categoría basado en su identificador 
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async deleteOrder(req: Request, res: Response): Promise<Response>{
        const { id } = req.params;
        try {
            await ProductToOrder.deleteMany({ orderId: id });

            const order = await Order.findByIdAndRemove(id);
            if (!order)  return res.status(404).json({message: 'Categoría no se ha eliminado'});

            await order.remove();

            return res.status(201).json({message: 'Categoría eliminada satisfactoriamente'});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema eliminando la categoría'});
        }
    }
}

const orderController = new OrderController();
export default orderController;