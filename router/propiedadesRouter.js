import { Router } from "express";
import { admin, crearPropiedad, createPropertie, agregarImagen, saveImage } from "../controller/propiedadesControles.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadImageMiddleware.js";


export const propiedadesRouter = Router()

propiedadesRouter.get('/mis-propiedades', authMiddleware, admin)
propiedadesRouter.get('/crear-propiedad', authMiddleware, crearPropiedad)
propiedadesRouter.post('/crear-propiedad', authMiddleware, createPropertie)
propiedadesRouter.get('/agregar-imagen/:id', authMiddleware, agregarImagen)
propiedadesRouter.post('/agregar-imagen/:id', authMiddleware, upload.single("imagen"), saveImage )
