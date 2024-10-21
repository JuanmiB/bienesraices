import jwt from 'jsonwebtoken'
import { Usuario } from "../models/Usuario.js"

const identifyUser = async (req, res, next) => {
    //Identidico si hay un token en la req
    const token = req.cookies ? req.cookies._token : null
    //Si no hay se coloca un null en el user y next
    if (!token) {
        req.user = null
        return next()
    }
    //Si hay, trycatch
    //decodifico el token
    //busco al usuario por este decoded
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) return res.redirect('/auth/login');
        const usuario = await Usuario.scope('hideInfo').findByPk(decoded.sub)
        if (usuario) {
            req.user = usuario
        } else {
            console.log(usuario);
            return res.redirect('/auth/login')
        }
        return next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log("Token expired");
        } else if (error.name === 'JsonWebTokenError') {
            console.log("Invalid token");
        } else {
            console.log("Error verifying token:", error.message);
        }

        return res.clearCookie('_token').redirect("/auth/login")
    }
}
export default identifyUser