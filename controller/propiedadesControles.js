import { unlink } from 'node:fs/promises'
import { check, validationResult } from "express-validator"
import { Propiedad, Categoria, Precio, ImagenesPropiedad } from "../models/index.js"
import { Sequelize } from 'sequelize'

//muestro la lista de propiedades que un usuario tiene en su disposicion
export const admin = async (req, res) => {
    const { pagina: paginaActual } = req.query
    //pagina actual desde la url
    console.log(paginaActual);
    const expresion = /^[1-9]$/

    if (!expresion.test(paginaActual)) {
        return res.redirect('mis-propiedades?pagina=1')
    }
    try {
        const { id } = req.user

        const limit = 10
        const offset = ((paginaActual * limit) - limit)
        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    { model: Categoria, as: "categoria" },
                    { model: Precio, as: "precio" },
                    { model: ImagenesPropiedad, as: "foto" }
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ])

        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })
    } catch (error) {
        console.log(error);
    }


    // const { id } = req.user

    // //busco al usuario
    // //en la base de deatos
    // const propiedades = await Propiedad.findAll({
    //     where: { usuarioId: id },
    //     include: [
    //         { model: Categoria, as: "categoria" },
    //         { model: Precio, as: "precio" },
    //         { model: ImagenesPropiedad, as: "foto" }
    //     ]
    // })
    // //veo sus propiedades y las listo



    // res.render("propiedades/admin", {
    //     titulo: "Mis Propiedades",
    //     pagina: "Mis Propiedades",
    //     propiedades,
    //     datos: {},
    //     csrfToken: req.csrfToken(),
    // })
}

export const crearPropiedad = async (req, res) => {
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
            datos: req.body,
        })
    }

    //Se crea el registro de la propiedad
    const { titulo, descripcion, categoria, precio, metros, ambientes, dormitorios, baños, cochera, calle, lat, lng } = req.body

    const { id: usuarioId } = req.user
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
        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error);
    }


}

