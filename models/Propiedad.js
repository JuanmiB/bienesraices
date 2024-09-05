import { DataTypes } from "sequelize";
import db from "../config/db.js"

export const Propiedad = db.define('propiedades', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    metros: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    ,
    ambientes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    dormitorios: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    baños: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cochera: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calle: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lng: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }


});