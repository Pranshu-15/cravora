import React from 'react'
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdDeliveryDining, MdStar } from "react-icons/md";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    React.useEffect(() => {
        if (searchParams.get('error') === 'google_failed') setErr('Google Sign In failed. Please try again.')
    }, [])

    const handleSignIn = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
            }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message || "An error occurred during sign in.")
            setLoading(false)
        }
    }

    const handleGoogleAuth = () => {
        window.location.href = `${serverUrl}/api/auth/google-login`
    }

    return (
        <div className='min-h-screen w-full flex bg-[var(--bg-primary)] transition-colors duration-300'>

            {/* LEFT PANEL — Food Image */}
            <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
                <img
                    src="/auth_food_hero.png"
                    alt="Delicious food"
                    className='w-full h-full object-cover blur-sm scale-105'
                />
                {/* Dark overlay */}
                <div className='absolute inset-0 bg-black/60' />

                {/* Content on image */}
                <div className='absolute inset-0 flex flex-col justify-between p-12'>
                    {/* Top brand */}
                    <h1 className='text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent drop-shadow-lg'>
                        Cravora
                    </h1>

                    {/* Center headline */}
                    <div>
                        <p className='text-white/80 text-sm font-semibold uppercase tracking-widest mb-3'>Food Delivery</p>
                        <h2 className='text-5xl font-extrabold text-white leading-tight mb-4'>
                            Hungry? <br />
                            <span className='bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent'>
                                We've got you.
                            </span>
                        </h2>
                        <p className='text-white/70 text-lg font-medium max-w-sm'>
                            Discover thousands of restaurants and get your favorite meals delivered to your door in minutes.
                        </p>
                    </div>

                    {/* Bottom stats */}
                    <div className='flex gap-6'>
                        {[
                            { value: "500+", label: "Restaurants" },
                            { value: "50k+", label: "Happy Users" },
                            { value: "30 min", label: "Avg. Delivery" },
                        ].map((stat) => (
                            <div key={stat.label} className='bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20'>
                                <div className='text-2xl font-extrabold text-white'>{stat.value}</div>
                                <div className='text-white/60 text-sm font-medium mt-1'>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL — Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden'>
                {/* Subtle bg blobs for non-lg screens */}
                <div className='absolute top-[-15%] right-[-15%] w-[50%] h-[50%] bg-orange-500 rounded-full blur-[140px] opacity-10 pointer-events-none lg:hidden' />
                <div className='absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-rose-500 rounded-full blur-[140px] opacity-10 pointer-events-none lg:hidden' />

                <div className='w-full max-w-md relative z-10'>
                    {/* Mobile brand */}
                    <h1 className='text-4xl font-extrabold mb-1 bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent lg:hidden'>
                        Cravora
                    </h1>

                    <h2 className='text-3xl font-extrabold text-[var(--text-primary)] mb-2 mt-2'>Welcome back! 👋</h2>
                    <p className='text-[var(--text-secondary)] mb-8 font-medium text-base'>Sign in to continue your food journey</p>

                    {/* Email */}
                    <div className='mb-5'>
                        <label className='block text-[var(--text-primary)] font-semibold mb-2 text-sm'>Email Address</label>
                        <input
                            type="email"
                            className='w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder:text-[var(--text-secondary)]'
                            placeholder='you@example.com'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    {/* Password */}
                    <div className='mb-2'>
                        <label className='block text-[var(--text-primary)] font-semibold mb-2 text-sm'>Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                className='w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12 placeholder:text-[var(--text-secondary)]'
                                placeholder='Enter your password'
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

                    <div className='text-right mb-6'>
                        <span
                            className='text-orange-500 font-semibold text-sm cursor-pointer hover:text-rose-500 transition-colors'
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </span>
                    </div>

                    {/* Error */}
                    {err && (
                        <div className='mb-4 flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-sm font-medium'>
                            <span>⚠</span> {err}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        className='w-full font-bold text-lg py-3.5 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70'
                        onClick={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={22} color='white' /> : <>
                            <MdDeliveryDining size={24} /> Sign In
                        </>}
                    </button>

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-[var(--border-color)]" />
                        <span className="px-4 text-[var(--text-secondary)] text-sm font-semibold">OR</span>
                        <div className="flex-1 border-t border-[var(--border-color)]" />
                    </div>

                    {/* Google */}
                    <button
                        className='w-full flex items-center justify-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl px-4 py-3.5 transition-all cursor-pointer duration-200 hover:border-orange-500/50 hover:shadow-md font-semibold text-sm'
                        onClick={handleGoogleAuth}
                    >
                        <FcGoogle size={22} />
                        <span>Continue with Google</span>
                    </button>

                    <p className='text-center mt-8 text-[var(--text-secondary)] font-medium text-sm'>
                        New to Cravora?{' '}
                        <span
                            className='text-orange-500 font-bold hover:text-rose-500 cursor-pointer transition-colors underline underline-offset-2'
                            onClick={() => navigate("/signup")}
                        >
                            Create an account
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignIn
