import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UserOrderCard from '../components/UserOrderCard'
import OwnerOrderCard from '../components/OwnerOrderCard'
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice'
import Nav from '../components/Nav'
import { MdArrowBack } from 'react-icons/md'
import { TbReceipt2 } from 'react-icons/tb'

function MyOrders() {
    const { userData, myOrders, socket } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        socket?.on('newOrder', (data) => {
            if (data.shopOrders?.owner._id == userData._id) {
                dispatch(setMyOrders([data, ...myOrders]))
            }
        })
        socket?.on('update-status', ({ orderId, shopId, status, userId }) => {
            if (userId == userData._id) {
                dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
            }
        })
        return () => {
            socket?.off('newOrder')
            socket?.off('update-status')
        }
    }, [socket])

    return (
        <div className='min-h-screen bg-[var(--bg-primary)] transition-colors duration-300'>
            <Nav />
            <div className='pt-[80px]'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 py-8'>

                    {/* Header */}
                    <div className='flex items-center gap-4 mb-8'>
                        <button
                            onClick={() => navigate("/")}
                            className='flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 cursor-pointer shadow-sm'
                        >
                            <MdArrowBack size={20} />
                        </button>
                        <div>
                            <h1 className='text-3xl font-extrabold text-[var(--text-primary)]'>My Orders</h1>
                            <p className='text-[var(--text-secondary)] text-sm mt-0.5'>
                                {myOrders?.length > 0 ? `${myOrders.length} order${myOrders.length > 1 ? 's' : ''}` : 'No orders yet'}
                            </p>
                        </div>
                    </div>

                    {/* Orders list */}
                    {myOrders?.length > 0 ? (
                        <div className='flex flex-col gap-5'>
                            {myOrders.map((order, index) => (
                                <div key={index} className='animate-fade-in-up' style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}>
                                    {userData.role === "user" && <UserOrderCard data={order} />}
                                    {userData.role === "owner" && <OwnerOrderCard data={order} />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-28 gap-5 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]'>
                            <div className='w-24 h-24 rounded-full bg-orange-500/10 flex items-center justify-center border-2 border-dashed border-orange-500/30'>
                                <TbReceipt2 className='text-orange-500/60' size={44} />
                            </div>
                            <div className='text-center'>
                                <h2 className='text-xl font-bold text-[var(--text-primary)] mb-1'>No orders yet</h2>
                                <p className='text-[var(--text-secondary)] max-w-sm'>Start exploring restaurants and place your first order!</p>
                            </div>
                            <button
                                onClick={() => navigate("/")}
                                className='bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all cursor-pointer'
                            >
                                Browse Restaurants
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyOrders
