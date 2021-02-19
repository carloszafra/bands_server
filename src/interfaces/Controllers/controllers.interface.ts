import { Router } from "express";

export interface ControllersI {
    path: string,
    router: Router,
    initializeRoutes(): void,
}