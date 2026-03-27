import React from 'react'

const ConnectingOverlay = ({ onCancel, companion }) => {
  const avatarUrl = companion?.image || 'https://i.pravatar.cc/100'

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-40" />

      <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="relative max-w-md w-[90%] bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center pointer-events-auto">
          <div className="relative w-[100px] h-[100px] mb-4">
            <div className="absolute inset-0 rounded-full border border-white/30 ring-1 ring-blue-100 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full border border-white/40 ring-2 ring-blue-200 animate-pulse-ring delay-100" />
            <div className="absolute inset-0 rounded-full border border-white/50 ring-4 ring-blue-300 animate-pulse-ring delay-200" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white bg-gray-100">
              <img
                src={avatarUrl}
                alt={companion?.name ? `${companion.name} avatar` : 'connecting avatar'}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">Connecting You...</h2>
          <p className="text-sm text-gray-500 mt-2">
            Awaiting Akshita's acceptance. This usually takes &lt; 2 mins.
          </p>

          <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-100 rounded-full">
            <i className="ri-shield-check-line text-green-500"></i>
            <span className="text-xs text-green-700 font-medium">Aadhar Verified</span>
            <div className="flex items-center gap-0.5">
              <i className="ri-star-fill text-yellow-400 text-[10px]"></i>
              <i className="ri-star-fill text-yellow-400 text-[10px]"></i>
              <i className="ri-star-fill text-yellow-400 text-[10px]"></i>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="mt-6 w-full bg-red-50 text-red-600 font-medium py-4 rounded-2xl border border-red-100"
          >
            Cancel Connection Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConnectingOverlay
