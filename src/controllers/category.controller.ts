import { Request, Response } from "express";
import Category from "../models/Category";

/**
 * @author Jipson Saad
 * @class CategoryController
 */
class CategoryController {
    constructor(){
        // asignación de contexto
        this.getCategories = this.getCategories.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.createCategory = this.createCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    /**
     * Regresa todas las categorías de la base de datos
     * 
     * @async función asíncrona
     * @function getCategories obtiene todas las categorías provenientes de la base de datos
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getCategories(req: Request, res: Response): Promise<Response> {
        try {
            const categories = await Category.find();
            return res.status(200).json({categories: categories})
        } catch (error) {
            return res.status(500).json({message: 'No se ha podido encontrar las categorías'});
        }
    }

    /**
     * Regresa una sola categoría de la base de datos
     * 
     * @async función asíncrona
     * @function getCategory obtiene una sola categoría basado en su identificador
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getCategory(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const category = await Category.findById(id);
            if (!category) return res.status(404).json({message: 'Categoría no encontrada'});

            return res.status(200).json({message: 'Categoría encontrada satisfactoriamente', category: category});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema encontrando la categoría'});
        }
    }

    /**
     * Crea una sola categoría en la base de datos
     * 
     * @async función asíncrona
     * @function createCategory crea una sola categoría 
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async createCategory(req: Request, res: Response): Promise<Response>{
        const { name } = req.body;
        try {
            const newCategory = {
                name: name
            }
            const category = new Category(newCategory);
            await category.save();
            return res.status(201).json({message: 'Categoría creada satisfactoriamente', category: category});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema creando la categoría'});
        }
    }

    /**
     * Actualiza una sola categoría en la base de datos
     * 
     * @async función asíncrona
     * @function updateCategory actualiza una sola categoría basado en su identificador 
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async updateCategory(req: Request, res: Response): Promise<Response>{
        const { id } = req.params;
        const { name } = req.body;
        try {
            
            const category = await Category.findByIdAndUpdate(id, {
                name: name
            }, {new: true});
            if (!category)  return res.status(404).json({message: 'Categoría no se ha actualizado'});

            return res.status(200).json({message: 'Categoría actualizada satisfactoriamente', category: category});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema actualizando la categoría'});
        }
    }

    /**
     * Elimina una sola categoría en la base de datos
     * 
     * @async función asíncrona
     * @function deleteCategory eliminar una sola categoría basado en su identificador 
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async deleteCategory(req: Request, res: Response): Promise<Response>{
        const { id } = req.params;
        try {
            const category = await Category.findByIdAndRemove(id);
            if (!category)  return res.status(404).json({message: 'Categoría no se ha eliminado'});

            return res.status(201).json({message: 'Categoría eliminada satisfactoriamente'});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema eliminando la categoría'});
        }
    }
}

const categoryController = new CategoryController();
export default categoryController;