import db from "../config/db.js"
import { exit } from 'node:process'
import {Categoria, Precio, Usuario} from "../models/index.js"
import bcrypt from 'bcrypt'
const categorias =  [
    {name: "Casa"},
    {name:"Edificio"},
    {name:"Cabaña"},
    {name:"Quinta"},
    {name:"Garage"},
    {name:"Local Comercial"},
    {name:"Oficina Comercial"},
    {name:"Terreno"}
]
const precio = [
    {precio: 0,
    moneda: "ARS"
    
    }
]
const usuarios = [
{
    nombre: 'Juan',
    email: 'juan@juan.com',
    confirm: 1,
    password: bcrypt.hashSync('password', 10)
}
]
const importarDatos = async () => {
    try {
        await db.authenticate()

        await db.sync()

        await Categoria.bulkCreate(categorias)
        await Precio.bulkCreate(precio)
        await Usuario.bulkCreate(usuarios)
        console.log("Categoria insertada correctamente");
    } catch(error){
        console.error("Error al insertar la categoria:", error);
    } finally {
        await db.close()
        exit()
    }
}
const isProduction = process.env.NODE_ENV === 'production';
const eliminarDatos = async () => {
    if (isProduction) {
        console.error('¡Eliminar datos no está permitido en producción!');
        exit(1);
    }
    try {
        await db.sync({force: true})
        console.log('Datos eliminados correctamente')
    } catch (error) {
        console.log(error)
    }
    finally{
        await db.close()
        exit()
    }
}
const mostrarAyuda = () => {
    console.log(`
        Uso:
        -i   Importar datos a la base de datos
        -e   Eliminar datos de la base de datos
    `);
};

const main = () => {
    const arg = process.argv[2];

    if (arg === "-i") {
        importarDatos();
    } else if (arg === "-e") {
        eliminarDatos();
    } else {
        console.error('Argumento no válido.');
        mostrarAyuda();
        exit(1);
    }
};

main();