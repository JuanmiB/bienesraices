import { Router } from "express";
import { admin, crearPropiedad, createPropertie, agregarImagen, saveImage, editarPropiedad, modificarPropiedad, deleteProp, renderPropertyView } from "../controller/propiedadesControles.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadImageMiddleware.js";


export const propiedadesRouter = Router()

propiedadesRouter.get('/mis-propiedades', authMiddleware, admin)
propiedadesRouter.get('/crear-propiedad', authMiddleware, crearPropiedad)
propiedadesRouter.post('/crear-propiedad', authMiddleware, createPropertie)
propiedadesRouter.get('/agregar-imagen/:id', authMiddleware, agregarImagen)
propiedadesRouter.post('/agregar-imagen/:id', authMiddleware, upload.single("imagen"), saveImage )
propiedadesRouter.get('/editar/:id', authMiddleware, editarPropiedad )
propiedadesRouter.post('/editar/:id', authMiddleware, modificarPropiedad )
propiedadesRouter.post('/eliminar/:id', authMiddleware, deleteProp )


//Area Publica
propiedadesRouter.get('/:id', renderPropertyView)