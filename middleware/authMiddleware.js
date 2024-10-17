import passport from "passport";

const authMiddleware = passport.authenticate("jwt", { session: false, failureRedirect: '/auth/login' })

export default authMiddleware