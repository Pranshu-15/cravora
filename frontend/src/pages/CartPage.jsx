import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CartItemCard from '../components/CartItemCard'
import Nav from '../components/Nav'
import { FiShoppingCart } from 'react-icons/fi'
import { MdArrowBack } from 'react-icons/md'
import { FaLock, FaTag } from 'react-icons/fa'

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)

    const deliveryFee = cartItems.length > 0 ? 40 : 0
    const tax = cartItems.length > 0 ? Math.round(totalAmount * 0.05) : 0
    const grandTotal = totalAmount + deliveryFee + tax

    return (
        <div className='min-h-screen bg-[var(--bg-primary)] transition-colors duration-300'>
            <Nav />

            <div className='pt-[80px]'>
                {/* Page Header */}
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
                    <div className='flex items-center gap-4 mb-8'>
                        <button
                            onClick={() => navigate("/")}
                            className='flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 cursor-pointer shadow-sm'
                        >
                            <MdArrowBack size={20} />
                        </button>
                        <div>
                            <h1 className='text-3xl font-extrabold text-[var(--text-primary)]'>Your Cart</h1>
                            <p className='text-[var(--text-secondary)] text-sm mt-0.5'>
                                {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
                            </p>
                        </div>
                    </div>

                    {cartItems?.length === 0 ? (
                        /* ── Empty State ─────────────────────────────── */
                        <div className='flex flex-col items-center justify-center py-32 gap-6 animate-fade-in-up'>
                            <div className='relative'>
                                <div className='w-32 h-32 rounded-full bg-orange-500/10 flex items-center justify-center border-2 border-dashed border-orange-500/30'>
                                    <FiShoppingCart className='text-orange-500/60' size={52} />
                                </div>
                                <div className='absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg'>0</div>
                            </div>
                            <div className='text-center'>
                                <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>Nothing here yet!</h2>
                                <p className='text-[var(--text-secondary)] max-w-sm'>Looks like you haven't added anything to your cart. Explore our restaurants and find something delicious.</p>
                            </div>
                            <button
                                onClick={() => navigate("/")}
                                className='mt-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 cursor-pointer'
                            >
                                Browse Restaurants
                            </button>
                        </div>
                    ) : (
                        /* ── Cart Content ──────────────────────────────── */
                        <div className='flex flex-col lg:flex-row gap-8 items-start'>

                            {/* Left — Item List */}
                            <div className='flex-1 flex flex-col gap-4'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <div className='p-1.5 bg-orange-500/10 rounded-lg'>
                                        <FiShoppingCart className='text-orange-500' size={18} />
                                    </div>
                                    <h2 className='font-bold text-[var(--text-primary)] text-xl'>Cart Items</h2>
                                </div>
                                {cartItems.map((item, index) => (
                                    <div key={index} className='animate-fade-in-up' style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}>
                                        <CartItemCard data={item} />
                                    </div>
                                ))}
                            </div>

                            {/* Right — Order Summary */}
                            <div className='w-full lg:w-[360px] flex-shrink-0 sticky top-24'>
                                <div className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-xl overflow-hidden'>
                                    {/* Summary Header */}
                                    <div className='bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-5'>
                                        <h2 className='text-white font-extrabold text-xl'>Order Summary</h2>
                                        <p className='text-white/80 text-sm mt-0.5'>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className='px-6 py-5 space-y-4'>
                                        <div className='flex justify-between items-center text-[var(--text-secondary)]'>
                                            <span className='font-medium'>Subtotal</span>
                                            <span className='font-semibold text-[var(--text-primary)]'>₹{totalAmount}</span>
                                        </div>
                                        <div className='flex justify-between items-center text-[var(--text-secondary)]'>
                                            <span className='font-medium'>Delivery Fee</span>
                                            <span className='font-semibold text-[var(--text-primary)]'>₹{deliveryFee}</span>
                                        </div>
                                        <div className='flex justify-between items-center text-[var(--text-secondary)]'>
                                            <span className='font-medium'>Taxes (5%)</span>
                                            <span className='font-semibold text-[var(--text-primary)]'>₹{tax}</span>
                                        </div>

                                        {/* Promo pill */}
                                        <div className='flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-2.5 rounded-xl text-sm font-semibold'>
                                            <FaTag size={14} />
                                            Free delivery on your first order!
                                        </div>

                                        <div className='border-t border-[var(--border-color)] pt-4'>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-[var(--text-primary)] font-extrabold text-lg'>Grand Total</span>
                                                <span className='font-extrabold text-orange-500 text-2xl'>₹{grandTotal}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <div className='px-6 pb-6'>
                                        <button
                                            className='w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-2xl font-extrabold text-lg shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer'
                                            onClick={() => navigate("/checkout")}
                                        >
                                            <FaLock size={16} />
                                            Proceed to Checkout
                                        </button>
                                        <p className='text-center text-[var(--text-secondary)] text-xs mt-3 flex items-center justify-center gap-1'>
                                            <FaLock size={10} /> Secured & encrypted payment
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CartPage
