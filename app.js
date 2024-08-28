import express, { json } from "express"
import csurf from "csurf"
import cookieParser from "cookie-parser"
// import session from "express-session"
// import { csrfSync } from "csrf-sync"
import db from "./config/db.js"
import passport from "./config/passport.js"
import { userRouter } from "./router/usuarios.js"
import { propiedadesRouter } from "./router/propiedadesRouter.js"
//Crear la app
 const app = express()

 app.use(json())
 app.disable("x-powered-by")

 //habilitar lectura de datos de formulario
 app.use(express.urlencoded({extended: true}))
 
 // Middleware de passport configurado
  app.use(passport.initialize())

 //habilitar COOKIE PARSER
 app.use(cookieParser())

 // habilitar CSRF
 app.use(csurf({cookie: true}))


 // Conexion a la BASE DE DATOS
 try{
   await db.authenticate()
   db.sync()
   console.log("Conexion correcta");
 } catch (error){
   console.log(error)
 }

  // Setteo de pug
  app.set('view engine', 'pug')
  app.set('views', './views')

  app.use(express.static('public'))

    // Routing
 app.use('/api/v1/auth', userRouter)
 app.use('/api/v1/propiedades', propiedadesRouter)

 const PORT = process.env.PORT || 1234
 app.listen(PORT, () => {
    console.log(`Servidor corriendo en el domino: http://localhost:1234/api/v1/auth/registrer`)
 })