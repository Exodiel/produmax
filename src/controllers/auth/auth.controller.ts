import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import Rol from "../../models/Rol";

declare const process: {
    env: {
        JWT_SECRET: string
    }
};

/**
 * @author Jipson Saad
 * @class AuthController
 */
class AuthController {
    constructor(){
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    /**
     * Esta función se encarga de registrar un usuario, 
     * cuando se registra un usuario por defecto será asignado el rol de cliente
     * al final se envía un token para auntenticar al usuario
     * 
     * @async función asíncrona
     * @function register registra un sólo usuario con el rol de cliente 
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async register(req: Request, res: Response): Promise<Response> {
        const {ci, name, lastname, age, email, password, phone} = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const rol = await Rol.findOne({name: 'client'});
            const newUser = {
                ci: ci,
                name: name,
                lastname: lastname,
                age: age,
                email: email,
                password: hashedPassword,
                phone: phone,
                rol_id: rol ? rol._id : ''
            };
            const user = new User(newUser);
            const token = jwt.sign({id: user._id, username: user.name}, process.env.JWT_SECRET, { expiresIn: 86400 });
            await user.save();
            return res.status(201).json({auth: true, token: token});
        } catch (error) {
            return res.status(500).json({message:'Existe un problema registrando el usuario'});
        }
    }

    /**
     * Esta función se encarga de permitir a un usuario acceder a su cuenta creada
     * 
     * @async función asíncrona
     * @function login permite acceder a una cuenta registrada y valida el token 
     * @param req variable de tipo Request(Petición HTTP)
     * @param res  variable de tipo Response(Respuesta HTTP)
     * @returns devuelve una respuesta HTTP
     */
    async login(req: Request, res: Response): Promise<Response>{
        const {email, password} = req.body;
        try {
            const user = await User.findOne({email: email});
            if (!user) return res.status(404).json({message: 'Usuario no encontrado'});

            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) return res.status(401).json({auth: false, token: null});

            const token = jwt.sign({id: user._id, username: user.name}, process.env.JWT_SECRET, {expiresIn: 86400});

            return res.status(200).json({auth: true, token: token});

        } catch (error) {
            return res.status(500).json({message:'Existe un problema ingresando a la aplicación'});
        }
    }
}

const authController = new AuthController();
export default authController;