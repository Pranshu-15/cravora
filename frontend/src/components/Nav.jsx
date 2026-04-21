import React, { useEffect, useState } from 'react'
import { FaLocationDot, FaMoon, FaSun } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData, setTheme } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

import ProfileModal from './ProfileModal';

function Nav() {
    const { userData, currentCity, cartItems, theme } = useSelector(state => state.user)
    const { myShopData } = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [query, setQuery] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const toggleTheme = () => {
        dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))
    }

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchItems = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true })
            dispatch(setSearchItems(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (query) {
            handleSearchItems()
        } else {
            dispatch(setSearchItems(null))
        }
    }, [query])

    return (
        <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] backdrop-blur-lg bg-[var(--bg-secondary)]/80 border-b border-[var(--border-color)] overflow-visible transition-colors duration-300'>

            {showSearch && userData?.role == "user" && <div className='w-[90%] h-[70px] bg-[var(--bg-secondary)] shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden transition-colors duration-300 border border-[var(--border-color)]'>
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-[var(--border-color)]'>
                    <FaLocationDot size={25} className=" text-[var(--color-primary)]" />
                    <div className='w-[80%] truncate text-[var(--text-secondary)]'>{currentCity}</div>
                </div>
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className='text-[var(--color-primary)]' />
                    <input type="text" placeholder='search delicious food...' className='px-[10px] text-[var(--text-primary)] bg-transparent outline-0 w-full' onChange={(e) => setQuery(e.target.value)} value={query} />
                </div>
            </div>}

            <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm cursor-pointer' onClick={() => navigate("/")}>Cravora</h1>
            
            {userData?.role == "user" && <div className='md:w-[60%] lg:w-[40%] h-[50px] bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-md hover:shadow-lg transition-all duration-300 rounded-full items-center gap-[20px] hidden md:flex'>
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[15px] border-r-[2px] border-[var(--border-color)]'>
                    <FaLocationDot size={20} className=" text-[var(--color-primary)]" />
                    <div className='w-[80%] truncate text-[var(--text-secondary)] text-sm font-medium'>{currentCity}</div>
                </div>
                <div className='w-[70%] flex items-center gap-[10px] pr-4'>
                    <IoIosSearch size={22} className='text-[var(--color-primary)]' />
                    <input type="text" placeholder='Search delicious food...' className='px-[10px] text-[var(--text-primary)] bg-transparent outline-0 w-full text-sm' onChange={(e) => setQuery(e.target.value)} value={query} />
                </div>
            </div>}

            <div className='flex items-center gap-4'>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--border-color)] transition-colors duration-200 text-[var(--text-primary)]">
                    {theme === 'dark' ? <FaSun size={20} className="text-yellow-400" /> : <FaMoon size={20} className="text-slate-600" />}
                </button>

                {userData?.role == "user" && (showSearch ? <RxCross2 size={25} className='text-[var(--color-primary)] md:hidden cursor-pointer' onClick={() => setShowSearch(false)} /> : <IoIosSearch size={25} className='text-[var(--color-primary)] md:hidden cursor-pointer' onClick={() => setShowSearch(true)} />)
                }

                {userData?.role == "owner" ? <>
                    {myShopData && <> <button className='hidden md:flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:scale-105 transition-transform duration-200 font-semibold text-sm' onClick={() => navigate("/add-item")}>
                        <FaPlus size={16} />
                        <span>Add Food Item</span>
                    </button>
                        <button className='md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:scale-105 transition-transform duration-200' onClick={() => navigate("/add-item")}>
                            <FaPlus size={20} />
                        </button></>}

                    <div className='hidden md:flex items-center gap-2 cursor-pointer relative px-4 py-2 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold text-sm hover:scale-105 transition-transform duration-200' onClick={() => navigate("/my-orders")}>
                        <TbReceipt2 size={18} />
                        <span>My Orders</span>
                    </div>
                    <div className='md:hidden flex items-center gap-2 cursor-pointer relative p-2 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:scale-105 transition-transform duration-200' onClick={() => navigate("/my-orders")}>
                        <TbReceipt2 size={20} />
                    </div>
                </> : (
                    <>
                        {userData?.role == "user" && <div className='relative cursor-pointer hover:scale-110 transition-transform duration-200' onClick={() => navigate("/cart")}>
                            <FiShoppingCart size={26} className='text-[var(--text-primary)]' />
                            <span className='absolute right-[-8px] top-[-10px] w-[20px] h-[20px] flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold rounded-full border-2 border-[var(--bg-secondary)]'>{cartItems.length}</span>
                        </div>}

                        {userData?.role == "user" && <button className='hidden md:block px-4 py-2 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:scale-105 transition-transform duration-200 text-sm font-semibold' onClick={() => navigate("/my-orders")}>
                            My Orders
                        </button>}
                    </>
                )}

                {userData && <div className='relative'>
                    <div className='w-[42px] h-[42px] rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-rose-600 text-white text-[18px] shadow-lg font-bold cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200 ring-2 ring-white/20' onClick={() => setShowInfo(prev => !prev)}>
                        {userData?.fullName.slice(0, 1)}
                    </div>

                    {showInfo && <div className='absolute top-[52px] right-0 w-[200px] bg-[var(--bg-secondary)] shadow-2xl rounded-2xl p-[15px] flex flex-col gap-[8px] z-[9999] border border-[var(--border-color)]'>
                        <div className='text-[16px] font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 mb-1'>{userData.fullName}</div>
                        <div className='text-[var(--text-secondary)] hover:text-[var(--color-primary)] font-medium cursor-pointer transition-colors p-2 hover:bg-[var(--bg-primary)] rounded-lg' onClick={() => { setShowProfile(true); setShowInfo(false) }}>Edit Profile</div>
                        {userData.role == "user" && <div className='md:hidden text-[var(--text-secondary)] hover:text-[var(--color-primary)] font-medium cursor-pointer transition-colors p-2 hover:bg-[var(--bg-primary)] rounded-lg' onClick={() => { navigate("/my-orders"); setShowInfo(false) }}>My Orders</div>}
                        <div className='text-red-500 font-medium cursor-pointer transition-colors p-2 hover:bg-red-500/10 rounded-lg' onClick={handleLogOut}>Log Out</div>
                    </div>}
                </div>}

            </div>
            
            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
    )
}

export default Nav
