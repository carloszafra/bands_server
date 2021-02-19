import { NextFunction, Request, Response } from "express";
import { ControllersI } from "../interfaces/Controllers/controllers.interface";
import validationMiddleware from "../middleware/validation.middleware";
import express from "express";
import {compare} from "bcryptjs" 
import { sign } from "jsonwebtoken"
require("dotenv").config();
import UserDto from "../models/DTO´s/user.dto";
import UserModel, { userI } from "../models/Schemas/user.schema";
import { loginDto } from "../models/DTO´s/login.dto";
import { Model } from "mongoose";
import UserWithThatEmailExistsException from "../exceptions/userWithThatEmailExistsException";
import WrongCredentialsException from "../exceptions/wrongCredentialsException";
import { dataStoredInToken, tokenDataI } from "../interfaces/jwt.interface";
import { requestWithUser } from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";

export class AuthController implements ControllersI {
    public path = "/auth";
    public router = express.Router();
    private user: Model<userI> = UserModel;

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(UserDto), this.createUser);
        this.router.post(`${this.path}/login`, validationMiddleware(loginDto), this.loginUser);
        this.router.get(`${this.path}/renew`, authMiddleware, this.loginUser)
    }

    createUser = async (req: Request, resp: Response, next: NextFunction) => {
        console.log(req.body);
        const userData: userI = req.body;
        if (await this.user.findOne({ email: userData.email })) {
            next(new UserWithThatEmailExistsException(userData.email));
        }
        else {
            const newUser = new this.user(userData);
            newUser.password = await newUser.hashPassword(newUser.password);
            const savedUser = await newUser.save();
            savedUser.password = undefined;
            const token = this.createToken(savedUser);
            resp.setHeader('Set-Cookie', [this.createCookie(token)]);
            resp.json({
                ok: true,
                msg: savedUser,
            });
        }
    }

    loginUser = async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        const loginData: loginDto = req.body;
        const user = await this.user.findOne({email: loginData.email});
        

        if(user){
            const passwordMatch = await compare(loginData.password, user.password);

            if(passwordMatch){
                user.password = undefined;
                const token = this.createToken(user);
                res.setHeader('Set-Cookie', [this.createCookie(token)]);
                res.json({user: user});
            }
            else{
                 next(new WrongCredentialsException());
               // res.status(401).json({mesg: new WrongCredentialsException().message});
            }
        }
        else{
            next(new WrongCredentialsException());
        }
    }

    renewToken = async (req: requestWithUser, res: Response, next: NextFunction) => {
      const user = req.user;
       const token = this.createToken(user);
       res.setHeader('Set-Cookie', [this.createCookie(token)]);
       res.json({user: user});
    }

    private createToken(user: userI){
       const expiresIn = 60 * 60;
       const secret = process.env.JWT_SECRET;
       const data: dataStoredInToken = {
           _id: user._id,
       };

       return {
           expiresIn: expiresIn,
           token: sign(data, secret, {expiresIn}),
       }
    }

    private createCookie(tokenData: tokenDataI) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}

