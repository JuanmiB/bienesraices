import { Router } from "express";
import { propiedades } from "../controller/apiController.js";

export const apiRouter = Router()

apiRouter.get("/", propiedades)
