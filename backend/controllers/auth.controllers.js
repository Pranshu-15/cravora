import User from "../models/user.model.js"
import bcrypt, { hash } from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"
export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User Already exist." })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters." })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "mobile no must be at least 10 digits." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hashedPassword
        })

        const token = await genToken(user._id)
        const isProd = process.env.NODE_ENV === 'production'
        res.cookie("token", token, {
            secure: isProd,
            sameSite: isProd ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json(`sign up error ${error}`)
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist." })
        }

        if (!user.password) {
            return res.status(400).json({ message: "Please sign in with Google." })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "incorrect Password" })
        }

        const token = await genToken(user._id)
        const isProd = process.env.NODE_ENV === 'production'
        res.cookie("token", token, {
            secure: isProd,
            sameSite: isProd ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json(`sign In error ${error}`)
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "log out successfully" })
    } catch (error) {
        return res.status(500).json(`sign out error ${error}`)
    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist." })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false
        await user.save()
        await sendOtpMail(email, otp)
        return res.status(200).json({ message: "otp sent successfully" })
    } catch (error) {
        return res.status(500).json(`send otp error ${error}`)
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "invalid/expired otp" })
        }
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({ message: "otp verify successfully" })
    } catch (error) {
        return res.status(500).json(`verify otp error ${error}`)
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "otp verification required" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({ message: "password reset successfully" })
    } catch (error) {
        return res.status(500).json(`reset password error ${error}`)
    }
}

export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile, role } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                fullName, email, mobile, role
            })
        }

        const token = await genToken(user._id)
        const isProd = process.env.NODE_ENV === 'production'
        res.cookie("token", token, {
            secure: isProd,
            sameSite: isProd ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json(`googleAuth error ${error}`)
    }
}

// ─── Server-side Google OAuth (no Firebase domain restriction) ───────────────

export const googleOAuthRedirect = (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = `${process.env.BACKEND_URL}/api/auth/google-callback`
    const scope = 'email profile'
    const url =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&prompt=select_account`
    res.redirect(url)
}

export const googleOAuthCallback = async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    try {
        const { code } = req.query
        const redirectUri = `${process.env.BACKEND_URL}/api/auth/google-callback`

        // 1. Exchange code → access token
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        })
        const tokenData = await tokenRes.json()
        if (!tokenData.access_token) {
            return res.redirect(`${frontendUrl}/signin?error=google_failed`)
        }

        // 2. Get user info from Google
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        })
        const googleUser = await userInfoRes.json()

        // 3. Find or create user in DB
        let user = await User.findOne({ email: googleUser.email })
        if (!user) {
            user = await User.create({
                fullName: googleUser.name,
                email: googleUser.email,
                mobile: '0000000000',
                role: 'user'
            })
        }

        // 4. Set auth cookie and redirect to frontend
        const token = await genToken(user._id)
        const isProd = process.env.NODE_ENV === 'production'
        res.cookie('token', token, {
            secure: isProd,
            sameSite: isProd ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        res.redirect(frontendUrl)

    } catch (error) {
        res.redirect(`${frontendUrl}/signin?error=google_failed`)
    }
}