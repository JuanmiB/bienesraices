import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import passport from "passport"
import { Usuario } from "../models/index.js"

// Configuracion para extraer jwt de cookie
const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies._token;  // Extrae el token de la cookie '_token'
            }
            return token;
        }
    ]),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            const usuario = await Usuario.scope('hideInfo').findByPk(jwtPayload.sub)

            if (usuario) {
                return done(null, usuario)
            } else {
                return done(null, false)
            }
        } catch (error) {
            return done(error, false)
        }
    }))

export default passport