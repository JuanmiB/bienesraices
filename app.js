import express, { json } from "express"
import csurf from "csurf"
import cookieParser from "cookie-parser"
import db from "./config/db.js"
import passport from "./config/passport.js"
import { userRouter } from "./router/usuarios.js"
import { propiedadesRouter } from "./router/propiedadesRouter.js"
import { appRouter } from "./router/appRouter.js"
import { apiRouter } from "./api/router/apiRouter.js"
//Crear la app
const app = express()

app.use(json())
app.disable("x-powered-by")

//habilitar lectura de datos de formulario
app.use(express.urlencoded({ extended: true }))

// Middleware de passport configurado
app.use(passport.initialize())

//habilitar COOKIE PARSER
app.use(cookieParser())

// habilitar CSRF
app.use(csurf({ cookie: true }))


// Conexion a la BASE DE DATOS
try {
  await db.authenticate()
  db.sync()
  console.log("Conexion correcta");
} catch (error) {
  console.log(error)
}

// Setteo de pug
app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))

// Routing
app.use('/', appRouter)
app.use('/auth', userRouter)
app.use('/propiedades', propiedadesRouter)
app.use('/api/v1/propiedades', apiRouter)

const PORT = process.env.PORT || 1234
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el domino: http://localhost:1234/`)
})