import React from 'react'

const RidePopUp = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-3'>Companion Request!</h3>
            
            {/* Companion Info */}
            <div className='flex items-center justify-between p-3 bg-pink-100 rounded-lg mt-2 border-2 border-pink-300'>
                <div className='flex items-center gap-3'>
                    <div className='h-12 w-12 rounded-full bg-pink-300 flex items-center justify-center'>
                        <i className="ri-user-3-fill text-white text-lg"></i>
                    </div>
                    <div>
                        <h2 className='text-base font-semibold'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                        <p className='text-xs text-gray-600'>Wants a companion</p>
                    </div>
                </div>
                <div className='text-right'>
                    <span className='text-yellow-400 text-sm'>★★★★★</span>
                </div>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-3'>
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

                    {/* Cost */}
                    <div className='flex items-center gap-3 p-2 bg-green-50 border-l-4 border-green-500'>
                        <i className="ri-coin-line text-green-600"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Cost Per Person</h3>
                            <p className='text-xs text-green-700 font-semibold'>₹{props.ride?.fare}</p>
                        </div>
                    </div>
                </div>

                <div className='mt-3 w-full'>
                    <button onClick={() => {
                        props.setConfirmRidePopupPanel(true)
                        props.confirmRide()
                    }} className='bg-pink-500 hover:bg-pink-600 w-full text-white font-semibold p-2 rounded-lg transition text-sm'>
                        <i className="ri-heart-fill"></i> Accept & Match
                    </button>

                    <button onClick={() => {
                        props.setRidePopupPanel(false)
                    }} className='mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold p-2 rounded-lg transition text-sm'>
                        Skip
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp