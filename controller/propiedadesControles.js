
export const admin = (req, res ) => {
    res.render("propiedades/mis-propiedades",{
        titulo: "Mis Propiedades",
        pagina: "mis-popiedades",
        barra: true

    })
}