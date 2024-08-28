import { Router } from "express";
import { admin, newProperties, createPropertie } from "../controller/propiedadesControles.js";
import authMiddleware from "../middleware/authMiddleware.js";


export const propiedadesRouter = Router()

propiedadesRouter.get('/mis-propiedades', authMiddleware, admin)
propiedadesRouter.get('/new-properties', authMiddleware, newProperties)
propiedadesRouter.post('/new-properties', authMiddleware, createPropertie)
