import db from "../config/db.js"
import { exit } from 'node:process'
import { Categoria, ImagenesPropiedad, Precio, Propiedad, Usuario } from "../models/index.js"
import bcrypt from 'bcrypt'
const categorias = [
  { name: "Casa" },
  { name: "Edificio" },
  { name: "Cabaña" },
  { name: "Quinta" },
  { name: "Garage" },
  { name: "Local Comercial" },
  { name: "Oficina Comercial" },
  { name: "Terreno" }
]
//----------------------------------------------------------------
const generarPrecioAleatorio = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const generarPrecios = (cantidad, min, max, moneda) => {
  return Array.from({ length: cantidad }, () => ({
    precio: generarPrecioAleatorio(min, max),
    moneda: moneda
  }));
};
const precio = generarPrecios(12, 15000, 40000, "ARS");
//----------------------------------------------------------------
// const precio = [
//   {
//     precio: Math.floor(Math.random() * (40000 - 15000 + 1)) + 15000,
//     moneda: "ARS"
//   },
//   {
//     precio: Math.floor(Math.random() * (40000 - 15000 + 1)) + 15000,
//     moneda: "ARS"
//   },
//   {
//     precio: Math.floor(Math.random() * (40000 - 15000 + 1)) + 15000,
//     moneda: "ARS"
//   },
//   {
//     precio: Math.floor(Math.random() * (40000 - 15000 + 1)) + 15000,
//     moneda: "ARS"
//   },
//   {
//     precio: Math.floor(Math.random() * (40000 - 15000 + 1)) + 15000,
//     moneda: "ARS"
//   },
// ]

const usuarios = [
  {
    nombre: 'Juan',
    email: 'juan@juan.com',
    confirm: 1,
    password: bcrypt.hashSync('password', 10)
  }
]

