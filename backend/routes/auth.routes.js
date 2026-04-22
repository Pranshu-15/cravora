import express from "express"
import { googleAuth, googleOAuthCallback, googleOAuthRedirect, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.get("/signout", signOut)
authRouter.post("/send-otp", sendOtp)
authRouter.post("/verify-otp", verifyOtp)
authRouter.post("/reset-password", resetPassword)
authRouter.post("/google-auth", googleAuth)
authRouter.get("/google-login", googleOAuthRedirect)
authRouter.get("/google-callback", googleOAuthCallback)

export default authRouter