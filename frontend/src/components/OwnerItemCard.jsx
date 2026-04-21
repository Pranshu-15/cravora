import axios from 'axios';
import React from 'react'
import { FaPen, FaTrashAlt, FaLeaf } from "react-icons/fa";
import { FaDrumstickBite, FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({ data }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleDelete = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true })
            dispatch(setMyShopData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    const isVeg = data.foodType === "veg"

    return (
        <div className='relative flex items-stretch gap-0 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 group w-full'>

            {/* Left accent bar */}
            <div className={`w-1.5 flex-shrink-0 ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />

            {/* Image */}
            <div className='relative flex-shrink-0 w-32 sm:w-40 overflow-hidden bg-[var(--bg-primary)]'>
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
                    <div className='flex items-center justify-between mb-1.5'>
                        {/* Category chip */}
                        {data.category && (
                            <span className='inline-block text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full'>
                                {data.category}
                            </span>
                        )}
                        {/* Rating */}
                        {data.rating?.average && (
                            <div className='flex items-center gap-1 bg-green-500/10 text-green-600 border border-green-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold'>
                                <span>{data.rating.average}</span>
                                <FaStar size={8} className='mb-[1px]' />
                            </div>
                        )}
                    </div>

                    <h2 className='text-base sm:text-lg font-extrabold text-[var(--text-primary)] leading-tight truncate' title={data.name}>
                        {data.name}
                    </h2>
                    
                    <div className='flex items-center gap-2 mt-2'>
                        <span className='font-black text-lg text-[var(--text-primary)]'>
                            ₹{data.price}
                        </span>
                    </div>
                </div>

                <div className='flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[var(--border-color)]'>
                    <button
                        className='flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] hover:text-orange-500 hover:bg-orange-500/10 border border-[var(--border-color)] hover:border-orange-500/30 transition-all cursor-pointer'
                        onClick={() => navigate(`/edit-item/${data._id}`)}
                    >
                        <FaPen size={12} /> Edit
                    </button>
                    <button
                        className='flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] hover:text-red-500 hover:bg-red-500/10 border border-[var(--border-color)] hover:border-red-500/30 transition-all cursor-pointer'
                        onClick={handleDelete}
                    >
                        <FaTrashAlt size={12} /> Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OwnerItemCard
