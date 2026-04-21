import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useSelector } from 'react-redux'
import { MdArrowBack, MdLocalShipping, MdLocationOn } from 'react-icons/md'
import { FaLeaf, FaDrumstickBite, FaUser, FaPhone } from 'react-icons/fa'
import Nav from '../components/Nav'
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'

const STATUS_STEPS = ['pending', 'preparing', 'out of delivery', 'delivered']

const STATUS_CONFIG = {
    pending:           { label: 'Order Placed',    icon: '📋', color: 'text-yellow-500' },
    preparing:         { label: 'Preparing',       icon: '👨‍🍳', color: 'text-blue-500' },
    'out of delivery': { label: 'Out for Delivery', icon: '🛵', color: 'text-orange-500' },
    delivered:         { label: 'Delivered',       icon: '✅', color: 'text-green-500' },
}

function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState()
    const navigate = useNavigate()
    const { socket } = useSelector(state => state.user)
    const [liveLocations, setLiveLocations] = useState({})

    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket?.on('updateDeliveryLocation', ({ deliveryBoyId, latitude, longitude }) => {
            setLiveLocations(prev => ({ ...prev, [deliveryBoyId]: { lat: latitude, lon: longitude } }))
        })
        return () => socket?.off('updateDeliveryLocation')
    }, [socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])

    return (
        <div className='min-h-screen bg-[var(--bg-primary)] transition-colors duration-300'>
            <Nav />
            <div className='pt-[80px]'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 py-8'>

                    {/* Header */}
                    <div className='flex items-center gap-4 mb-8'>
                        <button
                            onClick={() => navigate("/my-orders")}
                            className='flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 cursor-pointer shadow-sm'
                        >
                            <MdArrowBack size={20} />
                        </button>
                        <div>
                            <h1 className='text-3xl font-extrabold text-[var(--text-primary)]'>Track Order</h1>
                            {currentOrder && (
                                <p className='text-[var(--text-secondary)] text-sm mt-0.5'>Order #{currentOrder._id?.slice(-6).toUpperCase()}</p>
                            )}
                        </div>
                    </div>

                    {/* Delivery address summary */}
                    {currentOrder && (
                        <div className='flex items-start gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 mb-6 shadow-sm'>
                            <MdLocationOn className='text-red-500 flex-shrink-0 mt-0.5' size={22} />
                            <div>
                                <p className='text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1'>Delivering to</p>
                                <p className='text-[var(--text-primary)] font-semibold'>{currentOrder.deliveryAddress?.text}</p>
                            </div>
                        </div>
                    )}

                    {/* Shop orders */}
                    {currentOrder?.shopOrders?.map((shopOrder, index) => {
                        const stepIndex = STATUS_STEPS.indexOf(shopOrder.status)
                        return (
                            <div key={index} className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-sm overflow-hidden mb-6 animate-fade-in-up'>

                                {/* Shop header */}
                                <div className='flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]'>
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2 bg-orange-500/10 rounded-xl'>
                                            <MdLocalShipping className='text-orange-500' size={22} />
                                        </div>
                                        <p className='font-extrabold text-[var(--text-primary)] text-lg'>{shopOrder.shop?.name}</p>
                                    </div>
                                    {shopOrder.status === 'delivered' ? (
                                        <span className='bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-bold px-3 py-1.5 rounded-full'>✅ Delivered</span>
                                    ) : (
                                        <span className='bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse'>
                                            {STATUS_CONFIG[shopOrder.status]?.icon} {STATUS_CONFIG[shopOrder.status]?.label}
                                        </span>
                                    )}
                                </div>

                                <div className='px-6 py-5 flex flex-col gap-6'>

                                    {/* Progress tracker */}
                                    <div className='flex items-center gap-0'>
                                        {STATUS_STEPS.map((step, i) => {
                                            const done = i <= stepIndex
                                            const cfg = STATUS_CONFIG[step]
                                            return (
                                                <React.Fragment key={step}>
                                                    <div className='flex flex-col items-center gap-1.5 flex-shrink-0'>
                                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300
                                                            ${done
                                                                ? 'bg-gradient-to-br from-orange-500 to-rose-500 border-orange-500 shadow-lg shadow-orange-500/30'
                                                                : 'bg-[var(--bg-primary)] border-[var(--border-color)]'
                                                            }`}
                                                        >
                                                            {done
                                                                ? <span className='text-white text-xs font-black'>✓</span>
                                                                : <span className='text-base'>{cfg.icon}</span>
                                                            }
                                                        </div>
                                                        <p className={`text-[10px] font-bold text-center leading-tight max-w-[64px] ${done ? 'text-orange-500' : 'text-[var(--text-secondary)]'}`}>
                                                            {cfg.label}
                                                        </p>
                                                    </div>
                                                    {i < STATUS_STEPS.length - 1 && (
                                                        <div className={`flex-1 h-0.5 mb-5 mx-1 rounded-full transition-all duration-500 ${i < stepIndex ? 'bg-gradient-to-r from-orange-500 to-rose-500' : 'bg-[var(--border-color)]'}`} />
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </div>

                                    {/* Items */}
                                    <div>
                                        <p className='text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3'>Items</p>
                                        <div className='flex flex-wrap gap-2'>
                                            {shopOrder.shopOrderItems?.map((item, i) => (
                                                <span key={i} className='flex items-center gap-1.5 text-sm font-semibold bg-[var(--bg-primary)] border border-[var(--border-color)] px-3 py-1.5 rounded-full text-[var(--text-primary)]'>
                                                    {item.item?.foodType === 'veg' ? <FaLeaf className='text-green-500' size={10} /> : <FaDrumstickBite className='text-red-500' size={10} />}
                                                    {item.name} ×{item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                        <div className='flex justify-between items-center mt-3 pt-3 border-t border-[var(--border-color)]'>
                                            <span className='text-[var(--text-secondary)] text-sm'>Subtotal</span>
                                            <span className='font-extrabold text-orange-500 text-lg'>₹{shopOrder.subtotal}</span>
                                        </div>
                                    </div>

                                    {/* Delivery boy info */}
                                    {shopOrder.status !== 'delivered' && (
                                        <div className='bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-4'>
                                            {shopOrder.assignedDeliveryBoy ? (
                                                <div className='flex items-center gap-4'>
                                                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md flex-shrink-0'>
                                                        {shopOrder.assignedDeliveryBoy.fullName?.slice(0, 1)}
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wide mb-0.5'>Your Delivery Partner</p>
                                                        <p className='font-bold text-[var(--text-primary)]'>{shopOrder.assignedDeliveryBoy.fullName}</p>
                                                        <div className='flex items-center gap-1.5 text-[var(--text-secondary)] text-sm mt-0.5'>
                                                            <FaPhone size={11} />
                                                            <span>{shopOrder.assignedDeliveryBoy.mobile}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center animate-pulse'>
                                                        <FaUser className='text-orange-500' size={16} />
                                                    </div>
                                                    <div>
                                                        <p className='font-bold text-[var(--text-primary)] text-sm'>Finding a delivery partner…</p>
                                                        <p className='text-[var(--text-secondary)] text-xs'>This usually takes a minute</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Live Map */}
                                    {shopOrder.assignedDeliveryBoy && shopOrder.status !== 'delivered' && (
                                        <div>
                                            <p className='text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3'>Live Location</p>
                                            <div className='h-[320px] w-full rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-md'>
                                                <DeliveryBoyTracking data={{
                                                    deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                                                        lat: shopOrder.assignedDeliveryBoy.location?.coordinates[1],
                                                        lon: shopOrder.assignedDeliveryBoy.location?.coordinates[0]
                                                    },
                                                    customerLocation: {
                                                        lat: currentOrder.deliveryAddress?.latitude,
                                                        lon: currentOrder.deliveryAddress?.longitude
                                                    }
                                                }} />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default TrackOrderPage
