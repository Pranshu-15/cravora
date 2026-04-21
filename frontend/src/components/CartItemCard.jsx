import React from 'react'
import { FaMinus, FaPlus, FaLeaf, FaDrumstickBite } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useDispatch } from 'react-redux'
import { removeCartItem, updateQuantity } from '../redux/userSlice'

function CartItemCard({ data }) {
    const dispatch = useDispatch()

    const handleIncrease = (id, currentQty) => {
        dispatch(updateQuantity({ id, quantity: currentQty + 1 }))
    }
    const handleDecrease = (id, currentQty) => {
        if (currentQty > 1) {
            dispatch(updateQuantity({ id, quantity: currentQty - 1 }))
        }
    }

    return (
        <div className='flex items-center justify-between bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all duration-300 group'>
            {/* Left — image + info */}
            <div className='flex items-center gap-4 flex-1 min-w-0'>
                <div className='relative flex-shrink-0'>
                    <img
                        src={data.image}
                        alt={data.name}
                        className='w-20 h-20 object-cover rounded-xl border border-[var(--border-color)] group-hover:scale-105 transition-transform duration-300'
                    />
                    {/* Veg / Non-Veg indicator */}
                    <span className='absolute -top-1.5 -right-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full p-1 shadow-sm'>
                        {data.foodType === 'veg'
                            ? <FaLeaf className='text-green-500' size={10} />
                            : <FaDrumstickBite className='text-red-500' size={10} />
                        }
                    </span>
                </div>

                <div className='flex-1 min-w-0'>
                    <h3 className='font-bold text-[var(--text-primary)] text-base truncate'>{data.name}</h3>
                    <p className='text-sm text-[var(--text-secondary)] mt-0.5'>₹{data.price} per item</p>
                    <p className='font-extrabold text-orange-500 text-base mt-1'>₹{data.price * data.quantity}</p>
                </div>
            </div>

            {/* Right — controls */}
            <div className='flex items-center gap-3 flex-shrink-0 ml-4'>
                {/* Qty stepper */}
                <div className='flex items-center border border-[var(--border-color)] rounded-full overflow-hidden bg-[var(--bg-primary)]'>
                    <button
                        className='px-3 py-2 text-[var(--text-secondary)] hover:text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer'
                        onClick={() => handleDecrease(data.id, data.quantity)}
                    >
                        <FaMinus size={11} />
                    </button>
                    <span className='w-8 text-center font-bold text-[var(--text-primary)] text-sm'>{data.quantity}</span>
                    <button
                        className='px-3 py-2 text-[var(--text-secondary)] hover:text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer'
                        onClick={() => handleIncrease(data.id, data.quantity)}
                    >
                        <FaPlus size={11} />
                    </button>
                </div>

                {/* Delete */}
                <button
                    className='p-2.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer'
                    onClick={() => dispatch(removeCartItem(data.id))}
                >
                    <RiDeleteBin6Line size={18} />
                </button>
            </div>
        </div>
    )
}

export default CartItemCard
