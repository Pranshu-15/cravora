import React from 'react'
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaUser, FaStore } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdDeliveryDining } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const ROLES = [
    { id: "user", label: "Customer", icon: <FaUser size={16} />, desc: "Order food" },
    { id: "owner", label: "Owner", icon: <FaStore size={16} />, desc: "Run a shop" },
    { id: "deliveryBoy", label: "Delivery", icon: <MdDeliveryDining size={18} />, desc: "Deliver food" },
]

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName, email, password, mobile, role
            }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message || "An error occurred during sign up.")
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) return setErr("Mobile number is required")
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true })
            dispatch(setUserData(data))
        } catch (error) {
            setErr(error?.response?.data?.message || error.message || "Google Sign Up Failed.")
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen w-full flex bg-[var(--bg-primary)] transition-colors duration-300'>

            {/* LEFT PANEL — image, flipped for signup */}
            <div className='hidden lg:flex lg:w-[45%] relative overflow-hidden'>
                <img
                    src="/auth_food_hero.png"
                    alt="Delicious food"
                    className='w-full h-full object-cover blur-sm scale-105'
                />
                {/* Dark overlay */}
                <div className='absolute inset-0 bg-black/60' />

                <div className='absolute inset-0 flex flex-col justify-between p-12'>
                    <h1 className='text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent'>
                        Cravora
                    </h1>

                    <div>
                        <p className='text-white/70 text-sm font-semibold uppercase tracking-widest mb-3'>Join Cravora Today</p>
                        <h2 className='text-5xl font-extrabold text-white leading-tight mb-4'>
                            Your taste, <br />
                            <span className='bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent'>
                                delivered.
                            </span>
                        </h2>
                        <p className='text-white/70 text-lg font-medium max-w-sm'>
                            Create your account and start exploring thousands of restaurants, home chefs, and more.
                        </p>
                    </div>

                    {/* Testimonial card */}
                    <div className='bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20'>
                        <div className='flex gap-1 mb-2'>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className='text-yellow-400 text-lg'>★</span>
                            ))}
                        </div>
                        <p className='text-white/90 font-medium text-sm leading-relaxed'>
                            "Cravora changed how I eat! Amazing variety and lightning-fast delivery every single time."
                        </p>
                        <p className='text-white/50 text-xs mt-3 font-semibold'>— Riya Sharma, Delhi</p>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL — Form */}
            <div className='w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-10 relative overflow-hidden'>
                <div className='absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-rose-500 rounded-full blur-[140px] opacity-10 pointer-events-none lg:hidden' />
                <div className='absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-orange-500 rounded-full blur-[140px] opacity-10 pointer-events-none lg:hidden' />

                <div className='w-full max-w-lg relative z-10'>
                    {/* Mobile brand */}
                    <h1 className='text-4xl font-extrabold mb-1 bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent lg:hidden'>
                        Cravora
                    </h1>

                    <h2 className='text-3xl font-extrabold text-[var(--text-primary)] mb-1 mt-2'>Create your account ✨</h2>
                    <p className='text-[var(--text-secondary)] mb-7 font-medium text-base'>Join millions of food lovers on Cravora</p>

                    {/* Role selector — cards */}
                    <div className='mb-6'>
                        <label className='block text-[var(--text-primary)] font-semibold mb-3 text-sm'>I want to join as</label>
                        <div className='grid grid-cols-3 gap-3'>
                            {ROLES.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setRole(r.id)}
                                    className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all cursor-pointer font-semibold text-sm
                                        ${role === r.id
                                            ? 'border-orange-500 bg-gradient-to-b from-orange-500/10 to-rose-500/10 text-orange-500 shadow-lg shadow-orange-500/10'
                                            : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-orange-500/40 hover:text-orange-400'
                                        }`}
                                >
                                    <span className={role === r.id ? 'text-orange-500' : ''}>{r.icon}</span>
                                    <span>{r.label}</span>
                                    <span className='text-xs font-normal opacity-70'>{r.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form fields - 2 col grid */}
                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label className='block text-[var(--text-primary)] font-semibold mb-2 text-sm'>Full Name</label>
                            <input
                                type="text"
                                className='w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)] text-sm'
                                placeholder='John Doe'
                                onChange={(e) => setFullName(e.target.value)}
                                value={fullName}
                            />
                        </div>
                        <div>
                            <label className='block text-[var(--text-primary)] font-semibold mb-2 text-sm'>Mobile</label>
                            <input
                                type="tel"
                                className='w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)] text-sm'
                                placeholder='+91 9876543210'
                                onChange={(e) => setMobile(e.target.value)}
                                value={mobile}
                            />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-[var(--text-primary)] font-semibold mb-2 text-sm'>Email Address</label>
                        <input
                            type="email"
                            className='w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)] text-sm'
                            placeholder='you@example.com'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-[var(--text-primary)] font-semibold mb-2 text-sm'>Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                className='w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12 placeholder:text-[var(--text-secondary)] text-sm'
                                placeholder='Create a strong password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <button
                                className='absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-orange-500 transition-colors cursor-pointer'
                                onClick={() => setShowPassword(p => !p)}
                            >
                                {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {err && (
                        <div className='mb-4 flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-sm font-medium'>
                            <span>⚠</span> {err}
                        </div>
                    )}

                    <button
                        className='w-full font-bold text-lg py-3.5 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70'
                        onClick={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={22} color='white' /> : <>
                            Create Account 🚀
                        </>}
                    </button>

                    <div className="flex items-center my-5">
                        <div className="flex-1 border-t border-[var(--border-color)]" />
                        <span className="px-4 text-[var(--text-secondary)] text-sm font-semibold">OR</span>
                        <div className="flex-1 border-t border-[var(--border-color)]" />
                    </div>

                    <button
                        className='w-full flex items-center justify-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl px-4 py-3 transition-all cursor-pointer hover:border-orange-500/50 hover:shadow-md font-semibold text-sm'
                        onClick={handleGoogleAuth}
                    >
                        <FcGoogle size={22} />
                        <span>Sign up with Google</span>
                    </button>

                    <p className='text-center mt-6 text-[var(--text-secondary)] font-medium text-sm'>
                        Already have an account?{' '}
                        <span
                            className='text-orange-500 font-bold hover:text-rose-500 cursor-pointer transition-colors underline underline-offset-2'
                            onClick={() => navigate("/signin")}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
