import React from 'react'
import { Link } from 'react-router-dom'

const BrandNavbar = ({ compact = false }) => {
  return (
    <nav className={`brand-glass mx-auto flex w-full max-w-7xl items-center justify-between rounded-full px-4 py-3 ${compact ? 'mt-6 max-w-4xl' : 'mt-6'}`}>
      <Link to='/' className='flex items-center gap-3'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#8b5cf6,_#ec4899)] text-white shadow-lg shadow-fuchsia-200'>
          <i className='ri-shield-check-fill text-2xl' />
        </div>
        <div>
          <p className='text-2xl font-black tracking-tight text-slate-900'>SafeCompanion</p>
          <p className='text-xs font-medium uppercase tracking-[0.28em] text-fuchsia-500'>Travel Safe Together</p>
        </div>
      </Link>

      <div className='hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex'>
        <a href='#how-it-works' className='transition hover:text-fuchsia-600'>How It Works</a>
        <a href='#features' className='transition hover:text-fuchsia-600'>Safety</a>
        <a href='#about' className='transition hover:text-fuchsia-600'>About</a>
        <Link to='/login' className='transition hover:text-fuchsia-600'>Login</Link>
        <Link to='/signup' className='brand-button rounded-full px-6 py-3 text-white transition'>
          Get Started
        </Link>
      </div>

      <Link to='/login' className='brand-button rounded-full px-5 py-3 text-sm font-semibold text-white md:hidden'>
        Login
      </Link>
    </nav>
  )
}

export default BrandNavbar
