import React, { useState } from 'react'
import { FaLeaf, FaDrumstickBite, FaStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa"
import { FaRegStar } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/userSlice'

// ── Grid Card (existing) ────────────────────────────────────────
export function FoodCard({ data }) {
    const [quantity, setQuantity] = useState(0)
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.user)

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) =>
            i < rating
                ? <FaStar key={i} className='text-yellow-400 text-lg drop-shadow-sm' />
                : <FaRegStar key={i} className='text-gray-300 dark:text-gray-600 text-lg' />
        )
    }

    const inCart = cartItems.some(i => i.id === data._id)

    return (
        <div className='w-[260px] rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group'>
            <div className='relative w-full h-[180px] flex justify-center items-center bg-[var(--bg-primary)] overflow-hidden'>
                <div className='absolute top-3 right-3 bg-[var(--bg-secondary)]/90 backdrop-blur-sm rounded-full p-2 shadow-md z-10'>
                    {data.foodType === "veg" ? <FaLeaf className='text-green-500 text-lg' /> : <FaDrumstickBite className='text-red-500 text-lg' />}
                </div>
                <img src={data.image} alt={data.name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>

            <div className="flex-1 flex flex-col p-5">
                <h1 className='font-bold text-[var(--text-primary)] text-lg truncate mb-1'>{data.name}</h1>
                <div className='flex items-center gap-1 mt-1'>
                    {renderStars(data.rating?.average || 0)}
                    <span className='text-sm text-[var(--text-secondary)] font-medium ml-1'>({data.rating?.count || 0})</span>
                </div>
            </div>

            <div className='flex items-center justify-between mt-auto p-5 pt-0'>
                <span className='font-extrabold text-[var(--color-primary)] text-xl drop-shadow-sm'>₹{data.price}</span>
                <div className='flex items-center border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-full overflow-hidden shadow-sm'>
                    <button className='px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors cursor-pointer' onClick={() => quantity > 0 && setQuantity(q => q - 1)}>
                        <FaMinus size={12} />
                    </button>
                    <span className='w-6 text-center font-bold text-[var(--text-primary)]'>{quantity}</span>
                    <button className='px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors cursor-pointer' onClick={() => setQuantity(q => q + 1)}>
                        <FaPlus size={12} />
                    </button>
                    <button
                        className={`${inCart ? "bg-green-500 hover:bg-green-600" : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"} text-white px-4 py-2 transition-all cursor-pointer`}
                        onClick={() => quantity > 0 && dispatch(addToCart({ id: data._id, name: data.name, price: data.price, image: data.image, shop: data.shop, quantity, foodType: data.foodType }))}
                    >
                        <FaShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Tile / List Card (redesigned) ──────────────────────────────
export function FoodTileCard({ data }) {
    const [quantity, setQuantity] = useState(0)
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.user)
    const inCart = cartItems.some(i => i.id === data._id)
    const isVeg = data.foodType === "veg"

    return (
        <div className='relative flex items-stretch gap-0 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 group w-full'>

            {/* Left accent bar */}
            <div className={`w-1 flex-shrink-0 ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />

            {/* Image */}
            <div className='relative flex-shrink-0 w-28 sm:w-36 overflow-hidden'>
                <img
                    src={data.image}
                    alt={data.name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                {/* Veg/NonVeg badge */}
                <span className={`absolute top-2 left-2 flex items-center gap-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md ${isVeg ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isVeg ? <FaLeaf size={8} /> : <FaDrumstickBite size={8} />}
                    {isVeg ? 'VEG' : 'NON-VEG'}
                </span>
                {/* Dark overlay on hover */}
                <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>

            {/* Info */}
            <div className='flex-1 flex flex-col justify-between p-4 min-w-0'>
                <div>
                    {/* Category chip */}
                    {data.category && (
                        <span className='inline-block text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full mb-1.5'>
                            {data.category}
                        </span>
                    )}
                    <h3 className='font-extrabold text-[var(--text-primary)] text-base sm:text-lg leading-tight truncate'>{data.name}</h3>
                    <div className='flex items-center gap-1.5 mt-1'>
                        <div className='flex items-center gap-0.5 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full'>
                            <FaStar className='text-yellow-400' size={11} />
                            <span className='text-xs font-bold text-yellow-600 dark:text-yellow-400'>{data.rating?.average || "0.0"}</span>
                        </div>
                        <span className='text-[var(--text-secondary)] text-xs'>({data.rating?.count || 0} ratings)</span>
                    </div>
                </div>

                {/* Price + Controls row */}
                <div className='flex items-center justify-between mt-3 gap-3 flex-wrap'>
                    <div>
                        <p className='text-2xl font-black text-[var(--text-primary)]'>
                            ₹<span className='text-orange-500'>{data.price}</span>
                        </p>
                    </div>

                    <div className='flex items-center gap-2'>
                        {/* Qty stepper */}
                        <div className='flex items-center bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl overflow-hidden'>
                            <button
                                className='w-8 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer text-sm font-bold'
                                onClick={() => quantity > 0 && setQuantity(q => q - 1)}
                            >
                                <FaMinus size={10} />
                            </button>
                            <span className='w-8 text-center font-extrabold text-[var(--text-primary)] text-sm'>{quantity}</span>
                            <button
                                className='w-8 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer text-sm font-bold'
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                <FaPlus size={10} />
                            </button>
                        </div>

                        {/* Add to cart */}
                        <button
                            onClick={() => quantity > 0 && dispatch(addToCart({ id: data._id, name: data.name, price: data.price, image: data.image, shop: data.shop, quantity, foodType: data.foodType }))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 active:scale-95
                                ${inCart ? 'bg-green-500 hover:bg-green-600 shadow-green-500/25' : 'bg-gradient-to-r from-orange-500 to-rose-500 shadow-orange-500/25'}`}
                        >
                            <FaShoppingCart size={13} />
                            <span className='hidden sm:inline'>{inCart ? 'Added' : 'Add'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Default export kept for backward compat
export default FoodCard
