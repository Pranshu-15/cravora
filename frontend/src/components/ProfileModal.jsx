import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { RxCross2 } from "react-icons/rx";
import { FaUser, FaEnvelope, FaPhone, FaUserShield } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';

function ProfileModal({ isOpen, onClose }) {
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: ""
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || "",
                email: userData.email || "",
                mobile: userData.mobile || ""
            })
            setMessage(null)
        }
    }, [userData, isOpen])

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        try {
            const { data } = await axios.put(`${serverUrl}/api/user/update-profile`, formData, { withCredentials: true })
            dispatch(setUserData(data.user))
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Something went wrong' })
        } finally {
            setLoading(false)
        }
    }

    const inputClass = `w-full pl-10 pr-4 py-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]
        rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
        transition-all duration-200 placeholder:text-[var(--text-secondary)] text-sm`

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-inner">
                            <FaUser size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-white">Edit Profile</h2>
                            <p className="text-white/80 text-xs mt-0.5">Update your personal details</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors cursor-pointer"
                    >
                        <RxCross2 size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                    
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Full Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Mobile Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Role (Read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Account Role</label>
                        <div className="relative">
                            <FaUserShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                            <input
                                type="text"
                                value={userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : ''}
                                readOnly
                                className="w-full pl-10 pr-4 py-3 border border-[var(--border-color)] bg-[var(--bg-primary)]/50 text-[var(--text-secondary)] rounded-xl cursor-not-allowed font-medium text-sm"
                                title="Role cannot be edited"
                            />
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 ml-1">Your assigned role cannot be changed.</p>
                    </div>

                    {/* Message Banner */}
                    {message && (
                        <div className={`p-3 rounded-xl text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? <ClipLoader size={20} color="white" /> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    )
}

export default ProfileModal
