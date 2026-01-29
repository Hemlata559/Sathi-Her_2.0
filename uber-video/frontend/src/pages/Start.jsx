
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'


const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://www.fabhotels.com/blog/wp-content/uploads/2020/03/woman-travel-groups-600.jpg)] h-screen pt-8 flex justify-between flex-col w-full'>
        {/* <img className='w-20 ml-8' src={logo} alt="" /> */}
        <h3 className="text-4xl font-extrabold tracking-tight text-black">
          Sathi<span className="text-gray-500">-Her</span>
        </h3>

        <div className='bg-white pb-8 py-4 px-4'>
          <h2 className='text-[30px] font-semibold'>Travel Safe. Travel Together.</h2>
          <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start