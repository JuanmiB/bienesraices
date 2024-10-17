import jwt from "jsonwebtoken"

// Funcion para generar un token unico
export const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)


// Generar JWT con palabra secreta
const secret = process.env.JWT_SECRET
export function generateToken(user){
    //Creo la carga util con los datos del usuario
    const payload = {
        sub: user.id,
        name: user.nombre
    }
    const token = jwt.sign(payload, secret)
    return token
}

