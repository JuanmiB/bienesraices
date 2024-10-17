import { Propiedad, Categoria, Precio, ImagenesPropiedad } from "../../models/index.js"

export const propiedades = async (req, res) => {
    const propiedades = await Propiedad.findAll({
        include: [
            { model: Categoria, as: "categoria" },
            { model: Precio, as: "precio" },
            { model: ImagenesPropiedad, as: "foto" }
        ]
    })
    res.json({
        propiedades
    })
}

