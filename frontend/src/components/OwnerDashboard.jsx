import React from 'react'
import Nav from './NaV.JSX'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen, FaPlus } from "react-icons/fa";
import { MdLocationOn, MdStorefront } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './ownerItemCard';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className='w-full min-h-screen bg-[var(--bg-primary)] flex flex-col items-center transition-colors duration-300'>
      <Nav />

      {/* Spacer for fixed navbar */}
      <div className='pt-[100px] w-full flex flex-col items-center'>

        {/* No shop yet */}
        {!myShopData && (
          <div className='flex justify-center items-center p-6 w-full'>
            <div className='w-full max-w-md bg-[var(--bg-secondary)] shadow-xl rounded-2xl p-8 border border-[var(--border-color)] flex flex-col items-center text-center gap-5 transition-colors duration-300'>
              <div className='bg-orange-500/10 p-5 rounded-full'>
                <MdStorefront className='text-orange-500 w-14 h-14' />
              </div>
              <div>
                <h2 className='text-2xl font-extrabold text-[var(--text-primary)] mb-2'>Set Up Your Restaurant</h2>
                <p className='text-[var(--text-secondary)] text-sm leading-relaxed'>
                  Join our food delivery platform and reach thousands of hungry customers every day.
                </p>
              </div>
              <button
                className='bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-200'
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Shop exists */}
        {myShopData && (
          <div className='w-full max-w-4xl flex flex-col items-center gap-6 px-4 pb-16'>

            {/* Shop banner card */}
            <div className='w-full bg-[var(--bg-secondary)] shadow-xl rounded-2xl overflow-hidden border border-[var(--border-color)] transition-colors duration-300 relative'>
              <img src={myShopData.image} alt={myShopData.name} className='w-full h-52 sm:h-64 object-cover' />

              {/* Gradient overlay on image */}
              <div className='absolute top-0 left-0 w-full h-52 sm:h-64 bg-gradient-to-t from-black/60 to-transparent' />

              {/* Shop name on image */}
              <div className='absolute bottom-0 left-0 p-5'>
                <h1 className='text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg'>{myShopData.name}</h1>
                <div className='flex items-center gap-1 text-white/80 text-sm mt-1'>
                  <MdLocationOn size={16} />
                  <span>{myShopData.address}, {myShopData.city}, {myShopData.state}</span>
                </div>
              </div>

              {/* Edit button */}
              <button
                className='absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full border border-white/30 hover:bg-white/40 transition-all cursor-pointer'
                onClick={() => navigate("/create-edit-shop")}
              >
                <FaPen size={16} />
              </button>
            </div>

            {/* Menu section header */}
            <div className='w-full flex items-center justify-between'>
              <h2 className='text-xl font-extrabold text-[var(--text-primary)]'>Menu Items <span className='text-[var(--text-secondary)] font-medium text-base ml-1'>({myShopData.items.length})</span></h2>
              <button
                className='flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all'
                onClick={() => navigate("/add-item")}
              >
                <FaPlus size={12} /> Add Item
              </button>
            </div>

            {/* Empty menu */}
            {myShopData.items.length === 0 && (
              <div className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 flex flex-col items-center gap-4 text-center transition-colors duration-300'>
                <div className='bg-orange-500/10 p-4 rounded-full'>
                  <FaUtensils className='text-orange-500 w-10 h-10' />
                </div>
                <p className='text-[var(--text-secondary)] font-medium'>No food items yet. Add your first dish to start receiving orders!</p>
              </div>
            )}

            {/* Item list */}
            {myShopData.items.length > 0 && (
              <div className='flex flex-col gap-4 w-full'>
                {myShopData.items.map((item, index) => (
                  <OwnerItemCard data={item} key={index} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard
