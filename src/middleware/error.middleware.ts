import { NextFunction, Request, Response } from 'express';
import {HttpException} from "../exceptions/httpException";
 
function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  console.log("paso por el error");
  next(
   response.status(status).json({message: error.message})
  )
}
 
export default errorMiddleware;