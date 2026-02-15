import React from 'react'

const WaitingForDriver = (props) => {
  const hasMatch = props.ride?.matchedWith;
  
  const companion = {
    name: 'Aadar Verified',
    initialLetter: 'A',
    rating: 4.8,
    completedRides: 42,
    isVerified: true
  };

  return (
    <div className='max-h-[85vh] overflow-y-auto'>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.setWaitingForDriver(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

      {/* Status Header */}
      <div className='text-center p-2 mb-2'>
        <h3 className='text-lg font-bold text-gray-800'>Waiting for Your Companion</h3>
        <p className='text-xs text-gray-600 mt-0.5'>Searching for companions with similar routes...</p>
      </div>

      {/* Companion Profile Card - Only when matched */}
      {hasMatch && (
        <div className='bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg border-2 border-pink-200 mb-2'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='h-14 w-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center border-4 border-white'>
              <span className='text-white text-xl font-bold'>{companion.initialLetter}</span>
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-1 flex-wrap'>
                <h2 className='text-sm font-bold text-gray-800'>{companion.name}</h2>
                {companion.isVerified && (
                  <div className='flex items-center gap-0.5 bg-blue-100 px-1.5 py-0.5 rounded-full'>
                    <i className='ri-shield-check-fill text-blue-600 text-xs'></i>
                    <span className='text-xs font-semibold text-blue-600'>Verified</span>
                  </div>
                )}
              </div>
              <div className='flex items-center gap-2 text-xs text-gray-600 mt-0.5'>
                <span>★ {companion.rating}/5</span>
                <span>•</span>
                <span>{companion.completedRides} rides</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!hasMatch && (
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-2 border-blue-200 mb-2'>
          <div className='flex items-center gap-2'>
            <div className='h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center animate-pulse flex-shrink-0'>
              <i className='ri-search-line text-white text-lg'></i>
            </div>
            <div className='flex-1 min-w-0'>
              <h2 className='text-sm font-bold text-gray-800'>Looking for matches...</h2>
              <p className='text-xs text-gray-600 mt-0.5'>Finding women with similar routes</p>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Code - Compact */}
      {hasMatch && (
        <div className='bg-blue-50 border-2 border-blue-200 rounded-lg p-2 mb-2'>
          <p className='text-xs text-gray-600 font-medium mb-1'>Meeting Code</p>
          <h1 className='text-2xl font-bold text-blue-600 text-center tracking-widest font-mono'>{props.ride?.meetOtp || '------'}</h1>
        </div>
      )}

      {/* Route Details - Compact */}
      <div className='bg-white rounded-lg border border-gray-200 p-2 mb-2'>
        {/* Your Starting Point */}
        <div className='flex gap-2 pb-2 border-b'>
          <div className='flex flex-col items-center flex-shrink-0'>
            <div className='w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs'>
              <i className='ri-map-pin-user-fill'></i>
            </div>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs font-semibold text-gray-600'>YOUR STARTING POINT</p>
            <p className='text-xs text-gray-800 font-medium mt-0.5 line-clamp-2'>{props.ride?.pickup}</p>
          </div>
        </div>

        {/* Activity Location */}
        <div className='flex gap-2 pt-2'>
          <div className='flex flex-col items-center flex-shrink-0'>
            <div className='w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-xs'>
              <i className='ri-map-pin-2-fill'></i>
            </div>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs font-semibold text-gray-600'>ACTIVITY LOCATION</p>
            <p className='text-xs text-gray-800 font-medium mt-0.5 line-clamp-2'>{props.ride?.destination}</p>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className='w-full flex items-center justify-center gap-2 p-2 bg-yellow-50 rounded-lg border-2 border-yellow-200 mb-3'>
        <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></div>
        <p className='text-xs text-yellow-800 font-medium'>{hasMatch ? 'Companion confirmed!' : 'Searching for matches...'}</p>
      </div>

      {/* Confirm Ride Button */}
      {hasMatch && (
        <button className='w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg text-sm mb-3'>
          <i className='ri-check-line mr-1'></i>
          Confirm Ride
        </button>
      )}
    </div>
  )
}

export default WaitingForDriver