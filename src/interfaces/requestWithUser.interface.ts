import { Request } from "express";
import { userI } from "../models/Schemas/user.schema";

export interface requestWithUser extends Request {
    user: userI;
}