import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import FoodCard from './FoodCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import { FaFire, FaStore, FaUtensils, FaBolt, FaStar, FaClock } from "react-icons/fa"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const OFFER_BANNERS = [
    {
        title: "50% OFF on First Order",
        subtitle: "Use code CRAVORA50 at checkout",
        emoji: "🎉",
        gradient: "from-orange-500 to-rose-500",
    },
    {
        title: "Free Delivery Over ₹500",
        subtitle: "No minimum order required",
        emoji: "🛵",
        gradient: "from-purple-500 to-indigo-600",
    },
    {
        title: "Fresh & Fast Delivery",
        subtitle: "Delivered in 30–45 minutes",
        emoji: "⚡",
        gradient: "from-green-500 to-teal-500",
    },
]

function UserDashboard() {
    const { currentCity, shopInMyCity, itemsInMyCity, searchItems, userData } = useSelector(state => state.user)
    const cateScrollRef = useRef()
    const shopScrollRef = useRef()
    const navigate = useNavigate()
    const [showLeftCateButton, setShowLeftCateButton] = useState(false)
    const [showRightCateButton, setShowRightCateButton] = useState(false)
    const [showLeftShopButton, setShowLeftShopButton] = useState(false)
    const [showRightShopButton, setShowRightShopButton] = useState(false)
    const [updatedItemsList, setUpdatedItemsList] = useState([])
    const [activeCategory, setActiveCategory] = useState("All")
    const [activeBanner, setActiveBanner] = useState(0)

    const handleFilterByCategory = (category) => {
        setActiveCategory(category)
        if (category === "All") {
            setUpdatedItemsList(itemsInMyCity)
        } else {
            setUpdatedItemsList(itemsInMyCity?.filter(i => i.category === category))
        }
    }

    useEffect(() => {
        setUpdatedItemsList(itemsInMyCity)
    }, [itemsInMyCity])

    // Auto-rotate banners
    useEffect(() => {
        const timer = setInterval(() => setActiveBanner(p => (p + 1) % OFFER_BANNERS.length), 4000)
        return () => clearInterval(timer)
    }, [])

    const updateButton = (ref, setLeft, setRight) => {
        const el = ref.current
        if (el) {
            setLeft(el.scrollLeft > 0)
            setRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
        }
    }
    const scrollHandler = (ref, dir) => {
        ref.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" })
    }

    useEffect(() => {
        const catEl = cateScrollRef.current
        const shopEl = shopScrollRef.current
        if (!catEl || !shopEl) return
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
        const onCatScroll = () => updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
        const onShopScroll = () => updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
        catEl.addEventListener('scroll', onCatScroll)
        shopEl.addEventListener('scroll', onShopScroll)
        return () => {
            catEl.removeEventListener('scroll', onCatScroll)
            shopEl.removeEventListener('scroll', onShopScroll)
        }
    }, [shopInMyCity])

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    const firstName = userData?.fullName?.split(" ")[0] || "there"

    const isServingArea = !currentCity || (currentCity.toLowerCase().includes("gurugram") || currentCity.toLowerCase().includes("gurgaon"));

    return (
        <div className='w-full min-h-screen flex flex-col bg-[var(--bg-primary)] transition-colors duration-300'>
            <Nav />

            {!isServingArea ? (
                <div className='pt-[80px] flex-1 flex items-center justify-center p-6'>
                    <div className='max-w-md w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-10 text-center shadow-2xl animate-fade-in-up relative overflow-hidden'>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>
                        
                        <div className='relative z-10'>
                            <div className='text-6xl mb-6'>🛵</div>
                            <h2 className='text-2xl font-extrabold text-[var(--text-primary)] mb-4'>
                                Oops! We haven't reached <span className='text-orange-500'>{currentCity}</span> yet.
                            </h2>
                            <p className='text-[var(--text-secondary)] font-medium text-base mb-6 leading-relaxed'>
                                Currently, we are exclusively serving our delicious food in <span className='font-bold text-[var(--text-primary)]'>Gurugram</span>. 
                                We are expanding fast and will notify you as soon as we start delivering to your location!
                            </p>
                            <div className='bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold py-3 px-6 rounded-xl inline-flex items-center gap-2'>
                                <FaBolt /> Hang tight!
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
            <div className='pt-[80px] flex flex-col gap-10 pb-16'>

                {/* ── Hero Section ─────────────────────────────────── */}
                <div className='relative w-full overflow-hidden'>
                    {/* Gradient backdrop */}
                    <div className='absolute inset-0 bg-gradient-to-br from-orange-500/20 via-rose-500/10 to-transparent dark:from-orange-500/10 pointer-events-none' />
                    {/* Decorative blobs */}
                    <div className='absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4 pointer-events-none' />
                    <div className='absolute bottom-0 left-1/4 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl pointer-events-none' />

                    <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 flex flex-col md:flex-row items-center gap-10'>
                        {/* Left Text */}
                        <div className='flex-1 animate-fade-in-up'>
                            <div className='inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-sm px-4 py-2 rounded-full mb-4'>
                                <FaBolt size={12} /> {greeting}, {firstName}! 👋
                            </div>
                            <h1 className='text-4xl md:text-6xl font-black text-[var(--text-primary)] leading-tight mb-4'>
                                Hungry? <br />
                                <span className='bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent'>
                                    We've Got You.
                                </span>
                            </h1>
                            <p className='text-[var(--text-secondary)] text-lg md:text-xl font-medium max-w-lg mb-8'>
                                The best food from the best restaurants in <span className='text-orange-500 font-bold'>{currentCity || "your city"}</span>, delivered hot & fast to your door.
                            </p>

                            {/* Stats Row */}
                            <div className='flex items-center gap-6 flex-wrap'>
                                <div className='flex items-center gap-2'>
                                    <div className='p-2 bg-orange-500/10 rounded-lg'>
                                        <FaStore className='text-orange-500' size={18} />
                                    </div>
                                    <div>
                                        <p className='font-extrabold text-[var(--text-primary)] text-xl leading-none'>{shopInMyCity?.length || 0}+</p>
                                        <p className='text-[var(--text-secondary)] text-xs font-medium'>Restaurants</p>
                                    </div>
                                </div>
                                <div className='w-px h-10 bg-[var(--border-color)]' />
                                <div className='flex items-center gap-2'>
                                    <div className='p-2 bg-rose-500/10 rounded-lg'>
                                        <FaUtensils className='text-rose-500' size={18} />
                                    </div>
                                    <div>
                                        <p className='font-extrabold text-[var(--text-primary)] text-xl leading-none'>{itemsInMyCity?.length || 0}+</p>
                                        <p className='text-[var(--text-secondary)] text-xs font-medium'>Menu Items</p>
                                    </div>
                                </div>
                                <div className='w-px h-10 bg-[var(--border-color)]' />
                                <div className='flex items-center gap-2'>
                                    <div className='p-2 bg-yellow-500/10 rounded-lg'>
                                        <FaStar className='text-yellow-500' size={18} />
                                    </div>
                                    <div>
                                        <p className='font-extrabold text-[var(--text-primary)] text-xl leading-none'>4.8</p>
                                        <p className='text-[var(--text-secondary)] text-xs font-medium'>Avg. Rating</p>
                                    </div>
                                </div>
                                <div className='w-px h-10 bg-[var(--border-color)]' />
                                <div className='flex items-center gap-2'>
                                    <div className='p-2 bg-blue-500/10 rounded-lg'>
                                        <FaClock className='text-blue-500' size={18} />
                                    </div>
                                    <div>
                                        <p className='font-extrabold text-[var(--text-primary)] text-xl leading-none'>30 min</p>
                                        <p className='text-[var(--text-secondary)] text-xs font-medium'>Avg. Delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right — Rotating Offer Banners */}
                        <div className='w-full md:w-80 flex-shrink-0'>
                            {OFFER_BANNERS.map((banner, i) => (
                                <div
                                    key={i}
                                    className={`w-full rounded-3xl p-7 text-white transition-all duration-500 ${activeBanner === i ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} bg-gradient-to-br ${banner.gradient} shadow-2xl`}
                                >
                                    <div className='text-5xl mb-4'>{banner.emoji}</div>
                                    <h3 className='text-2xl font-black mb-1'>{banner.title}</h3>
                                    <p className='text-white/80 text-sm font-medium'>{banner.subtitle}</p>
                                </div>
                            ))}
                            {/* Dots */}
                            <div className='flex justify-center gap-2 mt-4'>
                                {OFFER_BANNERS.map((_, i) => (
                                    <button key={i} onClick={() => setActiveBanner(i)}
                                        className={`rounded-full transition-all duration-300 cursor-pointer ${activeBanner === i ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-[var(--border-color)]'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Search Results ───────────────────────────────── */}
                {searchItems && searchItems.length > 0 && (
                    <div className='max-w-7xl mx-auto w-full px-4 sm:px-6 animate-fade-in-up'>
                        <div className='bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-xl'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='p-2 bg-orange-500/10 rounded-xl'><FaFire className='text-orange-500' size={20} /></div>
                                <h2 className='text-[var(--text-primary)] text-2xl font-extrabold'>Search Results</h2>
                                <span className='bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full'>{searchItems.length}</span>
                            </div>
                            <div className='flex flex-wrap gap-6 justify-center sm:justify-start'>
                                {searchItems.map(item => <FoodCard data={item} key={item._id} />)}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Categories ──────────────────────────────────── */}
                <div className='max-w-7xl mx-auto w-full px-4 sm:px-6'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='p-2 bg-purple-500/10 rounded-xl'><FaUtensils className='text-purple-500' size={20} /></div>
                        <h2 className='text-[var(--text-primary)] font-extrabold text-2xl sm:text-3xl'>Browse Categories</h2>
                    </div>
                    <div className='relative'>
                        {showLeftCateButton && (
                            <button className='absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-orange-500 p-3 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all cursor-pointer' onClick={() => scrollHandler(cateScrollRef, "left")}>
                                <FaCircleChevronLeft size={22} />
                            </button>
                        )}
                        <div className='flex overflow-x-auto gap-4 pb-3 pt-1 hide-scroll' ref={cateScrollRef}>
                            {/* All pill */}
                            <button
                                onClick={() => handleFilterByCategory("All")}
                                className={`flex-shrink-0 flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 font-bold text-sm transition-all duration-200 cursor-pointer hover:scale-105 min-w-[100px]
                                    ${activeCategory === "All"
                                        ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                        : "border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-orange-500/50"
                                    }`}
                            >
                                <span className='text-2xl'>🍽️</span>
                                <span>All</span>
                            </button>
                            {categories.map((cate, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleFilterByCategory(cate.category)}
                                    className={`flex-shrink-0 w-[110px] md:w-[150px] rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer hover:scale-105 group
                                        ${activeCategory === cate.category
                                            ? "border-orange-500 shadow-lg shadow-orange-500/20"
                                            : "border-[var(--border-color)] hover:border-orange-500/50"
                                        }`}
                                >
                                    <div className='h-20 md:h-28 overflow-hidden'>
                                        <img src={cate.image} alt={cate.category} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                                    </div>
                                    <div className={`px-2 py-2 text-center text-xs font-bold transition-colors ${activeCategory === cate.category ? "bg-orange-500 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-primary)]"}`}>
                                        {cate.category}
                                    </div>
                                </button>
                            ))}
                        </div>
                        {showRightCateButton && (
                            <button className='absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-orange-500 p-3 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all cursor-pointer' onClick={() => scrollHandler(cateScrollRef, "right")}>
                                <FaCircleChevronRight size={22} />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Restaurants Near You ─────────────────────────── */}
                {shopInMyCity && shopInMyCity.length > 0 && (
                    <div className='max-w-7xl mx-auto w-full px-4 sm:px-6'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='p-2 bg-orange-500/10 rounded-xl'><FaStore className='text-orange-500' size={20} /></div>
                            <h2 className='text-[var(--text-primary)] font-extrabold text-2xl sm:text-3xl'>
                                Top Restaurants in <span className='text-orange-500'>{currentCity}</span>
                            </h2>
                        </div>
                        <div className='relative'>
                            {showLeftShopButton && (
                                <button className='absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-orange-500 p-3 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all cursor-pointer' onClick={() => scrollHandler(shopScrollRef, "left")}>
                                    <FaCircleChevronLeft size={22} />
                                </button>
                            )}
                            <div className='flex overflow-x-auto gap-6 pb-4 pt-2 hide-scroll' ref={shopScrollRef}>
                                {shopInMyCity.map((shop, index) => (
                                    <div
                                        key={index}
                                        className='flex-shrink-0 w-[240px] rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group'
                                        onClick={() => navigate(`/shop/${shop._id}`)}
                                    >
                                        <div className='relative h-40 overflow-hidden'>
                                            <img src={shop.image} alt={shop.name} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                                            <div className='absolute bottom-3 left-3 right-3'>
                                                <h3 className='font-extrabold text-white text-base truncate drop-shadow'>{shop.name}</h3>
                                            </div>
                                            <span className='absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow'>
                                                🟢 Open
                                            </span>
                                        </div>
                                        <div className='p-4'>
                                            <p className='text-[var(--text-secondary)] text-xs truncate mb-3'>{shop.address}, {shop.city}</p>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-1'>
                                                    <FaStar className='text-yellow-400' size={13} />
                                                    <span className='text-[var(--text-primary)] font-bold text-sm'>4.8</span>
                                                </div>
                                                <div className='flex items-center gap-1 text-[var(--text-secondary)] text-xs'>
                                                    <FaClock size={12} />
                                                    <span>30-45 min</span>
                                                </div>
                                                <span className='text-orange-500 font-bold text-xs'>View Menu →</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {showRightShopButton && (
                                <button className='absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-orange-500 p-3 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all cursor-pointer' onClick={() => scrollHandler(shopScrollRef, "right")}>
                                    <FaCircleChevronRight size={22} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Food Items Grid ──────────────────────────────── */}
                <div className='max-w-7xl mx-auto w-full px-4 sm:px-6'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='p-2 bg-rose-500/10 rounded-xl'><FaFire className='text-rose-500' size={20} /></div>
                        <h2 className='text-[var(--text-primary)] font-extrabold text-2xl sm:text-3xl'>
                            {activeCategory === "All" ? "Trending Near You" : activeCategory}
                        </h2>
                        {updatedItemsList?.length > 0 && (
                            <span className='bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-bold px-3 py-1 rounded-full'>
                                {updatedItemsList.length} items
                            </span>
                        )}
                    </div>

                    {updatedItemsList && updatedItemsList.length > 0 ? (
                        <div className='flex flex-wrap gap-6 justify-center sm:justify-start'>
                            {updatedItemsList.map((item, index) => (
                                <div key={item._id || index} className='animate-fade-in-up' style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}>
                                    <FoodCard data={item} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-24 gap-4 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]'>
                            <div className='text-6xl'>🍽️</div>
                            <p className='text-[var(--text-primary)] font-bold text-xl'>No items found</p>
                            <p className='text-[var(--text-secondary)] text-center max-w-sm'>We couldn't find any food items near you right now. Try a different category!</p>
                            <button onClick={() => handleFilterByCategory("All")} className='mt-2 bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 transition-colors cursor-pointer'>
                                Show All
                            </button>
                        </div>
                    )}
                </div>

            </div>
            )}
        </div>
    )
}

export default UserDashboard
