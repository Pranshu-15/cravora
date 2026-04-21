import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUtensils, FaStar, FaClock } from "react-icons/fa"
import { FaLocationDot, FaArrowLeft, FaBorderAll, FaList } from "react-icons/fa6"
import { FoodCard, FoodTileCard } from '../components/FoodCard'
import Nav from '../components/Nav'

const CATEGORIES = [
    "All", "Snacks", "Main Course", "Desserts", "Pizza", "Burgers",
    "Sandwiches", "South Indian", "North Indian", "Chinese", "Fast Food",
    "Others", "Biryani", "Mughlai", "Starters", "Sides", "Tandoori",
    "Breads", "Thai", "Soups", "Rolls", "Wraps", "Waffles",
    "Pancakes", "Crepes", "Pasta", "Kebabs", "Rajasthani",
    "Smoothies", "Shakes", "Bowls", "Juices", "Salads", "Sushi", "Ramen"
]

function Shop() {
    const { shopId } = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState("All")
    const [visible, setVisible] = useState(false)
    const [viewMode, setViewMode] = useState("grid") // "grid" | "tile"
    const navigate = useNavigate()

    const handleShop = async () => {
        try {
            setLoading(true)
            const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true, timeout: 5000 })
            setShop(result.data.shop || null)
            setItems(result.data.items || [])
            setTimeout(() => setVisible(true), 50)
        } catch (error) {
            console.error("Shop fetch failed:", error)
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleShop()
    }, [shopId])

    const filteredItems = activeCategory === "All"
        ? items
        : items.filter(i => i.category === activeCategory)

    const availableCategories = CATEGORIES.filter(c =>
        c === "All" || items.some(i => i.category === c)
    )

    if (loading) {
        return (
            <div className='min-h-screen bg-[var(--bg-primary)] flex items-center justify-center transition-colors duration-300'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin' />
                    <p className='text-[var(--text-secondary)] font-medium'>Loading menu…</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen bg-[var(--bg-primary)] transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <Nav />
            <div className="pt-[80px]">

                {/* ── Hero Banner ────────────────────────────────── */}
                <div className='relative w-full h-[350px] md:h-[450px] flex items-end justify-center pb-12'>
                    <div className='absolute inset-0 overflow-hidden'>
                        <img
                            src={shop?.image}
                            alt={shop?.name}
                            className='w-full h-full object-cover scale-110 blur-sm opacity-60 dark:opacity-40 transition-transform duration-1000'
                        />
                        <div className='absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/40 via-transparent to-[var(--bg-primary)]' />
                    </div>

                    {/* Back button */}
                    <button
                        className='absolute top-6 left-6 z-20 flex items-center gap-2 bg-[var(--bg-secondary)]/80 backdrop-blur-md text-[var(--text-primary)] px-4 py-2.5 rounded-full shadow-lg border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] hover:scale-105 transition-all font-semibold text-sm cursor-pointer'
                        onClick={() => navigate("/")}
                    >
                        <FaArrowLeft size={14} /> Back
                    </button>

                    {/* Floating Glassmorphism Shop Card */}
                    <div className='relative z-10 w-[90%] max-w-5xl bg-[var(--bg-secondary)]/70 dark:bg-[var(--bg-secondary)]/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 translate-y-16 animate-fade-in-up'>
                        <div className='w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-[var(--bg-secondary)] flex-shrink-0'>
                            <img src={shop?.image} alt={shop?.name} className='w-full h-full object-cover hover:scale-110 transition-transform duration-500' />
                        </div>
                        <div className='flex-1 text-center md:text-left'>
                            <span className='inline-block bg-orange-500/10 text-orange-500 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-orange-500/20 mb-2'>
                                Premium Restaurant
                            </span>
                            <h1 className='text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-3 tracking-tight'>{shop?.name}</h1>
                            <div className='flex items-center justify-center md:justify-start gap-2 text-[var(--text-secondary)] font-medium mb-5'>
                                <FaLocationDot className='text-red-500' size={16} />
                                <span>{shop?.address}, {shop?.city}, {shop?.state}</span>
                            </div>
                            <div className='flex items-center justify-center md:justify-start gap-4 md:gap-6 flex-wrap'>
                                <div className='flex items-center gap-2 bg-[var(--bg-primary)] px-4 py-2 rounded-xl shadow-sm border border-[var(--border-color)]'>
                                    <FaStar className='text-yellow-400' size={18} />
                                    <span className='font-bold text-[var(--text-primary)]'>4.8</span>
                                    <span className='text-[var(--text-secondary)] text-sm'>(500+)</span>
                                </div>
                                <div className='flex items-center gap-2 bg-[var(--bg-primary)] px-4 py-2 rounded-xl shadow-sm border border-[var(--border-color)]'>
                                    <FaClock className='text-blue-400' size={18} />
                                    <span className='font-bold text-[var(--text-primary)]'>30-45 min</span>
                                </div>
                                <div className='flex items-center gap-2 bg-[var(--bg-primary)] px-4 py-2 rounded-xl shadow-sm border border-[var(--border-color)]'>
                                    <FaUtensils className='text-orange-500' size={16} />
                                    <span className='font-bold text-[var(--text-primary)]'>{items.length} Items</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Content ────────────────────────────────────── */}
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-20 mt-8'>

                    {/* Category Filter Pills */}
                    {availableCategories.length > 1 && (
                        <div className='mb-10'>
                            <div className='flex gap-3 overflow-x-auto pb-4 hide-scroll snap-x'>
                                {availableCategories.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setActiveCategory(c)}
                                        className={`snap-center flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer shadow-sm
                                            ${activeCategory === c
                                                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-orange-500/30 scale-105'
                                                : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-orange-500/50 hover:text-orange-500 hover:bg-[var(--bg-primary)]'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Section header + View Toggle */}
                    <div className='flex items-center justify-between gap-3 mb-8'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-orange-500/10 rounded-lg'>
                                <FaUtensils className='text-orange-500' size={20} />
                            </div>
                            <h2 className='text-3xl font-extrabold text-[var(--text-primary)]'>
                                {activeCategory === "All" ? "Menu Highlights" : activeCategory}
                            </h2>
                            <span className='bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] px-3 py-1 rounded-full text-sm font-bold'>
                                {filteredItems.length}
                            </span>
                        </div>

                        {/* View Mode Toggle */}
                        <div className='flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-1 shadow-sm gap-1 flex-shrink-0'>
                            <button
                                onClick={() => setViewMode("grid")}
                                title="Grid View"
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer
                                    ${viewMode === "grid"
                                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                                    }`}
                            >
                                <FaBorderAll size={15} />
                                <span className='hidden sm:inline'>Grid</span>
                            </button>
                            <button
                                onClick={() => setViewMode("tile")}
                                title="List View"
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer
                                    ${viewMode === "tile"
                                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                                    }`}
                            >
                                <FaList size={15} />
                                <span className='hidden sm:inline'>List</span>
                            </button>
                        </div>
                    </div>

                    {/* Items — keyed on viewMode so React re-mounts & triggers animation */}
                    {filteredItems.length > 0 ? (
                        <div key={viewMode} className='animate-view-switch'>
                            {viewMode === "grid" ? (
                                /* Grid View */
                                <div className='flex flex-wrap justify-center sm:justify-start gap-6'>
                                    {filteredItems.map((item, idx) => (
                                        <div
                                            key={item._id}
                                            className='animate-fade-in-up'
                                            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                                        >
                                            <FoodCard data={item} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Tile / List View */
                                <div className='flex flex-col gap-3'>
                                    {filteredItems.map((item, idx) => (
                                        <div
                                            key={item._id}
                                            className='animate-fade-in-up'
                                            style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
                                        >
                                            <FoodTileCard data={item} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-24 gap-4 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] shadow-inner'>
                            <div className='bg-[var(--bg-primary)] rounded-full p-6 shadow-md border border-[var(--border-color)]'>
                                <FaUtensils className='text-[var(--text-secondary)]' size={40} />
                            </div>
                            <p className='text-[var(--text-primary)] font-bold text-xl mt-2'>No items in this category</p>
                            <p className='text-[var(--text-secondary)] max-w-md text-center'>We couldn't find any items matching this category.</p>
                            <button
                                className='mt-4 bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:bg-orange-600 transition-all cursor-pointer'
                                onClick={() => setActiveCategory("All")}
                            >
                                View All Items
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Shop
