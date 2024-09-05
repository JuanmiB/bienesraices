import { DataTypes } from "sequelize"
import db from "../config/db.js"


export const ImagenesPropiedad = db.define("foto" , {
    path: DataTypes.STRING(60),
})