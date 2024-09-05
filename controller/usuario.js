import { check, validationResult } from "express-validator"
import { Usuario } from "../models/Usuario.js"
import { generarId } from "../helpers/token.js"
import { emailRecoverPassword, emailRegistrer } from "../helpers/emails.js"
import { generateToken } from "../helpers/token.js"
export const formLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "login",
        titulo: "Iniciar Sesión",
        csrfToken: req.csrfToken()
    })
}
export const authentication = async (req, res) => {
    await check("email").isEmail().withMessage("El email no es correcto").run(req)
    await check("password").isLength({ min: 6 }).withMessage("La contraseña debe tener 6 caracteres minimo").run(req)

    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/login', {
            pagina: "login",
            titulo: "Error en la autenticacion",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            userData: {
                email: req.body.email
            }
        })
    }

    const { email, password } = req.body

    // Buscar al ususario en la BD
    const user = await Usuario.findOne({ where: { email } })
    console.log(user);

    if (!user) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no existe' }]
        })
    }
    //validar usuario confirmado
    if (!user.confirm) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no ha sido confirmada aun' }]
        })

    }
    //validar que password sea correcto 
    if (!user.verifyPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La contraseña es incorrecta' }]
        })
    }

// autenticar al usuario
    const token = generateToken({ id: user.id, nombre: user.nombre })
    return res.cookie("_token", token, {
        httpOnly: true,
       //secure: true, // Debe haber certificado SSL (Https)
        // sameSite: "Strict",

    }).redirect("/api/v1/propiedades/mis-propiedades")
}
export const formSingIn = (req, res) => {

    res.render("auth/registrer", {
        pagina: "singIn",
        titulo: "Registro",
        csrfToken: req.csrfToken()
    })
}
export const formRecoverPassword = (req, res) => {
    res.render("auth/recover-password", {
        pagina: "recoverPassword",
        titulo: "Recuperar Cuenta",
        csrfToken: req.csrfToken()
    })
}
export const registrarUser = async (req, res) => {
    //validar con express-validator
    await check('nombre').notEmpty().withMessage("El nombre no debe estar vacio").run(req)
    await check('email').isEmail().withMessage("El email es incorrecto").run(req)
    await check('password').isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres").run(req)
    await check('repetir_password').equals(req.body.password).withMessage("La contraseñas no coinciden").run(req)

    let resultado = validationResult(req)
    //TODO: Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/registrer', {
            pagina: "singIn",
            titulo: "Registro",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            userData: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }
    //Verificar usuario duplicado
    const existUser = await Usuario.findOne({ where: { email: req.body.email } })
    if (existUser) {
        return res.render('auth/registrer', {
            pagina: "singIn",
            titulo: "Registro",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "Ese email ya esta registrado" }]
        })
    }

    const { nombre, email, password } = req.body
    //Almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        confirm: false,
        token: generarId()
    })
    
    //ENVIO DE EMAIL DE CONFIRMACION
    emailRegistrer({
        nombre: usuario.nombre,
        email: usuario.email,
        confirm: usuario.confirm,
        token: usuario.token
    })

    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        titulo: 'Registro exitoso!',
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un email con las istrucciones para verificar tu cuenta. Revisa tu bandeja de entrada y sigue las instrucciones para completar el proceso de registro'
    })
}
export const confirmarCuenta = async (req, res) => {
    const { token } = req.params
    //guardar el token en una variable prev
    //compara la prev con la actual


    //verificer si el token es valido
    const userWithToken = await Usuario.findOne({ where: { token } })

    if (!userWithToken) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error de confirmacion',
            mensaje: 'No se pudo confirmar tu cuenta debido a un error',
            error: true
        })
    }
    // confirmar cuenta
    userWithToken.confirm = true
    userWithToken.token = null
    await userWithToken.save()



    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Cuenta confirmada correctamente',
        error: false
    })
}
//Funcion para recuperar cuenta
export const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage("Error con el email").run(req)

    let resultado = validationResult(req)
    //TODO: Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render("auth/recover-password", {
            pagina: "recoverPassword",
            titulo: "Recuperar Cuenta",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            userData: {
                email: req.body.email
            }
        })
    }

    //Buscar al usuario en la base de datos
    const { email } = req.body
    const usuario = await Usuario.findOne({ where: { email } })

    //Error: no existe el email
    if (!usuario) {
        return res.render('auth/recover-password', {
            pagina: "recover-password",
            titulo: "Recupera tu cuenta",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "Ese email no pertenece a ningun usuario" }]
        })
    }
    //Generar token y enviar mail
    usuario.token = generarId()
    await usuario.save()

    // Enviar un email
    emailRecoverPassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })
    // Mostrar mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })

}

export const validateToken = async (req, res) => {
    //leer el token
    const { token } = req.params

    // verificar si el token es valido
    const isValidToken = await Usuario.findOne({ where: { token } })

    //token no valido
    if (!isValidToken) {
        return res.render('auth/recover-password', {
            pagina: 'Error en la recuperacion de cuenta',
            mensaje: 'No se pudo recuperar tu cuenta debido a un error',
            error: true
        })
    } else {
        // Mostrar formulario para modificar el password
        return res.render('auth/reset-password', {
            pagina: 'Reestablece Tu Password',
            csrfToken: req.csrfToken()
        })

    }

}
export const generateNewPassword = async (req, res) => {
    await check('password').isLength({ min: 6 }).withMessage("La contraseña debe contar con 6 caracteres o mas").run(req)
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    const { token } = req.params
    const { password } = req.body

    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({ where: { token } })

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null

    await usuario.save()

    res.render('auth/confirmar-cuenta', {
        titulo: 'Recuperar cuenta',
        pagina: 'Contraseña restablecida!',
        mensaje: 'La contraseña se guardó correctamente'
    })
}
