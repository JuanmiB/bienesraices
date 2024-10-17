import { Categoria, ImagenesPropiedad, Precio, Propiedad } from "../models/index.js"
export const inicio = async (req, res) => {
    console.log("EL REQ DEL USER DESDE INICIO", req.user);
    const categorias = await Categoria.findAll()
    //Fetch de la api y pasar las propiedades
    res.render('inicio', {
        pagina: "inicio",
        categorias,
        csrfToken: req.csrfToken(),
        hasUser: req.user
    })
}
export const categorias = async (req, res) => {
    //extraigo id de url
    const { id } = req.params

    //comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)

    if (!categoria) {
        return res.render('notfound', {
            pagina: `Sin recurso`,
            hasUser: req.user,
        })
    }

    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            { model: Precio, as: "precio" },
            { model: Categoria, as: "categoria" },
            { model: ImagenesPropiedad, as: "foto" },
        ]
    })
    res.render('categoria', {
        pagina: `${categoria.name}s`,
        propiedades,
        hasUser: req.user,
        csrfToken: req.csrfToken()
    })
}
export const notFound = async (req, res) => {
    res.render('notfound', {
        pagina: `Sin recurso`,
        hasUser: req.user,
        csrfToken: req.csrfToken(),
    })
}
export const buscar = async (req, res) => { }