import React from 'react'

function CategoryCard({ name, image, onClick }) {
  return (
    <div className='w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border border-[var(--border-color)] shrink-0 overflow-hidden bg-[var(--bg-secondary)] shadow-sm hover:shadow-lg transition-all relative cursor-pointer group' onClick={onClick}>
      <img src={image} alt={name} className=' w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500' />
      <div className='absolute bottom-0 w-full left-0 bg-[var(--bg-secondary)]/90 px-3 py-2 text-center text-sm font-bold text-[var(--text-primary)] backdrop-blur-md border-t border-[var(--border-color)]'>
        {name}
      </div>
    </div>
  )
}

export default CategoryCard
