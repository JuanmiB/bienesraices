import { Propiedad } from "./Propiedad.js";
import { Precio } from "./Precio.js";
import { Categoria } from "./Categoria.js";
import { Usuario } from "./Usuario.js";
import { ImagenesPropiedad } from "./ImagenesPropiedad.js";


Propiedad.belongsTo(Precio, {foreignKey:'precioId'})
Propiedad.belongsTo(Categoria,{foreignKey: 'categoriaId'})
Propiedad.belongsTo(Usuario,{foreignKey:'usuarioId'})
Propiedad.belongsTo(ImagenesPropiedad, {foreignKey:'fotoId'})


export{
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    ImagenesPropiedad
}