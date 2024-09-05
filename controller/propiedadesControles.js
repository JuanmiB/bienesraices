import { check, validationResult } from "express-validator"
import { Propiedad, Categoria, Precio, ImagenesPropiedad } from "../models/index.js"


export const admin = async (req, res) => {
    const { id } = req.user

    //busco al usuario
    //en la base de deatos
    const propiedades = await Propiedad.findAll({where: {usuarioId : id}})
    //veo sus propiedades y las listo

    res.render("propiedades/admin", {
        titulo: "Mis Propiedades",
        pagina: "Mis Propiedades",
        propiedades,
        datos: {}
    })
}

export const crearPropiedad= async (req, res) => {
    const categorias = await Categoria.findAll()

    res.render("propiedades/crear-propiedad", {
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

    if (!resultado.isEmpty()) {
        //Errores
        const categorias = await Categoria.findAll()

        return res.render('propiedades/crear-propiedad', {
            pagina: "Crear Propiedad",
            titulo: "Crear Propiedad",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            categorias,
            datos: req.body

        })
    }

    //Se crea el registro de la propiedad
    const { titulo, descripcion, categoria, precio, metros, ambientes, dormitorios, baños, cochera, calle, lat, lng } = req.body

    const { id : usuarioId } = req.user
    try {
        let tienePrecio = await Precio.findOne({ where: { precio } })

        if (!tienePrecio) {
            // creo el precio si no existe
            tienePrecio = await Precio.create({
                precio,
                moneda: "ARS"

            })
        }

        let tieneFoto = await ImagenesPropiedad.create({
            path: null
        })


        const propiedad = await Propiedad.create({
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
            precioId: tienePrecio.id,
            categoriaId: categoria,
            usuarioId,
            fotoId: tieneFoto.id,
            publicado: false



        })

        const { id } = propiedad
        res.redirect(`/api/v1/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error);
    }


}

export const agregarImagen = async (req, res) => {
  const { id } = req.params
   //valido que la propiedad exista
    const existProp = await Propiedad.findByPk(id)
    if(!existProp){
        return res.redirect("/api/v1/propiedades/mis-propiedades")
    }

    //Si esta publicada no se debe modificar
    if(existProp.publicado){
        return res.redirect("/api/v1/propiedades/mis-propiedades")
    }

    //validar que la propiedad publicada pertenezca al usuario

    if(req.user.id !== existProp.usuarioId) {
        return res.redirect("/api/v1/propiedades/mis-propiedades")
    }

    res.render('propiedades/agregar-imagen', {
            pagina: "Agregar Imagenes",
            titulo: "Agregar imagenes",
            csrfToken: req.csrfToken(),
            propiedad: existProp
    }
    )

}

export const saveImage = async (req, res, next) => {
    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    const fotosPropiedad = await ImagenesPropiedad.findByPk(propiedad.fotoId)

    if(!propiedad) {
        return res.redirect('mis-propiedades')
    }

    // // Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('mis-propiedades')
    }

    // // Validar que la propiedad pertenece a quien visita esta página
    if( fotosPropiedad.id !== propiedad.fotoId ) {
        return res.redirect('mis-propiedades')
    }

    try {
        fotosPropiedad.path = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()
        await fotosPropiedad.save()
        next()

    } catch (error) {
        console.log(error)
    }
}