import { Router } from "express"
import { 
    formLogin, 
    formSingIn, 
    formRecoverPassword, 
    registrarUser,
    confirmarCuenta,
    resetPassword,
    validateToken,
    generateNewPassword
 } from "../controller/usuario.js"

export const userRouter = Router()
//login
userRouter.get('/login', formLogin)

//registrer
userRouter.get('/registrer', formSingIn)
userRouter.post('/registrer', registrarUser)

//recover password
userRouter.get('/recover-password', formRecoverPassword)
userRouter.post('/recover-password', resetPassword)

userRouter.get('/reset-password/:token', validateToken)
userRouter.post('/recover-password/:token', generateNewPassword)


//confirmar cuenta
//:token --> variable para utilizar en url
userRouter.get('/confirmarCuenta/:token', confirmarCuenta)



