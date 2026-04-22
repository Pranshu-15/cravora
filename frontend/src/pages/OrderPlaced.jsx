import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDeliveryDining } from 'react-icons/md'
import { FiPackage, FiMapPin } from 'react-icons/fi'

function OrderPlaced() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [ringDone, setRingDone] = useState(false)

    useEffect(() => {
        setTimeout(() => setShow(true), 100)
        setTimeout(() => setRingDone(true), 900)
    }, [])

    const steps = [
        { icon: <FiPackage size={16} />, label: 'Order Confirmed' },
        { icon: <MdDeliveryDining size={16} />, label: 'Being Prepared' },
        { icon: <FiMapPin size={16} />, label: 'Out for Delivery' },
    ]

    return (
        <div
            className='min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden'
            style={{ background: 'var(--bg-primary)', transition: 'background 0.3s' }}
        >
            {/* Blurred glow blobs */}
            <div style={{
                position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
                width: 480, height: 480,
                background: 'radial-gradient(circle, rgba(255,77,45,0.12) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '-8%', right: '-8%',
                width: 340, height: 340,
                background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            {/* Card */}
            <div
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 28,
                    padding: '48px 44px',
                    maxWidth: 440,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 8px 48px rgba(0,0,0,0.12)',
                    opacity: show ? 1 : 0,
                    transform: show ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
                    transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)',
                }}
            >
                {/* Animated check circle */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 88, height: 88,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: ringDone
                            ? '0 0 0 12px rgba(34,197,94,0.12), 0 4px 24px rgba(34,197,94,0.35)'
                            : '0 0 0 0px rgba(34,197,94,0)',
                        transition: 'box-shadow 0.5s ease',
                        position: 'relative',
                    }}>
                        {/* Checkmark SVG */}
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                            <path
                                d="M10 22l8 8 14-16"
                                stroke="white"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    strokeDasharray: 40,
                                    strokeDashoffset: show ? 0 : 40,
                                    transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s',
                                }}
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: 28, fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: 10, letterSpacing: '-0.5px',
                    opacity: show ? 1 : 0,
                    transition: 'opacity 0.5s ease 0.3s',
                }}>
                    Order Placed! 🎉
                </h1>

                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: 14, lineHeight: 1.7,
                    marginBottom: 32,
                    opacity: show ? 1 : 0,
                    transition: 'opacity 0.5s ease 0.4s',
                }}>
                    Thank you for your order. Your food is being prepared fresh and will reach you shortly!
                </p>

                {/* Progress steps */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 0, marginBottom: 36,
                    opacity: show ? 1 : 0,
                    transition: 'opacity 0.5s ease 0.5s',
                }}>
                    {steps.map((step, i) => (
                        <React.Fragment key={i}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: i === 0
                                        ? 'linear-gradient(135deg,#ff4d2d,#e64323)'
                                        : 'var(--bg-primary)',
                                    border: i === 0
                                        ? 'none'
                                        : '2px solid var(--border-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: i === 0 ? '#fff' : 'var(--text-secondary)',
                                    fontSize: 13,
                                    boxShadow: i === 0 ? '0 4px 16px rgba(255,77,45,0.3)' : 'none',
                                }}>
                                    {step.icon}
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 600,
                                    color: i === 0 ? '#ff4d2d' : 'var(--text-secondary)',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {step.label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div style={{
                                    flex: 1, height: 2, marginBottom: 20,
                                    background: i === 0
                                        ? 'linear-gradient(to right, #ff4d2d, var(--border-color))'
                                        : 'var(--border-color)',
                                    minWidth: 28,
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12,
                    opacity: show ? 1 : 0,
                    transition: 'opacity 0.5s ease 0.6s',
                }}>
                    <button
                        onClick={() => navigate('/my-orders')}
                        style={{
                            background: 'linear-gradient(135deg, #ff4d2d, #e64323)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 14,
                            padding: '14px 0',
                            fontSize: 15, fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(255,77,45,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            transition: 'transform 0.18s, box-shadow 0.18s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,77,45,0.45)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,77,45,0.35)' }}
                    >
                        <MdDeliveryDining size={20} /> Track My Order
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1.5px solid var(--border-color)',
                            borderRadius: 14,
                            padding: '13px 0',
                            fontSize: 14, fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'border-color 0.2s, color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff4d2d'; e.currentTarget.style.color = '#ff4d2d' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>

            {/* Floating food emoji particles */}
            {show && ['🍕', '🍔', '🌮', '🍜'].map((emoji, i) => (
                <span key={i} style={{
                    position: 'absolute',
                    fontSize: 22,
                    opacity: 0.18,
                    top: `${18 + i * 18}%`,
                    left: i % 2 === 0 ? `${6 + i * 3}%` : 'auto',
                    right: i % 2 !== 0 ? `${6 + i * 3}%` : 'auto',
                    animation: `floatEmoji${i} 4s ease-in-out infinite`,
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}>
                    {emoji}
                </span>
            ))}

            <style>{`
                @keyframes floatEmoji0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
                @keyframes floatEmoji1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
                @keyframes floatEmoji2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes floatEmoji3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
            `}</style>
        </div>
    )
}

export default OrderPlaced