export const agregarImagen = async (req, res) => {
    const { id } = req.params
    //valido que la propiedad exista
    const existProp = await Propiedad.findByPk(id)
    if (!existProp) {
        return res.redirect("/propiedades/mis-propiedades")
    }

    //Si esta publicada no se debe modificar
    if (existProp.publicado) {
        return res.redirect("/propiedades/mis-propiedades")
    }

    //validar que la propiedad publicada pertenezca al usuario

    if (req.user.id !== existProp.usuarioId) {
        return res.redirect("/propiedades/mis-propiedades")
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
    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    const fotosPropiedad = await ImagenesPropiedad.findByPk(propiedad.fotoId)

    if (!propiedad) {
        return res.redirect('mis-propiedades')
    }

    // // Validar que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('mis-propiedades')
    }

    // // Validar que la propiedad pertenece a quien visita esta página
    if (fotosPropiedad.id !== propiedad.fotoId) {
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

export const editarPropiedad = async (req, res) => {
    //Validacion: Solo el ususario que publico la casa puede editar esta
    //Extraigo el id de la url 
    const { id } = req.params
    //Consulto las propiedades
    const propiedad = await Propiedad.findByPk(id)
    console.log(propiedad);

    if (!propiedad) {
        return res.redirect("/propiedades/mis-propiedades")
    }

    if (propiedad.usuarioId !== req.user.id) {
        return res.redirect("/propiedades/mis-propiedades")
    }

    // Busco y renderizo las categorias
    const categorias = await Categoria.findAll()
    //Lo mismo con el precio y se lo paso
    const precios = await Precio.findAll()

    return res.render('propiedades/editar', {
        pagina: "Editar Propiedad",
        titulo: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

export const modificarPropiedad = async (req, res) => {

    // valido quien entro en la url
    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if (propiedad.usuarioId.toString() !== req.user.id.toString()) {
        return res.redirect('/mis-propiedades')
    }


    // se valida todos los campos del formulario
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
        const categorias = await Categoria.findAll()

        return res.render('propiedades/editar', {
            pagina: "Editar Propiedad",
            titulo: "Editar Propiedad",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            categorias,
            datos: req.body
        })
    }
    // Reescribir el objeto y actualizarlo
    try {
        const { titulo, descripcion, categoria, precio, metros, ambientes, dormitorios, baños, cochera, calle, lat, lng } = req.body

        let tienePrecio = await Precio.findOne({ where: { precio } })

        if (!tienePrecio) {
            // creo el precio si no existe
            tienePrecio = await Precio.create({
                precio,
                moneda: "ARS"

            })
        }

        propiedad.set({
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
            publicado: false

        }
        )
        await propiedad.save()
        res.redirect('mis-propiedades')
    } catch (error) {
        console.log(error);
    }
    //Se insertan los datos en la base de datos
}

export const deleteProp = async (req, res) => {
    //Valido que la prop exista
    const { id } = req.params
    const existPropiedad = await Propiedad.findByPk(id)

    if (!existPropiedad) {
        return res.redirect("/propiedades/mis-propiedades")
    }

    //URL usuario id = id usuario
    if (existPropiedad.usuarioId !== req.user.id) {
        return res.redirect("/propiedades/mis-propiedades")
    }

    //Elimino la imagen
    const hasImagen = await ImagenesPropiedad.findByPk(existPropiedad.fotoId)
    if (hasImagen) {
        await unlink(`public/uploads/${hasImagen.path}`)
        await hasImagen.destroy()
    }
    //Elimino la propiedad
    await existPropiedad.destroy()
    res.redirect("/propiedades/mis-propiedades")
}

// Area Publica
// Mostrar uuna propiedad

export const renderPropertyView = async (req, res) => {
    const { id } = req.params
    console.log("EL REQ DE USER ES ESTE:", req.user);

    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Precio, as: 'precio' },
            { model: ImagenesPropiedad, as: 'foto' },
            { model: Categoria, as: 'categoria', scope: 'eliminarPassword' },
        ]
    })

    if (!propiedad
    ) {
        return res.render('notfound', {
            pagina: `Sin recurso`,
            hasUser: req.user,
            csrfToken: req.csrfToken(),
        })
    }
    //Revizo si la propiedad publicada pertenece al mismo usuario
    const ownerPage = req.user?.id === propiedad.usuarioId

    res.render('propiedades/property-view', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.user,
        ownerPage,
        enviado: false,
        hasUser: req.user


    })
}

export const buscar = async (req, res) => {

    await check('buscador').notEmpty().withMessage('no debe estar vacio').run(req)
    await check('option').notEmpty().withMessage('no debe estar vacio').run(req)
    await check('categoria').notEmpty().withMessage('no debe estar vacio').run(req)
    let resultado = validationResult(req)

    if (!resultado) {
        // El input es el unico campo vacio, los demas ya estan preselecionados
        // si hay valor se lo valida y se busca, si no se coloca un valor ficticio'
        console.log("buscador vacio");
    }

    try {

        //REMPLAZAR BUSCADOR VACIO POR VALOR 
        const { option, buscador, categoria } = req.body
        if (!buscador) {
            req.body.buscador = "caseros"
        }
        console.log(option, buscador, categoria);
        console.log(req.body.buscador);

        const propiedadesBuscadas = await Propiedad.findAll({
            where: {
                titulo: {
                    [Sequelize.Op.like]: '%' + req.body.buscador + '%'
                }
            },
            include: [
                { model: Precio, as: 'precio' },
                { model: ImagenesPropiedad, as: 'foto' },
                { model: Categoria, as: 'categoria', scope: 'eliminarPassword' },
            ]
        })

        res.render('busqueda', {
            pagina: `Resultado de: ${buscador}`,
            propiedades: propiedadesBuscadas
        })
    } catch (error) {
        console.log(error);
    }
}
