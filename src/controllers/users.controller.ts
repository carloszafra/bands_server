import express, { NextFunction, Request, Response } from "express";
import { ControllersI } from "../interfaces/Controllers/controllers.interface";
import { requestWithUser } from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";

export class UserController implements ControllersI  {
    
    public path = "/user";
    public router = express.Router();

    constructor(){
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        
        this.router.get(`${this.path}/prueba`, authMiddleware, this.getUser);
    }

    getUser = async (req: requestWithUser, res: Response, next: NextFunction) => {
        console.log(req.user);
        res.status(200)
       .json({
           user: "fake user",
           id: "1212414",
           msg: "funciono",
       })
    }
}