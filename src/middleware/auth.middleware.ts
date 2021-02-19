import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/missingAuthTokenExcp";
import WrongAuthenticationTokenException from "../exceptions/wrongAuthTokenExcp";
import { dataStoredInToken } from "../interfaces/jwt.interface";
import { requestWithUser } from "../interfaces/requestWithUser.interface";
import UserModel from "../models/Schemas/user.schema";
require("dotenv").config();

async function authMiddleware(req: requestWithUser, res: Response, next: NextFunction){
  const cookies = req.cookies;

  if(cookies && cookies.Authorization){
      const secret = process.env.JWT_SECRET;

      try {
          const verificationResponse = verify(cookies.Authorization, secret) as dataStoredInToken;
          const id = verificationResponse._id;
          const user = await UserModel.findById(id);

          if(user){
              req.user = user;
              next();
           }
           else{
              next(new WrongAuthenticationTokenException());
           }
        } catch (error) {
          next(new WrongAuthenticationTokenException());
        }
    }
    else{
       next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;