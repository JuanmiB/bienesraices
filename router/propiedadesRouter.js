import { Router } from "express";
import { admin, newProperties } from "../controller/propiedadesControles.js";

export const propiedadesRouter = Router()

propiedadesRouter.get('/mis-propiedades', admin)
propiedadesRouter.get('/new-properties', newProperties)