const propiedades = [
  {
    titulo: "Casa en Barrio Norte",
    descripcion: "Hermosa casa con jardín amplio y pileta.",
    metros: 250,
    ambientes: 5,
    dormitorios: 3,
    baños: 2,
    cochera: 1,
    calle: "Av. Santa Fe 1234",
    lat: -34.5975,
    lng: -58.4043,
    publicado: true,
    precioId: 4,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 1
  },
  {
    titulo: "Departamento en Palermo",
    descripcion: "Moderno departamento con balcón y vista al parque.",
    metros: 85,
    ambientes: 3,
    dormitorios: 2,
    baños: 1,
    cochera: 0,
    calle: "Calle Gurruchaga 2754",
    lat: -34.5863,
    lng: -58.4311,
    publicado: true,
    precioId: 12,
    categoriaId: 2,
    usuarioId: 1,
    fotoId: 5
  },
  {
    titulo: "PH en Caballito",
    descripcion: "PH con patio y terraza privada.",
    metros: 120,
    ambientes: 4,
    dormitorios: 3,
    baños: 2,
    cochera: 1,
    calle: "Av. Rivadavia 4500",
    lat: -34.6232,
    lng: -58.4423,
    publicado: false,
    precioId: 1,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 4
  },
  {
    titulo: "Dúplex en Recoleta",
    descripcion: "Dúplex de lujo en el corazón de Recoleta.",
    metros: 190,
    ambientes: 6,
    dormitorios: 4,
    baños: 3,
    cochera: 2,
    calle: "Calle Posadas 1567",
    lat: -34.5911,
    lng: -58.3842,
    publicado: true,
    precioId: 10,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 3
  },
  {
    titulo: "Casa en Tigre",
    descripcion: "Casa en zona tranquila, cerca del río.",
    metros: 300,
    ambientes: 6,
    dormitorios: 4,
    baños: 3,
    cochera: 1,
    calle: "Calle Italia 330",
    lat: -34.4256,
    lng: -58.5793,
    publicado: true,
    precioId: 11,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 2
  },
  {
    titulo: "Loft en San Telmo",
    descripcion: "Loft industrial en edificio histórico.",
    metros: 75,
    ambientes: 2,
    dormitorios: 1,
    baños: 1,
    cochera: 0,
    calle: "Defensa 750",
    lat: -34.6181,
    lng: -58.3704,
    publicado: false,
    precioId: 2,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 1
  },
  {
    titulo: "Casa en Belgrano R",
    descripcion: "Casa de estilo francés con gran parque.",
    metros: 400,
    ambientes: 7,
    dormitorios: 5,
    baños: 4,
    cochera: 2,
    calle: "Calle Sucre 1890",
    lat: -34.5684,
    lng: -58.4571,
    publicado: true,
    precioId: 3,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 6
  },
  {
    titulo: "Departamento en Almagro",
    descripcion: "Cómodo departamento de 2 ambientes cerca del subte.",
    metros: 60,
    ambientes: 2,
    dormitorios: 1,
    baños: 1,
    cochera: 0,
    calle: "Medrano 1555",
    lat: -34.6065,
    lng: -58.4183,
    publicado: true,
    precioId: 4,
    categoriaId: 2,
    usuarioId: 1,
    fotoId: 5
  },
  {
    titulo: "Penthouse en Puerto Madero",
    descripcion: "Exclusivo penthouse con vista al río.",
    metros: 250,
    ambientes: 5,
    dormitorios: 3,
    baños: 3,
    cochera: 2,
    calle: "Alicia Moreau de Justo 1020",
    lat: -34.6123,
    lng: -58.3602,
    publicado: true,
    precioId: 5,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 2
  },
  {
    titulo: "Casa en Villa Devoto",
    descripcion: "Casa de estilo moderno con piscina y jardín.",
    metros: 280,
    ambientes: 6,
    dormitorios: 4,
    baños: 3,
    cochera: 1,
    calle: "Nueva York 5540",
    lat: -34.5961,
    lng: -58.5067,
    publicado: true,
    precioId: 6,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 4
  },
  {
    titulo: "Departamento en Villa Crespo",
    descripcion: "Departamento de 2 ambientes en edificio moderno.",
    metros: 55,
    ambientes: 2,
    dormitorios: 1,
    baños: 1,
    cochera: 0,
    calle: "Calle Malabia 2234",
    lat: -34.5937,
    lng: -58.4355,
    publicado: false,
    precioId: 7,
    categoriaId: 2,
    usuarioId: 1,
    fotoId: 1
  },
  {
    titulo: "Casa Quinta en Pilar",
    descripcion: "Amplia casa quinta con quincho y pileta.",
    metros: 500,
    ambientes: 8,
    dormitorios: 5,
    baños: 4,
    cochera: 2,
    calle: "Calle Champagnat 453",
    lat: -34.4536,
    lng: -58.9184,
    publicado: true,
    precioId: 8,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 3
  },
  {
    titulo: "Departamento en Barracas",
    descripcion: "Departamento en edificio histórico.",
    metros: 80,
    ambientes: 3,
    dormitorios: 2,
    baños: 2,
    cochera: 1,
    calle: "Calle Montes de Oca 1234",
    lat: -34.6285,
    lng: -58.3812,
    publicado: false,
    precioId: 9,
    categoriaId: 2,
    usuarioId: 1,
    fotoId: 6
  },
  {
    titulo: "PH en Boedo",
    descripcion: "PH con entrada independiente y patio.",
    metros: 95,
    ambientes: 4,
    dormitorios: 3,
    baños: 2,
    cochera: 0,
    calle: "Calle San Juan 2650",
    lat: -34.6207,
    lng: -58.4078,
    publicado: true,
    precioId: 10,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 5
  },
  {
    titulo: "Casa en San Isidro",
    descripcion: "Casa con jardín y pileta en zona residencial.",
    metros: 300,
    ambientes: 6,
    dormitorios: 4,
    baños: 3,
    cochera: 2,
    calle: "Calle Roque Sáenz Peña 1020",
    lat: -34.4697,
    lng: -58.5098,
    publicado: true,
    precioId: 2,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 2
  },
  {
    titulo: "Departamento en Núñez",
    descripcion: "Moderno departamento con balcón terraza.",
    metros: 90,
    ambientes: 4,
    dormitorios: 2,
    baños: 2,
    cochera: 1,
    calle: "Av. Libertador 7800",
    lat: -34.5376,
    lng: -58.4651,
    publicado: true,
    precioId: 5,
    categoriaId: 2,
    usuarioId: 1,
    fotoId: 4
  },
  {
    titulo: "PH en Flores",
    descripcion: "PH de 3 ambientes con patio y terraza.",
    metros: 110,
    ambientes: 3,
    dormitorios: 2,
    baños: 2,
    cochera: 0,
    calle: "Calle Caracas 1120",
    lat: -34.6264,
    lng: -58.4648,
    publicado: false,
    precioId: 9,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 3
  },
  {
    titulo: "Departamento en Belgrano",
    descripcion: "Departamento amplio con vista al río.",
    metros: 130,
    ambientes: 5,
    dormitorios: 3,
    baños: 2,
    cochera: 1,
    calle: "Calle Juramento 2150",
    lat: -34.5621,
    lng: -58.4489,
    publicado: true,
    precioId: 12,
    categoriaId: 2,
    usuarioId: 1,
    fotoId: 1
  },
  {
    titulo: "Casa en Villa Urquiza",
    descripcion: "Casa con jardín y parrilla.",
    metros: 180,
    ambientes: 5,
    dormitorios: 3,
    baños: 2,
    cochera: 1,
    calle: "Calle La Pampa 3400",
    lat: -34.5812,
    lng: -58.4854,
    publicado: true,
    precioId: 11,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 6
  },
  {
    titulo: "Departamento en Saavedra",
    descripcion: "Moderno departamento de 3 ambientes con amenities.",
    metros: 75,
    ambientes: 3,
    dormitorios: 2,
    baños: 1,
    cochera: 0,
    calle: "Calle Balbín 3250",
    lat: -34.5545,
    lng: -58.4821,
    publicado: true,
    precioId: 1,
    categoriaId: 2,
    usuarioId: 1,
    fotoId: 2
  },
  {
    titulo: "PH en Parque Patricios",
    descripcion: "PH con dos plantas y patio.",
    metros: 120,
    ambientes: 4,
    dormitorios: 3,
    baños: 2,
    cochera: 0,
    calle: "Calle Caseros 3300",
    lat: -34.6273,
    lng: -58.3971,
    publicado: false,
    precioId: 7,
    categoriaId: 1,
    usuarioId: 1,
    fotoId: 1
  }
];


const imagenesPropiedad = [
  {
    path: "1i7c5ogl5qb64nnlrouo.jpg",
  },
  {
    path: "1i7c355s9g4v8k4efkfg.jpg",
  },
  {
    path: "1i7jb2pcdofsmajhd9to.jpg",
  },
  {
    path: "1i7jbgrhfp262q9ca1no.jpg",
  },
  {
    path: "1iaaq0hvdi9co4uoqk9o.jpg",
  },
  {
    path: "1iaaq4mhcifsif8rgik.jpg",
  },
];

const importarDatos = async () => {
  try {
    await db.authenticate()

    await db.sync()

    await Categoria.bulkCreate(categorias)
    await Precio.bulkCreate(precio)
    await Usuario.bulkCreate(usuarios)
    await ImagenesPropiedad.bulkCreate(imagenesPropiedad)
    await Propiedad.bulkCreate(propiedades)
    console.log("DATOS INSERTADOS EN LA BASE");
  } catch (error) {
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
    await db.sync({ force: true })
    console.log('Datos eliminados correctamente')
  } catch (error) {
    console.log(error)
  }
  finally {
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