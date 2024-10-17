import { Router } from "express";
import { inicio, categorias, notFound, buscar } from "../controller/appController.js";
import identifyUser from "../middleware/identifyUser.js";
export const appRouter = Router()

appRouter.get("/", identifyUser, inicio)

appRouter.get("/categorias/:id", identifyUser, categorias)

appRouter.get('/404', notFound)

appRouter.post('/buscar', buscar)