import passport from "passport";

const authMiddleware = passport.authenticate("jwt", { session: false, failureRedirect: '/api/v1/auth/login' })

export default authMiddleware