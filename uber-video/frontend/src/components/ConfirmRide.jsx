import React from 'react'

const ConfirmRide = (props) => {
    // Determine companion type details
    const getCompanionType = () => {
        const types = {
            car: { name: 'Group Activity', icon: 'ri-team-fill', color: 'text-pink-500' },
            moto: { name: 'Close Friend', icon: 'ri-user-follow-fill', color: 'text-blue-500' },
            auto: { name: 'Adventure Partner', icon: 'ri-team-line', color: 'text-purple-500' }
        };
        return types[props.vehicleType] || types.car;
    };

    const companionType = getCompanionType();

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-3'>Confirm Companion Match</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                {/* Profile Icon */}
                <div className='relative'>
                    <div className={`h-20 w-20 rounded-full bg-pink-100 border-4 border-pink-300 flex items-center justify-center ${companionType.color}`}>
                        <i className={`${companionType.icon} text-4xl`}></i>
                    </div>
                    <div className='absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white'></div>
                </div>

                <div className='w-full mt-3'>
                    {/* Companion Type */}
                    <div className='flex items-center gap-3 p-2 border-b-2'>
                        <div className='flex-1'>
                            <h3 className='text-base font-semibold'>{companionType.name}</h3>
                            <div className='flex gap-1 mt-0.5'>
                                <span className='text-yellow-400 text-sm'>★★★★★</span>
                                <span className='text-xs text-gray-600'>(Available)</span>
                            </div>
                        </div>
                        <i className={`${companionType.icon} ${companionType.color} text-lg`}></i>
                    </div>

                    {/* Schedule */}
                    <div className='flex items-center gap-3 p-2 border-b-2'>
                        <i className="ri-calendar-line text-blue-500"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Schedule</h3>
                            <p className='text-xs text-gray-600'>Today • Flexible timing</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className='flex items-center gap-3 p-2 border-b-2'>
                        <i className="ri-map-pin-user-fill text-purple-500"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Meeting Point</h3>
                            <p className='text-xs text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className='flex items-center gap-3 p-2 border-b-2'>
                        <i className="ri-map-pin-2-fill text-red-500"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Activity</h3>
                            <p className='text-xs text-gray-600'>{props.destination}</p>
                        </div>
                    </div>

                    {/* Cost */}
                    <div className='flex items-center gap-3 p-2 bg-green-50 border-l-4 border-green-500'>
                        <i className="ri-coin-line text-green-600"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Cost Per Person</h3>
                            <p className='text-xs text-green-700 font-semibold'>₹{props.fare[props.vehicleType]}</p>
                        </div>
                    </div>

                    {/* Safety Features */}
                    <div className='bg-blue-50 p-2 border-l-4 border-blue-500 mt-2'>
                        <p className='text-xs text-blue-800'>
                            <i className="ri-shield-check-line"></i> Verified companions • Emergency contact shared
                        </p>
                    </div>
                </div>

                <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.createRide()
                }} className='w-full mt-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold p-2 rounded-lg transition text-sm'>
                    <i className="ri-heart-fill"></i> Confirm & Find Match
                </button>

                <button onClick={() => {
                    props.setConfirmRidePanel(false)
                }} className='w-full mt-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold p-2 rounded-lg transition text-sm'>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide