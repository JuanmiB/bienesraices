import { Router } from "express";
import { 
    admin, 
    crearPropiedad, 
    createPropertie, 
    agregarImagen, 
    saveImage, 
    editarPropiedad, 
    modificarPropiedad, 
    deleteProp, 
    renderPropertyView,
    buscar 
} from "../controller/propiedadesControles.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadImageMiddleware.js";
import identifyUser from "../middleware/identifyUser.js";


export const propiedadesRouter = Router()

propiedadesRouter.get('/mis-propiedades', authMiddleware, admin)
propiedadesRouter.get('/crear-propiedad', authMiddleware, crearPropiedad)
propiedadesRouter.post('/crear-propiedad', authMiddleware, createPropertie)
propiedadesRouter.get('/agregar-imagen/:id', authMiddleware, agregarImagen)
propiedadesRouter.post('/agregar-imagen/:id', authMiddleware, upload.single("imagen"), saveImage )
propiedadesRouter.get('/editar/:id', authMiddleware, editarPropiedad )
propiedadesRouter.post('/editar/:id', authMiddleware, modificarPropiedad )
propiedadesRouter.post('/eliminar/:id', authMiddleware, deleteProp )
propiedadesRouter.post('/buscar', buscar )



//Area Publica
propiedadesRouter.get('/:id', identifyUser, renderPropertyView)