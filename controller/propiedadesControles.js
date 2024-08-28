import { check, validationResult } from "express-validator"
import { Propiedad, Categoria, Precio } from "../models/index.js"


export const admin = (req, res) => {
    res.render("propiedades/mis-propiedades", {
        titulo: "Mis Propiedades",
        pagina: "mis-popiedades",
        barra: true,
        datos: {}

    })
}

export const newProperties = async (req, res) => {
    const categorias = await Categoria.findAll()

    res.render("propiedades/new-properties", {
        titulo: "Crear propiedad",
        pagina: "Crear propiedad",
        categorias,
        csrfToken: req.csrfToken(),
        datos: {}
    })
}

export const createPropertie = async (req, res) => {

    await check('titulo').notEmpty().withMessage('El titulo no debe estar vacio').run(req)
    await check('descripcion').notEmpty().withMessage('Escribe una descripcion').run(req)
    await check('categoria').notEmpty().withMessage('Selecciona una categoria').run(req)
    await check('precio').isNumeric().withMessage('Coloca el precio de la propiedad').run(req)
    await check('metros').isNumeric().withMessage('Coloca los mt2 de la propiedad').run(req)
    await check('ambientes').isNumeric().withMessage('Coloca el numero de ambientes de la propiedad').run(req)
    await check('dormitorios').isNumeric().withMessage('No puede estar vacio').run(req)
    await check('baños').isNumeric().withMessage('No puede estar vacio').run(req)
    await check('cochera').isNumeric().withMessage('No puede estar vacio').run(req)

    let resultado = validationResult(req)

    console.log("El resultado de la validacion es el siguiente:" + resultado);
    if (!resultado.isEmpty()) {
        //Errores
        const categorias = await Categoria.findAll()

        return res.render('propiedades/new-properties', {
            pagina: "new-properties",
            titulo: "Crear Propiedad",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            categorias,
            datos: req.body

        })
    }
    console.log(req.body);

    //Se crea el registro de la propiedad
    const { titulo, descripcion, categoria, precio, metros, ambientes, dormitorios, baños, cochera, calle, lat, lng } = req.body

    try {
        const propiedad = Propiedad.create({
            titulo,
            descripcion,
            metros,
            ambientes,
            dormitorios,
            baños,
            cochera,
            calle,
            lat,
            lng,
            precioId : precio,
            categoriaId: categoria,
            imagen: "",
            publicado : false


        })
    
    } catch (error) {
console.log(error);
    }

    // res.render('templates/mensaje', {
    //     titulo: 'Registro exitoso!',
    //     pagina: 'Cuenta Creada Correctamente',
    //     mensaje: 'Hemos enviado un email con las istrucciones para verificar tu cuenta. Revisa tu bandeja de entrada y sigue las instrucciones para completar el proceso de registro'
    // })
}