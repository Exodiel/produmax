import { Request, Response } from "express";
import User from "../models/User";
import Rol from "../models/Rol";
/**
 * @class UserController
 */
class UserController {
    constructor() {
        // asignación de contexto
        this.getUser = this.getUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.createUser = this.createUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    /**
     * Regresa todos los usuarios de la base de datos
     * 
     * @async función asíncrona
     * @function getUsers obtiene todos los usuarios provenientes de la base de datos
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await User.find();
            return res.status(200).json({users: users});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema encontrando los usuarios'});
        }
    }

    /**
     * Regresa un sólo usuario basado en su identificador
     * 
     * @async función asíncrona
     * @function getUser obtiene un sólo usuario basado en su identificador
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async getUser(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        try {
            const user = await User.findById(id);

            if (!user) return res.status(404).json({message: 'Usuario no encontrado'});
            
            return res.status(200).json({message: 'Usuario encontrado satisfactoriamente', user: user});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema encontrando el usuario'});
        }
    }

    /**
     * Crea un usuario asignandole un rol
     * 
     * @async función asíncrona
     * @function createUser crea un sólo usuario
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async createUser(req: Request, res: Response): Promise<Response> {
        const {ci, name, lastname, age, email, password, phone, rolName} = req.body;
        try {
            const rol = await Rol.findOne({name: rolName});
            const newUser = {
                ci: ci,
                name: name,
                lastname: lastname,
                age: age,
                email: email,
                password: password,
                phone: phone,
                rol_id: rol ? rol._id : ''
            };
            const user = new User(newUser);
            await user.save();
            return res.status(201).json({message: 'Usuario creado satisfactoriamente', user: user});
        } catch (error) {
            return res.status(500).json({message:'Existe un problema en crear el usuario'});
        }
    }

    /**
     * Elimina un usuario basado en su identificador
     * 
     * @async función asíncrona
     * @function deleteUser elimina un sólo usuario basado en su identificador
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async deleteUser(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        try {
            const user = await User.findByIdAndRemove(id);

            if (!user) return res.status(400).json({message: 'Usuario no se ha eliminado'});

            return res.status(200).json({message: 'Usuario eliminado stisfactoriamente'});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema eliminando el usuario'});
        }
    }

    /**
     * Actualiza un usuario basado en su identificador
     * 
     * @async función asíncrona
     * @function updateUser actualiza un sólo usuario basado en su identificador
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async updateUser(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const { ci, name, lastname, age, email, password, phone } = req.body;
        try {
            const updatedUser = await User.findByIdAndUpdate(id, {
                ci: ci,
                name: name,
                lastname: lastname,
                age: age,
                email: email,
                password: password,
                phone: phone
            }, {new: true});

            if (!updatedUser) return res.status(400).json({message: 'Usuario no se ha actualizado'});

            return res.status(200).json({message: 'Usuario actualizado', user: updatedUser});
        } catch (error) {
            return res.status(500).json({message: 'Existe un problema actualizando el usuario'});
        }
    }
}
const userController = new UserController();
export default userController;