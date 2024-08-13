
export const admin = (req, res ) => {
    res.render("propiedades/mis-propiedades",{
        titulo: "Mis Propiedades",
        pagina: "mis-popiedades",
        barra: true

    })
}

export const newProperties = (req, res) => {
    res.render("propiedades/new-properties",{
        titulo: "Crear propiedad",
        pagina:"Crear propiedad"
    })
}