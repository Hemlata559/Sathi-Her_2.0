import React from 'react'

const ConfirmCompanionMatch = (props) => {
  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.setShowConfirmMatch(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

      {/* Header */}
      <div className='text-center p-3 mb-3'>
        <h3 className='text-xl font-bold text-gray-800'>Confirm Companion Match</h3>
      </div>

      {/* Companion Card */}
      <div className='bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border-2 border-pink-200 p-3 mb-3'>
        {/* Name & Rating */}
        <div className='mb-2'>
          <h2 className='text-lg font-bold text-gray-800'>Close Friend</h2>
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-yellow-400'>★★★★★</span>
            <span className='text-xs text-gray-600 bg-green-100 px-2 py-1 rounded-full'>(Available)</span>
          </div>
        </div>

        {/* Schedule */}
        <div className='bg-white rounded p-2 mb-2 border border-pink-200'>
          <p className='text-xs font-semibold text-gray-600'>SCHEDULE</p>
          <p className='text-sm text-gray-800 font-medium mt-1'>Today • Flexible timing</p>
        </div>

        {/* Meeting Point */}
        <div className='bg-white rounded p-2 mb-2 border border-pink-200'>
          <p className='text-xs font-semibold text-gray-600 flex items-center gap-1'>
            <i className='ri-map-pin-user-fill text-purple-500'></i>
            MEETING POINT
          </p>
          <p className='text-sm text-gray-800 font-medium mt-1'>Krishna Nagar bus Stop</p>
        </div>

        {/* Destination */}
        <div className='bg-white rounded p-2 mb-2 border border-pink-200'>
          <p className='text-xs font-semibold text-gray-600 flex items-center gap-1'>
            <i className='ri-map-pin-2-fill text-red-500'></i>
            DESTINATION
          </p>
          <p className='text-sm text-gray-800 font-medium mt-1'>Indira Gandhi Delhi Technical University for Women, Mahatma Gandhi Marg, Kashmere Gate, Central Delhi</p>
        </div>
      </div>

      {/* Chat Button */}
      <button className='w-full bg-blue-100 text-blue-700 font-semibold py-2 rounded-lg mb-2 border border-blue-300 flex items-center justify-center gap-2 hover:bg-blue-200 transition'>
        <i className='ri-chat-3-line'></i>
        Chat
      </button>

      {/* Start Live Tracking Button */}
      <button className='w-full bg-orange-100 text-orange-700 font-semibold py-2 rounded-lg mb-3 border border-orange-300 flex items-center justify-center gap-2 hover:bg-orange-200 transition'>
        <i className='ri-map-pin-line'></i>
        Start Live Tracking
      </button>

      {/* Info Banner */}
      <div className='bg-green-50 p-2 border-l-4 border-green-500 rounded mb-3'>
        <p className='text-xs text-green-800 font-medium'>
          <i className='ri-shield-check-fill text-green-600 mr-1'></i>
          Verified companions • Emergency contact shared
        </p>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-2 w-full'>
        <button 
          onClick={() => props.setShowConfirmMatch(false)}
          className='flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition'
        >
          Cancel
        </button>
        <button className='flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition shadow-lg'>
          <i className='ri-check-line mr-1'></i>
          Confirm & Find Match
        </button>
      </div>
    </div>
  )
}

export default ConfirmCompanionMatch
