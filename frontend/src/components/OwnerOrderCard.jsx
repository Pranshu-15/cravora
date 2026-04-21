import axios from 'axios'
import React, { useState } from 'react'
import { MdPhone } from 'react-icons/md'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { updateOrderStatus } from '../redux/userSlice'
import { FaUser, FaMapMarkerAlt, FaLeaf, FaDrumstickBite } from 'react-icons/fa'
import { TbReceipt2 } from 'react-icons/tb'

const STATUS_OPTS = ['pending', 'preparing', 'out of delivery']

const STATUS_CONFIG = {
    pending:           { label: 'Pending',         color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
    preparing:         { label: 'Preparing',       color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    'out of delivery': { label: 'Out for Delivery', color: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
    delivered:         { label: 'Delivered',       color: 'bg-green-500/10 text-green-500 border-green-500/30' },
}

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([])
    const dispatch = useDispatch()

    const handleUpdateStatus = async (orderId, shopId, status) => {
        if (!status) return
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true })
            dispatch(updateOrderStatus({ orderId, shopId, status }))
            setAvailableBoys(result.data.availableBoys || [])
        } catch (error) {
            console.log(error)
        }
    }

    const currentStatus = data.shopOrders?.status
    const statusCfg = STATUS_CONFIG[currentStatus] || { label: currentStatus, color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' }

    return (
        <div className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden'>

            {/* Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-extrabold shadow-md'>
                        {data.user.fullName?.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <p className='font-extrabold text-[var(--text-primary)]'>{data.user.fullName}</p>
                        <p className='text-[var(--text-secondary)] text-xs'>{data.user.email}</p>
                    </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusCfg.color}`}>
                    {statusCfg.label}
                </span>
            </div>

            {/* Body */}
            <div className='px-6 py-5 flex flex-col gap-5'>

                {/* Contact + Payment */}
                <div className='flex flex-wrap gap-4'>
                    <div className='flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2 rounded-xl text-sm text-[var(--text-secondary)]'>
                        <MdPhone className='text-orange-500' size={16} />
                        <span className='font-medium text-[var(--text-primary)]'>{data.user.mobile}</span>
                    </div>
                    <div className='flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2 rounded-xl text-sm text-[var(--text-secondary)]'>
                        <TbReceipt2 className='text-blue-500' size={16} />
                        <span className='font-medium text-[var(--text-primary)]'>
                            {data.paymentMethod === 'online' ? (data.payment ? 'Paid Online' : 'Online (Unpaid)') : 'Cash on Delivery'}
                        </span>
                    </div>
                </div>

                {/* Delivery address */}
                <div className='flex items-start gap-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-4'>
                    <FaMapMarkerAlt className='text-red-500 flex-shrink-0 mt-0.5' size={16} />
                    <div>
                        <p className='text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1'>Delivery Address</p>
                        <p className='text-[var(--text-primary)] font-medium text-sm'>{data?.deliveryAddress?.text}</p>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <p className='text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3'>Ordered Items</p>
                    <div className='flex gap-3 overflow-x-auto pb-1 hide-scroll'>
                        {data.shopOrders?.shopOrderItems?.map((item, i) => (
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status update */}
                <div className='flex items-center justify-between gap-4 pt-3 border-t border-[var(--border-color)]'>
                    <div>
                        <p className='text-xs text-[var(--text-secondary)] font-medium'>Order Total</p>
                        <p className='font-extrabold text-orange-500 text-xl'>₹{data.shopOrders?.subtotal}</p>
                    </div>

                    <select
                        className='bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 cursor-pointer transition-all'
                        onChange={(e) => handleUpdateStatus(data._id, data.shopOrders?.shop?._id, e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Update Status</option>
                        {STATUS_OPTS.map(s => (
                            <option key={s} value={s} className='capitalize'>{STATUS_CONFIG[s]?.label}</option>
                        ))}
                    </select>
                </div>

                {/* Delivery boy info */}
                {currentStatus === 'out of delivery' && (
                    <div className='bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 text-sm'>
                        <p className='font-bold text-orange-500 mb-2'>
                            {data.shopOrders?.assignedDeliveryBoy ? '🛵 Assigned Delivery Partner' : '📡 Available Delivery Partners'}
                        </p>
                        {availableBoys?.length > 0 ? (
                            availableBoys.map((b, i) => (
                                <div key={i} className='flex items-center gap-2 text-[var(--text-primary)] font-medium'>
                                    <FaUser className='text-orange-400' size={12} />
                                    {b.fullName} · {b.mobile}
                                </div>
                            ))
                        ) : data.shopOrders?.assignedDeliveryBoy ? (
                            <div className='flex items-center gap-2 text-[var(--text-primary)] font-medium'>
                                <FaUser className='text-green-500' size={12} />
                                {data.shopOrders.assignedDeliveryBoy.fullName} · {data.shopOrders.assignedDeliveryBoy.mobile}
                            </div>
                        ) : (
                            <p className='text-[var(--text-secondary)]'>Waiting for a delivery partner to accept…</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OwnerOrderCard
