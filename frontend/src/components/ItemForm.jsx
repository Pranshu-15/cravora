import React, { useState, useRef, useEffect } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaLeaf, FaDrumstickBite } from "react-icons/fa";
import { MdPhotoCamera, MdFastfood, MdAttachMoney } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

const CATEGORIES = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers",
    "Sandwiches", "South Indian", "North Indian", "Chinese", "Fast Food",
    "Others", "Biryani", "Mughlai", "Starters", "Sides", "Tandoori",
    "Breads", "Thai", "Soups", "Rolls", "Wraps", "Waffles",
    "Pancakes", "Crepes", "Pasta", "Kebabs", "Rajasthani",
    "Smoothies", "Shakes", "Bowls", "Juices", "Salads", "Sushi", "Ramen"
]

// Shared form for both AddItem and EditItem
function ItemForm({ mode = "add" }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { itemId } = useParams()
    const fileRef = useRef()

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("veg")
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(mode === "edit")

    // For edit mode — load existing item
    useEffect(() => {
        if (mode !== "edit" || !itemId) return
        const fetchItem = async () => {
            try {
                const { data } = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true })
                setName(data.name || "")
                setPrice(data.price || "")
                setCategory(data.category || "")
                setFoodType(data.foodType || "veg")
                setFrontendImage(data.image || null)
            } catch (err) {
                console.log(err)
            } finally {
                setFetchLoading(false)
            }
        }
        fetchItem()
    }, [itemId, mode])

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("foodType", foodType)
            formData.append("price", price)
            if (backendImage) formData.append("image", backendImage)

            const url = mode === "edit"
                ? `${serverUrl}/api/item/edit-item/${itemId}`
                : `${serverUrl}/api/item/add-item`

            const { data } = await axios.post(url, formData, { withCredentials: true })
            dispatch(setMyShopData(data))
            navigate("/")
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const inputClass = `w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]
        rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
        transition-all duration-200 placeholder:text-[var(--text-secondary)] text-sm`

    if (fetchLoading) {
        return (
            <div className='min-h-screen w-full bg-[var(--bg-primary)] flex items-center justify-center'>
                <ClipLoader size={40} color='#f97316' />
            </div>
        )
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

                {/* Header */}
                <div className='bg-gradient-to-r from-orange-500 to-rose-500 p-6 flex items-center gap-4'>
                    <div className='bg-white/20 backdrop-blur-sm p-3 rounded-xl'>
                        <MdFastfood className='text-white w-7 h-7' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-extrabold text-white'>
                            {mode === "edit" ? "Edit Food Item" : "Add Food Item"}
                        </h1>
                        <p className='text-white/70 text-sm mt-0.5'>
                            {mode === "edit" ? "Update this item's details" : "Add a new dish to your menu"}
                        </p>
                    </div>
                </div>

                <form className='p-6 sm:p-8 space-y-5' onSubmit={handleSubmit}>

                    {/* Name */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                            <MdFastfood className='text-orange-500' size={16} /> Item Name
                        </label>
                        <input
                            type="text"
                            placeholder='e.g. Butter Chicken, Margherita Pizza'
                            className={inputClass}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                            <MdPhotoCamera className='text-orange-500' size={16} /> Food Photo
                        </label>
                        <div
                            className='w-full border-2 border-dashed border-[var(--border-color)] rounded-xl overflow-hidden cursor-pointer hover:border-orange-500 transition-colors'
                            onClick={() => fileRef.current.click()}
                        >
                            {frontendImage ? (
                                <div className='relative'>
                                    <img src={frontendImage} alt="preview" className='w-full h-48 object-cover' />
                                    <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                                        <span className='text-white font-semibold text-sm flex items-center gap-2'>
                                            <MdPhotoCamera size={20} /> Change Photo
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className='h-36 flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)]'>
                                    <MdPhotoCamera size={32} className='text-orange-400' />
                                    <p className='text-sm font-medium'>Click to upload food photo</p>
                                    <p className='text-xs opacity-60'>PNG, JPG, WEBP up to 10MB</p>
                                </div>
                            )}
                        </div>
                        <input type="file" accept='image/*' ref={fileRef} className='hidden' onChange={handleImage} />
                    </div>

                    {/* Price */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                            <MdAttachMoney className='text-orange-500' size={16} /> Price (₹)
                        </label>
                        <input
                            type="number"
                            placeholder='e.g. 199'
                            className={inputClass}
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            min={0}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2'>
                            <BiCategory className='text-orange-500' size={16} /> Category
                        </label>
                        <select
                            className={inputClass}
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Food Type — pill toggle */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3'>
                            Food Type
                        </label>
                        <div className='grid grid-cols-2 gap-3'>
                            <button
                                type="button"
                                onClick={() => setFoodType("veg")}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                                    ${foodType === "veg"
                                        ? "border-green-500 bg-green-500/10 text-green-600"
                                        : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-green-400"
                                    }`}
                            >
                                <FaLeaf size={14} /> Vegetarian
                            </button>
                            <button
                                type="button"
                                onClick={() => setFoodType("non veg")}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                                    ${foodType === "non veg"
                                        ? "border-red-500 bg-red-500/10 text-red-500"
                                        : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-red-400"
                                    }`}
                            >
                                <FaDrumstickBite size={14} /> Non-Veg
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type='submit'
                        className='w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-70'
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={22} color='white' /> : (mode === "edit" ? "Save Changes" : "Add to Menu 🍽️")}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ItemForm
