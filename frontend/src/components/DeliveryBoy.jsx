import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FaMapMarkerAlt, FaBoxOpen, FaRupeeSign, FaMotorcycle, FaCheckCircle, FaUserCircle } from 'react-icons/fa'

function DeliveryBoy() {
    const { userData, socket } = useSelector(state => state.user)
    const [currentOrder, setCurrentOrder] = useState()
    const [showOtpBox, setShowOtpBox] = useState(false)
    const [availableAssignments, setAvailableAssignments] = useState(null)
    const [otp, setOtp] = useState("")
    const [todayDeliveries, setTodayDeliveries] = useState([])
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!socket || userData.role !== "deliveryBoy") return
        let watchId
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition((position) => {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude
                setDeliveryBoyLocation({ lat: latitude, lon: longitude })
                socket.emit('updateLocation', {
                    latitude,
                    longitude,
                    userId: userData._id
                })
            },
                (error) => {
                    console.log(error)
                },
                {
                    enableHighAccuracy: true
                }
            )
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId)
        }
    }, [socket, userData])

    const ratePerDelivery = 50
    const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)

    const getAssignments = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
            setAvailableAssignments(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getCurrentOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const acceptOrder = async (assignmentId) => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
            console.log(result.data)
            await getCurrentOrder()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket?.on('newAssignment', (data) => {
            setAvailableAssignments(prev => ([...prev, data]))
        })
        return () => {
            socket?.off('newAssignment')
        }
    }, [socket])

    const sendOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
                orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
            }, { withCredentials: true })
            setLoading(false)
            setShowOtpBox(true)
            console.log(result.data)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const verifyOtp = async () => {
        setMessage("")
        try {
            const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
                orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp: otp.trim()
            }, { withCredentials: true })
            console.log(result.data)
            setMessage(result.data.message)
            setTimeout(() => {
                location.reload()
            }, 1000)
        } catch (error) {
            console.log(error)
            setMessage(error.response?.data?.message || "Invalid or Expired OTP")
        }
    }

    const handleTodayDeliveries = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true })
            console.log(result.data)
            setTodayDeliveries(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAssignments()
        getCurrentOrder()
        handleTodayDeliveries()
    }, [userData])

    // Custom Tooltip for Recharts to support dark mode
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 rounded-lg shadow-xl">
                    <p className="text-[var(--text-secondary)] text-xs mb-1 font-semibold">{`${label}:00`}</p>
                    <p className="text-orange-500 font-extrabold text-sm">{`${payload[0].value} Deliveries`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='w-full min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 pb-20'>
            <Nav />

            <div className='pt-[90px] max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-6 animate-fade-in-up'>
                
                {/* Header Welcome */}
                <div className='bg-[var(--bg-secondary)] rounded-3xl shadow-sm border border-[var(--border-color)] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 w-full'>
                    <div className='flex items-center gap-4 text-center sm:text-left'>
                        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-lg flex-shrink-0'>
                            <FaMotorcycle size={28} />
                        </div>
                        <div>
                            <h1 className='text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]'>Welcome back, {userData.fullName}</h1>
                            <p className='text-[var(--text-secondary)] text-sm flex items-center justify-center sm:justify-start gap-1.5 mt-1'>
                                <FaMapMarkerAlt className='text-orange-500' />
                                {deliveryBoyLocation ? `${deliveryBoyLocation.lat.toFixed(4)}, ${deliveryBoyLocation.lon.toFixed(4)}` : 'Fetching location...'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    
                    {/* Left Column (Chart & Earnings) */}
                    <div className='lg:col-span-1 flex flex-col gap-6'>
                        {/* Earning Card */}
                        <div className='bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden'>
                            <div className='relative z-10'>
                                <h1 className='text-white/80 font-semibold text-sm uppercase tracking-wider mb-1'>Today's Earnings</h1>
                                <div className='flex items-baseline gap-1'>
                                    <span className='text-4xl font-black'>₹{totalEarning}</span>
                                </div>
                            </div>
                            <FaRupeeSign className='absolute -right-4 -bottom-6 text-white/20 w-32 h-32' />
                        </div>

                        {/* Chart */}
                        <div className='bg-[var(--bg-secondary)] rounded-3xl shadow-sm p-6 border border-[var(--border-color)]'>
                            <h1 className='text-lg font-bold mb-6 text-[var(--text-primary)] flex items-center gap-2'>
                                <FaCheckCircle className='text-orange-500' /> Deliveries Over Time
                            </h1>
                            <div className='h-[200px] w-full'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={todayDeliveries} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border-color)', opacity: 0.4 }} />
                                        <Bar dataKey="count" fill='#f97316' radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Orders & Map) */}
                    <div className='lg:col-span-2 flex flex-col gap-6'>
                        
                        {/* No Current Order - Show Available Assignments */}
                        {!currentOrder && (
                            <div className='bg-[var(--bg-secondary)] rounded-3xl p-6 sm:p-8 shadow-sm border border-[var(--border-color)]'>
                                <h1 className='text-xl font-bold mb-6 text-[var(--text-primary)] flex items-center gap-2'>
                                    <FaBoxOpen className='text-orange-500' /> Available Orders
                                </h1>

                                <div className='flex flex-col gap-4'>
                                    {availableAssignments?.length > 0 ? (
                                        availableAssignments.map((a, index) => (
                                            <div key={index} className='bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-orange-500/50 transition-colors group'>
                                                <div className='flex flex-col'>
                                                    <p className='text-lg font-extrabold text-[var(--text-primary)] group-hover:text-orange-500 transition-colors'>{a?.shopName}</p>
                                                    <p className='text-sm text-[var(--text-secondary)] mt-1 flex items-start gap-1.5'>
                                                        <FaMapMarkerAlt className='text-red-500 mt-1 flex-shrink-0' />
                                                        <span>{a?.deliveryAddress.text}</span>
                                                    </p>
                                                    <div className='flex items-center gap-3 mt-3'>
                                                        <span className='bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold px-3 py-1 rounded-full'>
                                                            {a.items.length} items
                                                        </span>
                                                        <span className='text-orange-500 font-extrabold text-sm'>₹{a.subtotal}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className='w-full sm:w-auto bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all cursor-pointer'
                                                    onClick={() => acceptOrder(a.assignmentId)}
                                                >
                                                    Accept Order
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='py-12 flex flex-col items-center justify-center text-center'>
                                            <div className='w-16 h-16 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-4'>
                                                <FaBoxOpen size={24} className='text-[var(--text-secondary)] opacity-50' />
                                            </div>
                                            <p className='text-[var(--text-primary)] font-semibold'>No pending orders right now</p>
                                            <p className='text-[var(--text-secondary)] text-sm mt-1'>Stay online, new orders will appear here.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Current Order Active */}
                        {currentOrder && (
                            <div className='bg-[var(--bg-secondary)] rounded-3xl overflow-hidden shadow-sm border border-[var(--border-color)] flex flex-col'>
                                
                                {/* Current Order Header */}
                                <div className='bg-orange-500/10 border-b border-[var(--border-color)] p-6'>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <div className='w-2 h-2 rounded-full bg-orange-500 animate-pulse' />
                                        <h2 className='text-lg font-extrabold text-orange-500 uppercase tracking-wide'>Active Delivery</h2>
                                    </div>
                                    <div className='bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-4 mt-4 flex flex-col sm:flex-row justify-between gap-4'>
                                        <div>
                                            <p className='text-sm text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1'>Pickup</p>
                                            <p className='font-bold text-[var(--text-primary)] text-lg'>{currentOrder?.shopOrder.shop.name}</p>
                                        </div>
                                        <div className='hidden sm:block w-px bg-[var(--border-color)]' />
                                        <div>
                                            <p className='text-sm text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1'>Drop-off</p>
                                            <p className='font-medium text-[var(--text-primary)] text-sm flex items-start gap-1'>
                                                <FaMapMarkerAlt className='text-red-500 mt-1 flex-shrink-0' />
                                                <span>{currentOrder.deliveryAddress.text}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center mt-4 px-1'>
                                        <span className='text-[var(--text-secondary)] font-semibold text-sm'>{currentOrder.shopOrder.shopOrderItems.length} items</span>
                                        <span className='text-[var(--text-primary)] font-extrabold text-lg'>₹{currentOrder.shopOrder.subtotal}</span>
                                    </div>
                                </div>

                                {/* Map */}
                                <div className='h-[350px] w-full relative z-0 p-3'>
                                    <DeliveryBoyTracking data={{
                                        deliveryBoyLocation: deliveryBoyLocation || {
                                            lat: userData.location.coordinates[1],
                                            lon: userData.location.coordinates[0]
                                        },
                                        customerLocation: {
                                            lat: currentOrder.deliveryAddress.latitude,
                                            lon: currentOrder.deliveryAddress.longitude
                                        }
                                    }} />
                                </div>

                                {/* Actions */}
                                <div className='p-6 bg-[var(--bg-primary)] relative z-10 border-t border-[var(--border-color)]'>
                                    {!showOtpBox ? (
                                        <button
                                            className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex justify-center items-center text-lg'
                                            onClick={sendOtp}
                                            disabled={loading}
                                        >
                                            {loading ? <ClipLoader size={24} color='white' /> : "Reached Destination & Send OTP"}
                                        </button>
                                    ) : (
                                        <div className='p-5 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] shadow-inner'>
                                            <div className='flex items-center gap-3 mb-4'>
                                                <div className='w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500'>
                                                    <FaUserCircle size={24} />
                                                </div>
                                                <div>
                                                    <p className='text-sm text-[var(--text-secondary)] font-medium'>Ask customer for OTP</p>
                                                    <p className='font-bold text-[var(--text-primary)]'>{currentOrder.user.fullName}</p>
                                                </div>
                                            </div>

                                            <div className='flex flex-col gap-3'>
                                                <input
                                                    type="text"
                                                    className='w-full border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-3 text-center text-xl tracking-[0.5em] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)] placeholder:tracking-normal'
                                                    placeholder='Enter OTP'
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    value={otp}
                                                    maxLength={6}
                                                />
                                                {message && <p className={`text-center font-bold py-2 rounded-lg ${message.includes('Successfully') ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>{message}</p>}

                                                <button
                                                    className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all cursor-pointer"
                                                    onClick={verifyOtp}
                                                >
                                                    Verify & Complete Delivery
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveryBoy
