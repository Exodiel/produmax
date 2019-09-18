import { Request, Response } from "express";
import Rol from "../models/Rol";

/**
 * @class RolController
 */
class RolController {
    constructor() {
        // asignación de contexto
        this.getRol = this.getRol.bind(this);
        this.getRols = this.getRols.bind(this);
        this.createRol = this.createRol.bind(this);
        this.deleteRol = this.deleteRol.bind(this);
        this.updateRol = this.updateRol.bind(this);
    }

    /**
     * Obtiene los roles provenientes de la base de datos
     * 
     * @async función asíncrona
     * @function getRols obtiene todos los roles provenientes de la base de datos
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getRols(req: Request, res: Response): Promise<Response> {
        try {
            const rols = await Rol.find();
            return res.status(200).json({rols: rols});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema obteniendo los roles'});
        }
    }

    /**
     * Obtiene un sólo rol basado en su identificador
     * 
     * @async función asíncrona
     * @function getRol obtiene un sólo basado en su identificador
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getRol(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        try {
            const rol = await Rol.findById(id);

            if (!rol) return res.status(404).json({message: 'Rol no encontrado'});

            return res.status(200).json({message: 'Rol encontrado satisfactoriamente', rol: rol});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema obteniendo el rol'});
        }
    }

    /**
     * Obtiene un sólo rol basado en su identificador
     * 
     * @async función asíncrona
     * @function getRolOne obtiene un sólo rol con el criterio de cliente
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getRolOne(req: Request, res: Response): Promise<Response> {
        try {
            const rol = await Rol.findOne({name: 'client'});

            if (!rol) return res.status(404).json({message: 'Rol no encontrado'});

            return res.status(200).json({message: 'Rol encontrado satisfactoriamente', rol: rol});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema obteniendo el rol'});
        }
    }

    /**
     * Crea un nuevo rol
     * 
     * @async función asíncrona
     * @function createRol crea un sólo rol
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async createRol(req: Request, res: Response): Promise<Response> {
        const {name, type_user} = req.body;
        try {
            const newRol = {
                name: name,
                type_user: type_user
            };
            const rol = new Rol(newRol);
            await rol.save();
            return res.status(201).json({message: 'Rol creado', rol: rol});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema creando el rol'});
        }
    }

    /**
     * Elimina un rol basado en su identificador
     * 
     * @async función asíncrona
     * @function deleteRol elimina un sólo rol
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async deleteRol(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        try {
            const rol = await Rol.findById(id);

            if (!rol) return res.status(404).json({message: 'Rol no encontrado'});

            await rol.remove();
            return res.status(200).json({message: 'Rol eliminado correctamente'});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema eliminado el rol'});
        }
    }

    /**
     * Actualiza un sólo rol basado en su identificador
     * 
     * @async función asíncrona
     * @function updateRol actualiza un sólo rol
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async updateRol(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const {name} = req.body;
        try {
            const updatedRol = await Rol.findByIdAndUpdate(id,{name: name}, {new: true});

            if (!updatedRol) return res.status(400).json({message: 'Rol no actualizado'});
            
            return res.status(200).json({message: 'Rol actualizado', rol: updatedRol});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema actualizando el rol'});
        }
    }
}
const rolController = new RolController();
export default rolController;