import express from "express";
import {UserController} from "../controllers/auth.controller";

export const router = express.Router();
const userCtrl = new UserController();

// router.post("/new", userCtrl.createUser());