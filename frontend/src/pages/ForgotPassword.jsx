import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

function ForgotPassword() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [err, setErr] = useState("")
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true })
            console.log(result)
            setErr("")
            setStep(2)
        } catch (error) {
            setErr(error?.response?.data?.message || "Failed to send OTP")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp: otp.trim() }, { withCredentials: true })
            console.log(result)
            setErr("")
            setStep(3)
        } catch (error) {
            setErr(error?.response?.data?.message || "Invalid OTP")
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setErr("Passwords do not match")
            return
        }
        if (newPassword.length < 6) {
            setErr("Password must be at least 6 characters")
            return
        }
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })
            setErr("")
            console.log(result)
            navigate("/signin")
        } catch (error) {
            setErr(error?.response?.data?.message || "Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = `w-full pl-10 pr-4 py-3.5 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]
        rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
        transition-all duration-200 placeholder:text-[var(--text-secondary)] text-sm`

    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[var(--bg-primary)] transition-colors duration-300'>
            <div className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-2xl w-full max-w-md p-8 sm:p-10 relative overflow-hidden'>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className='flex items-center gap-3 mb-8 relative z-10'>
                    <button 
                        onClick={() => navigate("/signin")}
                        className='p-1.5 rounded-full hover:bg-[var(--bg-primary)] transition-colors text-[var(--text-secondary)] hover:text-orange-500 cursor-pointer'
                    >
                        <IoIosArrowRoundBack size={28} />
                    </button>
                    <div>
                        <h1 className='text-2xl font-extrabold text-[var(--text-primary)]'>Reset Password</h1>
                        <p className='text-[var(--text-secondary)] text-xs mt-0.5'>
                            {step === 1 && "Enter your email to receive an OTP"}
                            {step === 2 && "Enter the 4-digit code sent to your email"}
                            {step === 3 && "Create a strong new password"}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className='flex items-center justify-between mb-8 relative z-10'>
                    <div className={`h-1.5 flex-1 rounded-l-full transition-colors duration-300 ${step >= 1 ? 'bg-orange-500' : 'bg-[var(--border-color)]'}`}></div>
                    <div className={`h-1.5 flex-1 mx-1 transition-colors duration-300 ${step >= 2 ? 'bg-orange-500' : 'bg-[var(--border-color)]'}`}></div>
                    <div className={`h-1.5 flex-1 rounded-r-full transition-colors duration-300 ${step >= 3 ? 'bg-orange-500' : 'bg-[var(--border-color)]'}`}></div>
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="animate-fade-in-up relative z-10">
                        <div className='mb-6'>
                            <label className='block text-[var(--text-primary)] font-bold text-sm mb-2 ml-1'>Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                                <input 
                                    type="email" 
                                    className={inputClass} 
                                    placeholder='e.g. hello@example.com' 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    value={email} 
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        {err && <div className='mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold text-center animate-fade-in-up'>{err}</div>}
                        <button 
                            type="submit" 
                            className={`w-full font-bold py-3.5 rounded-xl transition-all duration-200 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed`} 
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={20} color='white' /> : "Send Recovery OTP"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="animate-fade-in-up relative z-10">
                        <div className='mb-6'>
                            <label className='block text-[var(--text-primary)] font-bold text-sm mb-2 ml-1'>Enter OTP</label>
                            <div className="relative">
                                <FaKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                                <input 
                                    type="text" 
                                    className={`${inputClass} tracking-[0.5em] font-bold text-lg text-center pl-4`} 
                                    placeholder='0000' 
                                    maxLength={4}
                                    onChange={(e) => setOtp(e.target.value)} 
                                    value={otp} 
                                    required
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] text-center mt-3">
                                We sent a code to <span className="font-semibold text-[var(--text-primary)]">{email}</span>
                            </p>
                        </div>
                        {err && <div className='mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold text-center animate-fade-in-up'>{err}</div>}
                        <button 
                            type="submit" 
                            className={`w-full font-bold py-3.5 rounded-xl transition-all duration-200 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed`} 
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={20} color='white' /> : "Verify OTP"}
                        </button>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="animate-fade-in-up relative z-10">
                        <div className='mb-5'>
                            <label className='block text-[var(--text-primary)] font-bold text-sm mb-2 ml-1'>New Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                                <input 
                                    type="password" 
                                    className={inputClass} 
                                    placeholder='Enter new password' 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    value={newPassword}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className='mb-6'>
                            <label className='block text-[var(--text-primary)] font-bold text-sm mb-2 ml-1'>Confirm Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                                <input 
                                    type="password" 
                                    className={inputClass} 
                                    placeholder='Confirm new password' 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    value={confirmPassword} 
                                    required
                                />
                            </div>
                        </div>
                        {err && <div className='mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold text-center animate-fade-in-up'>{err}</div>}
                        <button 
                            type="submit" 
                            className={`w-full font-bold py-3.5 rounded-xl transition-all duration-200 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed`} 
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={20} color='white' /> : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
