import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail=async (to,otp) => {
    try {
        if(!process.env.EMAIL || process.env.EMAIL.startsWith("//")) {
            console.log(`[MAIL MOCK] Password Reset OTP for ${to}: ${otp}`)
            return;
        }
        await transporter.sendMail({
            from:process.env.EMAIL,
            to,
            subject:"Reset Your Password",
            html:`<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
        })
    } catch (error) {
        console.log("Error sending email:", error)
        throw new Error("Failed to send email")
    }
}

export const sendDeliveryOtpMail=async (user,otp) => {
    try {
        if(!process.env.EMAIL || process.env.EMAIL.startsWith("//")) {
            console.log(`[MAIL MOCK] Delivery OTP for ${user.email}: ${otp}`)
            return;
        }
        await transporter.sendMail({
            from:process.env.EMAIL,
            to:user.email,
            subject:"Delivery OTP",
            html:`<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
        })
    } catch (error) {
         console.log("Error sending email:", error)
         throw new Error("Failed to send email")
    }
}
