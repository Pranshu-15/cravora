import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5"
import { TbCurrentLocation } from "react-icons/tb"
import { IoLocationSharp } from "react-icons/io5"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice'
import { MdDeliveryDining, MdArrowBack } from "react-icons/md"
import { FaCreditCard, FaLeaf, FaDrumstickBite, FaLock, FaShieldAlt } from "react-icons/fa"
import axios from 'axios'
import { FaMobileScreenButton } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { addMyOrder } from '../redux/userSlice'
import Nav from '../components/Nav'

function RecenterMap({ location }) {
    if (location.lat && location.lon) {
        const map = useMap()
        map.setView([location.lat, location.lon], 16, { animate: true })
    }
    return null
}

function CheckOut() {
    const { location, address } = useSelector(state => state.map)
    const { cartItems, totalAmount, userData } = useSelector(state => state.user)
    const [addressInput, setAddressInput] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("cod")
    const [isPlacing, setIsPlacing] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const apiKey = import.meta.env.VITE_GEOAPIKEY

    const deliveryFee = totalAmount > 500 ? 0 : 40
    const tax = Math.round(totalAmount * 0.05)
    const grandTotal = totalAmount + deliveryFee + tax

    const onDragEnd = (e) => {
        const { lat, lng } = e.target._latlng
        dispatch(setLocation({ lat, lon: lng }))
        getAddressByLatLng(lat, lng)
    }

    const getCurrentLocation = () => {
        const latitude = userData.location.coordinates[1]
        const longitude = userData.location.coordinates[0]
        dispatch(setLocation({ lat: latitude, lon: longitude }))
        getAddressByLatLng(latitude, longitude)
    }

    const getAddressByLatLng = async (lat, lng) => {
        try {
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
            dispatch(setAddress(result?.data?.results[0].address_line2))
        } catch (error) {
            console.log(error)
        }
    }

    const getLatLngByAddress = async () => {
        try {
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
            const { lat, lon } = result.data.features[0].properties
            dispatch(setLocation({ lat, lon }))
        } catch (error) {
            console.log(error)
        }
    }

    const handlePlaceOrder = async () => {
        try {
            setIsPlacing(true)
            const result = await axios.post(`${serverUrl}/api/order/place-order`, {
                paymentMethod,
                deliveryAddress: {
                    text: addressInput,
                    latitude: location.lat,
                    longitude: location.lon
                },
                totalAmount: grandTotal,
                cartItems
            }, { withCredentials: true })

            if (paymentMethod === "cod") {
                dispatch(addMyOrder(result.data))
                navigate("/order-placed")
            } else {
                const orderId = result.data.orderId
                const razorOrder = result.data.razorOrder
                openRazorpayWindow(orderId, razorOrder)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsPlacing(false)
        }
    }

    const openRazorpayWindow = (orderId, razorOrder) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorOrder.amount,
            currency: 'INR',
            name: "Cravora",
            description: "Food Delivery",
            order_id: razorOrder.id,
            handler: async function (response) {
                try {
                    const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        orderId
                    }, { withCredentials: true })
                    dispatch(addMyOrder(result.data))
                    navigate("/order-placed")
                } catch (error) {
                    console.log(error)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    useEffect(() => {
        setAddressInput(address)
    }, [address])

    return (
        <div className='min-h-screen bg-[var(--bg-primary)] transition-colors duration-300'>
            <Nav />

            <div className='pt-[80px]'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

                    {/* Page Header */}
                    <div className='flex items-center gap-4 mb-10'>
                        <button
                            onClick={() => navigate("/cart")}
                            className='flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 cursor-pointer shadow-sm'
                        >
                            <MdArrowBack size={20} />
                        </button>
                        <div>
                            <h1 className='text-3xl font-extrabold text-[var(--text-primary)]'>Checkout</h1>
                            <p className='text-[var(--text-secondary)] text-sm mt-0.5'>Complete your order</p>
                        </div>
                    </div>

                    <div className='flex flex-col lg:flex-row gap-8 items-start'>

                        {/* ── LEFT — Main Sections ─────────────────── */}
                        <div className='flex-1 flex flex-col gap-6'>

                            {/* Section 1 — Delivery Location */}
                            <div className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-sm overflow-hidden'>
                                <div className='flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[var(--border-color)]'>
                                    <div className='p-2 bg-orange-500/10 rounded-xl'>
                                        <IoLocationSharp className='text-orange-500' size={22} />
                                    </div>
                                    <div>
                                        <h2 className='font-extrabold text-[var(--text-primary)] text-lg'>Delivery Location</h2>
                                        <p className='text-[var(--text-secondary)] text-sm'>Set your delivery address on the map</p>
                                    </div>
                                </div>

                                <div className='px-6 py-5 space-y-4'>
                                    {/* Address input row */}
                                    <div className='flex gap-2'>
                                        <input
                                            type="text"
                                            className='flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all'
                                            placeholder='Enter your delivery address...'
                                            value={addressInput}
                                            onChange={(e) => setAddressInput(e.target.value)}
                                        />
                                        <button
                                            className='flex items-center justify-center px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shadow-sm cursor-pointer'
                                            onClick={getLatLngByAddress}
                                            title="Search"
                                        >
                                            <IoSearchOutline size={18} />
                                        </button>
                                        <button
                                            className='flex items-center justify-center px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shadow-sm cursor-pointer'
                                            onClick={getCurrentLocation}
                                            title="Use current location"
                                        >
                                            <TbCurrentLocation size={18} />
                                        </button>
                                    </div>

                                    {/* Map */}
                                    <div className='rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-inner' style={{ height: '280px' }}>
                                        {location?.lat && location?.lon && (
                                            <MapContainer className="w-full h-full" center={[location.lat, location.lon]} zoom={16}>
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <RecenterMap location={location} />
                                                <Marker position={[location.lat, location.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
                                            </MapContainer>
                                        )}
                                    </div>
                                    <p className='text-xs text-[var(--text-secondary)] text-center'>
                                        📍 Drag the pin to adjust your exact delivery location
                                    </p>
                                </div>
                            </div>

                            {/* Section 2 — Payment Method */}
                            <div className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-sm overflow-hidden'>
                                <div className='flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[var(--border-color)]'>
                                    <div className='p-2 bg-purple-500/10 rounded-xl'>
                                        <FaCreditCard className='text-purple-500' size={20} />
                                    </div>
                                    <div>
                                        <h2 className='font-extrabold text-[var(--text-primary)] text-lg'>Payment Method</h2>
                                        <p className='text-[var(--text-secondary)] text-sm'>Choose how you want to pay</p>
                                    </div>
                                </div>

                                <div className='px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    {/* COD */}
                                    <button
                                        onClick={() => setPaymentMethod("cod")}
                                        className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 cursor-pointer hover:scale-[1.02]
                                            ${paymentMethod === "cod"
                                                ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                                                : "border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-orange-500/40"
                                            }`}
                                    >
                                        <span className='flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20'>
                                            <MdDeliveryDining className='text-green-500' size={26} />
                                        </span>
                                        <div>
                                            <p className='font-bold text-[var(--text-primary)]'>Cash on Delivery</p>
                                            <p className='text-xs text-[var(--text-secondary)] mt-0.5'>Pay when your food arrives</p>
                                        </div>
                                        {paymentMethod === "cod" && (
                                            <span className='ml-auto w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0'>✓</span>
                                        )}
                                    </button>

                                    {/* Online */}
                                    <button
                                        onClick={() => setPaymentMethod("online")}
                                        className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 cursor-pointer hover:scale-[1.02]
                                            ${paymentMethod === "online"
                                                ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                                                : "border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-orange-500/40"
                                            }`}
                                    >
                                        <span className='flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20'>
                                            <FaMobileScreenButton className='text-blue-500' size={22} />
                                        </span>
                                        <div>
                                            <p className='font-bold text-[var(--text-primary)]'>UPI / Card</p>
                                            <p className='text-xs text-[var(--text-secondary)] mt-0.5'>Pay securely online via Razorpay</p>
                                        </div>
                                        {paymentMethod === "online" && (
                                            <span className='ml-auto w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0'>✓</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT — Order Summary ─────────────────── */}
                        <div className='w-full lg:w-[380px] flex-shrink-0 sticky top-24 flex flex-col gap-4'>

                            {/* Items list */}
                            <div className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-sm overflow-hidden'>
                                <div className='bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-5'>
                                    <h2 className='text-white font-extrabold text-xl'>Order Summary</h2>
                                    <p className='text-white/80 text-sm mt-0.5'>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
                                </div>

                                <div className='px-6 py-4 space-y-3 max-h-[220px] overflow-y-auto'>
                                    {cartItems.map((item, index) => (
                                        <div key={index} className='flex items-center justify-between gap-3'>
                                            <div className='flex items-center gap-2 min-w-0'>
                                                {item.foodType === 'veg'
                                                    ? <FaLeaf className='text-green-500 flex-shrink-0' size={11} />
                                                    : <FaDrumstickBite className='text-red-500 flex-shrink-0' size={11} />
                                                }
                                                <span className='text-sm text-[var(--text-primary)] truncate'>{item.name}</span>
                                                <span className='text-xs text-[var(--text-secondary)] flex-shrink-0'>×{item.quantity}</span>
                                            </div>
                                            <span className='font-semibold text-[var(--text-primary)] text-sm flex-shrink-0'>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className='border-t border-[var(--border-color)] px-6 py-5 space-y-3'>
                                    <div className='flex justify-between text-sm text-[var(--text-secondary)]'>
                                        <span>Subtotal</span>
                                        <span className='text-[var(--text-primary)] font-semibold'>₹{totalAmount}</span>
                                    </div>
                                    <div className='flex justify-between text-sm text-[var(--text-secondary)]'>
                                        <span>Delivery Fee</span>
                                        <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-500' : 'text-[var(--text-primary)]'}`}>
                                            {deliveryFee === 0 ? 'Free 🎉' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm text-[var(--text-secondary)]'>
                                        <span>Taxes (5%)</span>
                                        <span className='text-[var(--text-primary)] font-semibold'>₹{tax}</span>
                                    </div>
                                    <div className='border-t border-[var(--border-color)] pt-3 flex justify-between items-center'>
                                        <span className='font-extrabold text-lg text-[var(--text-primary)]'>Grand Total</span>
                                        <span className='font-extrabold text-2xl text-orange-500'>₹{grandTotal}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order button */}
                            <button
                                className='w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-2xl font-extrabold text-lg shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100'
                                onClick={handlePlaceOrder}
                                disabled={isPlacing}
                            >
                                {isPlacing ? (
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                ) : (
                                    <FaLock size={16} />
                                )}
                                {isPlacing ? "Placing Order..." : paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
                            </button>

                            {/* Trust badges */}
                            <div className='flex items-center justify-center gap-2 text-[var(--text-secondary)] text-xs'>
                                <FaShieldAlt size={12} className='text-green-500' />
                                <span>100% Secure & Encrypted Transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckOut
