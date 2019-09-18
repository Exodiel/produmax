import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
declare const process: {
    env: {
        JWT_SECRET: string
    }
};
/**
 * @author Jipson Saad
 * @function función middleware para la verificación del token
 * @param req 
 * @param res 
 * @param next 
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const header = <string>req.headers["authorization"];
    const token = header.split(" ")[1];
    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        return res.status(401).json({message: 'No se encuentra autorizado'});
    }

    // If the token is valid for 1h, you should send a new token, in this case the token is valid for 24h
    // const {userId, username} = jwtPayload;
    // const newToken = jwt.sign({userId, username}, process.env.JWT_SECRET, {expiresIn: '1h'});
    // res.setHeader("token", newToken);
    // console.log(jwtPayload);
    next();
}