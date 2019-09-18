import { Request, Response } from "express";
import Unit from "../models/Unit";

/**
 * @author Jipson Saad
 * @class UnitController
 */
class UnitController {
    constructor(){
        // asignación de contexto
        this.getUnits = this.getUnits.bind(this);
        this.getUnit = this.getUnit.bind(this);
        this.createUnit = this.createUnit.bind(this);
        this.updateUnit = this.updateUnit.bind(this);
        this.deleteUnit = this.deleteUnit.bind(this);
    }

    /**
     * Esta función se encarga de devolver todos las unidades en la base de datos
     *
     * @async esta función es asíncrona
     * @function getUnits devuelve todos las unidades
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
   */
    async getUnits(req: Request, res: Response): Promise<Response> {
        try {
            const units = await Unit.find();
            return res.status(200).json({categories: units})
        } catch (error) {
            return res.status(500).json({message: 'No se ha podido encontrar las unidades'});
        }
    }

    /**
     * Esta función se encarga de devolver una sola unidad en la base de datos
     *
     * @async esta función es asíncrona
     * @function getUnits devuelve una sola unidad
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
   */
    async getUnit(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const unit = await Unit.findById(id);
            if (!unit) return res.status(404).json({message: 'Unidad no encontrada'});

            return res.status(200).json({message: 'Unidad encontrada satisfactoriamente', unit: unit});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema encontrando la categoría'});
        }
    }

    /**
     * Esta función se encarga de crear una sola unidad en la base de datos
     *
     * @async esta función es asíncrona
     * @function createUnit crea una sola unidad
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
   */
    async createUnit(req: Request, res: Response): Promise<Response>{
        const { name, symbol } = req.body;
        try {
            const newUnit = {
                name: name,
                symbol: symbol
            }
            const unit = new Unit(newUnit);
            await unit.save();
            return res.status(201).json({message: 'Unidad creada satisfactoriamente', unit: unit});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema creando la unidad'});
        }
    }

    /**
     * Esta función se encarga de actualizar una sola unidad en la base de datos
     *
     * @async esta función es asíncrona
     * @function updateUnit actualiza una sola unidad
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
   */
    async updateUnit(req: Request, res: Response): Promise<Response>{
        const { id } = req.params;
        const { name, symbol } = req.body;
        try {
            
            const unit = await Unit.findByIdAndUpdate(id, {
                name: name,
                symbol: symbol
            }, {new: true});
            if (!unit)  return res.status(404).json({message: 'Unidad no se ha actualizado'});

            return res.status(200).json({message: 'Unidad actualizada satisfactoriamente', unit: unit});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema actualizando la unidad'});
        }
    }

    /**
     * Esta función se encarga de eliminar una sola unidad en la base de datos
     *
     * @async esta función es asíncrona
     * @function deleteUnit elimina una sola unidad
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
   */
    async deleteUnit(req: Request, res: Response): Promise<Response>{
        const { id } = req.params;
        try {
            const unit = await Unit.findByIdAndRemove(id);
            if (!unit)  return res.status(404).json({message: 'Unidad no se ha eliminado'});

            return res.status(201).json({message: 'Unidad eliminada satisfactoriamente'});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema eliminando la unidad'});
        }
    }
}

const unitController = new UnitController();
export default unitController;