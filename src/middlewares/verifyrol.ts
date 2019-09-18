import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Rol from "../models/Rol";


/**
 * @author Jipson Saad
 * 
 * @function función para verificar si el usuario es admin o cliente
 * @param rol 
 */
export function verifyRol(rol: string){
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = res.locals.jwtPayload.id;
        let user, rolModel;
        try {
            user = await User.findById(id);
            if (!user) return res.status(404).json({message: 'No se encuentra el usuario'});
            
            rolModel = await Rol.findOne({type_user: 1, name: rol});
            if (!rolModel) return res.status(404).json({message: 'No se encuentra el rol'});

            
            if (user.rol_id !== rolModel._id) {
                next();
            }else {
                return res.status(401).json({message: 'No se encuentra autorizado'});
            }

        } catch (error) {
            return res.status(401).json({message: 'No se encuentra autorizado'});
        }
    }
}