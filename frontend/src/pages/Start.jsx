
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'


const Start = () => {
  return (
    <div className='w-full h-screen flex flex-col'>
      {/* Navigation Bar */}
      <nav className='bg-black bg-opacity-40 backdrop-blur-sm px-8 py-4 flex justify-between items-center z-10'>
        <h3 className="text-2xl font-extrabold tracking-tight text-white">
          Sathi<span className="text-gray-300">-Her</span>
        </h3>
        
        <div className='flex gap-8 items-center'>
          <a href='#about' className='text-white hover:text-gray-200 font-medium transition border-b-2 border-white pb-1'>About</a>
          <a href='#safety' className='text-white hover:text-gray-200 font-medium transition border-b-2 border-white pb-1'>Safety</a>
          <Link to='/login' className='text-white hover:text-gray-200 font-medium transition'>Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className='flex-1 bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80)] flex flex-col justify-center items-center relative'
      >
        {/* Dark Overlay */}
        <div className='absolute inset-0 bg-black bg-opacity-20'></div>

        {/* Hero Content */}
        <div className='relative z-5 text-center max-w-2xl px-4'>
          <h1 className='text-5xl md:text-6xl font-extrabold text-white mb-6'>
            Travel Safe. Travel Together.
          </h1>
          
          <p className='text-lg md:text-xl text-white mb-8'>
            Connect with verified female travel partners and explore the world with confidence.
          </p>
          
          <Link 
            to='/signup' 
            className='inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg'
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className='bg-black bg-opacity-80 text-white px-8 py-4 flex justify-center gap-12 items-center'>
        <div className='flex items-center gap-2'>
          <i className='ri-checkbox-circle-line text-2xl'></i>
          <span className='font-medium'>Verified Profiles</span>
        </div>
        <div className='flex items-center gap-2'>
          <i className='ri-time-line text-2xl'></i>
          <span className='font-medium'>24/7 Support</span>
        </div>
        <div className='flex items-center gap-2'>
          <i className='ri-global-line text-2xl'></i>
          <span className='font-medium'>Global Community</span>
        </div>
      </div>
    </div>
  )
}

export default Start