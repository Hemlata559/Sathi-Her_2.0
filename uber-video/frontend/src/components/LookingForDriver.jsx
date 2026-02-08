import React from 'react'

const LookingForDriver = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-3'>Finding Your Perfect Match</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                {/* Animated Search */}
                <div className='w-full flex justify-center py-6'>
                    <div className='relative w-20 h-20'>
                        <div className='absolute inset-0 rounded-full border-4 border-pink-200 animate-spin'></div>
                        <div className='absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 animate-spin'></div>
                        <i className="ri-heart-fill text-pink-500 text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
                    </div>
                </div>

                <p className='text-center text-gray-600 font-medium mt-4'>Searching for companions...</p>

                <div className='w-full mt-6'>
                    {/* Meeting Point */}
                    <div className='flex items-center gap-3 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-purple-500"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Meeting Point</h3>
                            <p className='text-xs text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>

                    {/* Activity Location */}
                    <div className='flex items-center gap-3 p-3 border-b-2'>
                        <i className="ri-map-pin-2-fill text-red-500"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Activity Location</h3>
                            <p className='text-xs text-gray-600'>{props.destination}</p>
                        </div>
                    </div>

                    {/* Cost */}
                    <div className='flex items-center gap-3 p-3 bg-green-50 border-l-4 border-green-500'>
                        <i className="ri-coin-line text-green-600"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Cost Per Person</h3>
                            <p className='text-xs text-green-700 font-semibold'>₹{props.fare[props.vehicleType]}</p>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className='bg-blue-50 p-3 border-l-4 border-blue-500 rounded mt-4 w-full'>
                    <p className='text-xs text-blue-800'>
                        <i className="ri-information-line"></i> We&apos;re finding compatible companions based on your interests and schedule
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver