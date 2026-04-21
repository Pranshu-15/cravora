import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { MdDriveFileRenameOutline, MdPhotoCamera } from "react-icons/md";
import { useState, useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function CreateEditShop() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const { currentCity, currentState, currentAddress } = useSelector(state => state.user)
    const [name, setName] = useState(myShopData?.name || "")
    const [address, setAddress] = useState(myShopData?.address || currentAddress)
    const [city, setCity] = useState(myShopData?.city || currentCity)
    const [state, setState] = useState(myShopData?.state || currentState)
    const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
    const [backendImage, setBackendImage] = useState(null)
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const fileRef = useRef()

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
        setErr("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!myShopData && !backendImage) {
            setErr("Please upload an image for your shop.")
            return
        }
        setErr("")
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("city", city)
            formData.append("state", state)
            formData.append("address", address)
            if (backendImage) formData.append("image", backendImage)
            const result = await axios.post(`${serverUrl}/api/shop/create-edit`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen w-full bg-[var(--bg-primary)] transition-colors duration-300 flex flex-col items-center justify-center px-4 py-12 relative'>

            {/* Back button */}
            <button
                className='absolute top-5 left-5 flex items-center gap-1 text-[var(--text-secondary)] hover:text-orange-500 transition-colors font-semibold text-sm'
                onClick={() => navigate("/")}
            >
                <IoIosArrowRoundBack size={28} />
                <span>Back</span>
            </button>

            {/* Card */}
            <div className='w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl rounded-2xl overflow-hidden transition-colors duration-300'>

                {/* Card header */}
                <div className='bg-gradient-to-r from-orange-500 to-rose-500 p-6 flex items-center gap-4'>
                    <div className='bg-white/20 backdrop-blur-sm p-3 rounded-xl'>
                        <FaUtensils className='text-white w-7 h-7' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-extrabold text-white'>{myShopData ? "Edit Shop" : "Create Shop"}</h1>
                        <p className='text-white/70 text-sm mt-0.5'>Fill in the details below to {myShopData ? "update" : "list"} your restaurant</p>
                    </div>
                </div>

                <form className='p-6 sm:p-8 space-y-5' onSubmit={handleSubmit}>

                    {/* Shop Name */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                            <MdDriveFileRenameOutline className='text-orange-500' size={18} /> Shop Name
                        </label>
                        <input
                            type="text"
                            placeholder='e.g. Spice Garden'
                            className='w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)] text-sm'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                            <MdPhotoCamera className='text-orange-500' size={18} /> Shop Photo
                        </label>
                        <div
                            className='w-full border-2 border-dashed border-[var(--border-color)] rounded-xl overflow-hidden cursor-pointer hover:border-orange-500 transition-colors'
                            onClick={() => fileRef.current.click()}
                        >
                            {frontendImage ? (
                                <div className='relative'>
                                    <img src={frontendImage} alt="preview" className='w-full h-48 object-cover' />
                                    <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                                        <span className='text-white font-semibold text-sm flex items-center gap-2'><MdPhotoCamera size={20} /> Change Photo</span>
                                    </div>
                                </div>
                            ) : (
                                <div className='h-36 flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)]'>
                                    <MdPhotoCamera size={32} className='text-orange-400' />
                                    <p className='text-sm font-medium'>Click to upload shop photo</p>
                                    <p className='text-xs opacity-60'>PNG, JPG, WEBP up to 10MB</p>
                                </div>
                            )}
                        </div>
                        <input type="file" accept='image/*' ref={fileRef} className='hidden' onChange={handleImage} />
                    </div>

                    {/* City & State */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                                <FaCity className='text-orange-500' size={14} /> City
                            </label>
                            <input
                                type="text"
                                placeholder='City'
                                className='w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)] text-sm'
                                onChange={(e) => setCity(e.target.value)}
                                value={city}
                            />
                        </div>
                        <div>
                            <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                                <FaMapMarkerAlt className='text-orange-500' size={14} /> State
                            </label>
                            <input
                                type="text"
                                placeholder='State'
                                className='w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)] text-sm'
                                onChange={(e) => setState(e.target.value)}
                                value={state}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                            <FaMapMarkerAlt className='text-orange-500' size={14} /> Address
                        </label>
                        <input
                            type="text"
                            placeholder='Street address, landmark...'
                            className='w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)] text-sm'
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                        />
                    </div>

                    {/* Error */}
                    {err && (
                        <div className='flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-sm font-medium'>
                            <span>⚠</span> {err}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type='submit'
                        className='w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-70'
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={22} color='white' /> : (myShopData ? "Save Changes" : "Create Shop 🚀")}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateEditShop
