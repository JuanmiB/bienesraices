import { Router } from "express";
import { admin } from "../controller/propiedadesControles.js";

export const propiedadesRouter = Router()

propiedadesRouter.get('/mis-propiedades', admin)