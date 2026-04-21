import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { FaStar, FaLeaf, FaDrumstickBite } from 'react-icons/fa'
import { TbReceipt2 } from 'react-icons/tb'
import { MdNavigateNext, MdCreditCard, MdLocalShipping } from 'react-icons/md'

const STATUS_CONFIG = {
    pending:         { label: 'Pending',         color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
    preparing:       { label: 'Preparing',       color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    'out of delivery': { label: 'Out for Delivery', color: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
    delivered:       { label: 'Delivered',       color: 'bg-green-500/10 text-green-500 border-green-500/30' },
}

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({})

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const handleRating = async (itemId, rating) => {
        try {
            await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({ ...prev, [itemId]: rating }))
        } catch (error) {
            console.log(error)
        }
    }

    const overallStatus = data.shopOrders?.[0]?.status
    const statusCfg = STATUS_CONFIG[overallStatus] || { label: overallStatus, color: 'bg-gray-500/10 text-gray-500 border-gray-500/30' }

    return (
        <div className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden'>

            {/* Card Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-orange-500/10 rounded-xl'>
                        <TbReceipt2 className='text-orange-500' size={20} />
                    </div>
                    <div>
                        <p className='font-extrabold text-[var(--text-primary)] text-sm'>Order #{data._id.slice(-6).toUpperCase()}</p>
                        <p className='text-[var(--text-secondary)] text-xs mt-0.5'>{formatDate(data.createdAt)}</p>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    {/* Payment badge */}
                    <span className='flex items-center gap-1.5 text-xs font-bold bg-[var(--bg-primary)] border border-[var(--border-color)] px-3 py-1.5 rounded-full text-[var(--text-secondary)]'>
                        {data.paymentMethod === 'online' ? <MdCreditCard size={13} /> : <MdLocalShipping size={13} />}
                        {data.paymentMethod === 'online' ? (data.payment ? 'Paid' : 'Unpaid') : 'COD'}
                    </span>
                    {/* Status badge */}
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusCfg.color}`}>
                        {statusCfg.label}
                    </span>
                </div>
            </div>

            {/* Shop Orders */}
            <div className='px-6 py-4 flex flex-col gap-5'>
                {data.shopOrders.map((shopOrder, idx) => (
                    <div key={idx} className='flex flex-col gap-3'>
                        {/* Shop name */}
                        <p className='font-bold text-[var(--text-primary)] text-base border-b border-[var(--border-color)] pb-2'>
                            🏪 {shopOrder.shop?.name}
                        </p>

                        {/* Items horizontal scroll */}
                        <div className='flex gap-3 overflow-x-auto pb-2 hide-scroll'>
                            {shopOrder.shopOrderItems.map((item, i) => (
                                <div key={i} className='flex-shrink-0 w-36 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl overflow-hidden'>
                                    <div className='relative h-24 overflow-hidden'>
                                        <img src={item.item?.image} alt={item.name} className='w-full h-full object-cover' />
                                        <span className='absolute top-1.5 left-1.5 bg-[var(--bg-secondary)]/90 backdrop-blur-sm rounded-full p-1 shadow'>
                                            {item.item?.foodType === 'veg'
                                                ? <FaLeaf className='text-green-500' size={9} />
                                                : <FaDrumstickBite className='text-red-500' size={9} />
                                            }
                                        </span>
                                    </div>
                                    <div className='p-2'>
                                        <p className='text-xs font-bold text-[var(--text-primary)] truncate'>{item.name}</p>
                                        <p className='text-xs text-[var(--text-secondary)] mt-0.5'>×{item.quantity} · ₹{item.price}</p>

                                        {/* Star rating (only if delivered) */}
                                        {shopOrder.status === 'delivered' && (
                                            <div className='flex gap-0.5 mt-1.5'>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleRating(item.item._id, star)}
                                                        className={`text-base cursor-pointer transition-transform hover:scale-125 ${selectedRating[item.item._id] >= star ? 'text-yellow-400' : 'text-[var(--border-color)]'}`}
                                                    >
                                                        <FaStar size={12} />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Subtotal row */}
                        <div className='flex items-center justify-between'>
                            <span className='text-[var(--text-secondary)] text-sm'>Subtotal</span>
                            <span className='font-bold text-[var(--text-primary)]'>₹{shopOrder.subtotal}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className='flex items-center justify-between px-6 py-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)]'>
                <div>
                    <p className='text-[var(--text-secondary)] text-xs'>Grand Total</p>
                    <p className='font-extrabold text-orange-500 text-xl'>₹{data.totalAmount}</p>
                </div>
                <button
                    onClick={() => navigate(`/track-order/${data._id}`)}
                    className='flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-orange-500/25 hover:scale-105 transition-all cursor-pointer'
                >
                    Track Order <MdNavigateNext size={18} />
                </button>
            </div>
        </div>
    )
}

export default UserOrderCard
