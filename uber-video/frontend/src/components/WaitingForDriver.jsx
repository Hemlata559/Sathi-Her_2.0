import React from 'react'

const WaitingForDriver = (props) => {
  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.waitingForDriver(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

      {/* Companion Profile */}
      <div className='flex items-center justify-between gap-3 p-3 bg-pink-50 rounded-lg border-2 border-pink-200'>
        <img className='h-16 w-16 rounded-full object-cover border-4 border-pink-300' src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Companion" />
        <div className='flex-1'>
          <h2 className='text-lg font-semibold capitalize text-gray-800'>{props.ride?.captain.fullname.firstname}</h2>
          <div className='flex gap-1 items-center'>
            <span className='text-yellow-400 text-sm'>★★★★★</span>
            <span className='text-xs text-gray-600'>(127 reviews)</span>
          </div>
          <p className='text-xs text-gray-600 mt-1'>Verified Companion • Online</p>
        </div>
      </div>

      {/* Meeting Code */}
      <div className='bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mt-3'>
        <p className='text-xs text-gray-600 font-medium'>Meeting Code</p>
        <h1 className='text-3xl font-bold text-blue-600 text-center tracking-widest mt-1'>{props.ride?.otp}</h1>
        <p className='text-xs text-gray-600 text-center mt-1'>Share this code with your companion</p>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-4'>
          {/* Meeting Point */}
          <div className='flex items-center gap-3 p-2 border-b-2'>
            <i className="ri-map-pin-user-fill text-purple-500"></i>
            <div>
              <h3 className='text-sm font-medium'>Meeting Point</h3>
              <p className='text-xs text-gray-600'>{props.ride?.pickup}</p>
            </div>
          </div>

          {/* Activity Location */}
          <div className='flex items-center gap-3 p-2 border-b-2'>
            <i className="ri-map-pin-2-fill text-red-500"></i>
            <div>
              <h3 className='text-sm font-medium'>Activity Location</h3>
              <p className='text-xs text-gray-600'>{props.ride?.destination}</p>
            </div>
          </div>

          {/* Cost Sharing */}
          <div className='flex items-center gap-3 p-2 bg-green-50 border-l-4 border-green-500'>
            <i className="ri-coin-line text-green-600"></i>
            <div>
              <h3 className='text-sm font-medium'>Cost Sharing</h3>
              <p className='text-xs text-green-700 font-semibold'>₹{props.ride?.fare}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className='w-full mt-3 flex items-center justify-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          <p className='text-xs text-yellow-800 font-medium'>Companion is on the way to meeting point</p>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver