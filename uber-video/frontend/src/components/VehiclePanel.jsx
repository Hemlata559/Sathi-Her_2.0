import React from 'react'

const VehiclePanel = (props) => {
    const companions = [
        {
            id: 'car',
            name: 'Alia Rajput',
            type: 'Group Activity',
            verified: true,
            rating: 3.5,
            icon: 'ri-team-fill',
            color: 'text-pink-500'
        },
        {
            id: 'moto',
            name: 'Akshita Negi',
            type: 'Close Friend',
            verified: true,
            rating: 4.5,
            icon: 'ri-user-follow-fill',
            color: 'text-blue-500'
        },
        {
            id: 'auto',
            name: 'Himanshi Sharma',
            type: 'Adventure Partner',
            verified: true,
            rating: 5,
            icon: 'ri-team-line',
            color: 'text-purple-500'
        }
    ]

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-3'>Choose Companion </h3>
            
            {companions.map((companion) => (
                <div 
                    key={companion.id}
                    onClick={() => {
                        props.selectVehicle(companion.id)
                        // Pass companion data to parent
                        if (props.onCompanionSelect) {
                            props.onCompanionSelect(companion)
                        }
                        // Close companion list
                        if (props.setShowCompanionList) {
                            props.setShowCompanionList(false)
                        }
                        // Open confirm ride panel
                        props.setConfirmRidePanel(true)
                    }} 
                    className='flex border-2 border-pink-200 hover:border-pink-500 active:border-pink-700 mb-2 rounded-xl w-full p-3 items-center justify-between bg-pink-50 cursor-pointer transition'
                >
                    <i className={`${companion.icon} ${companion.color} text-3xl`}></i>
                    <div className='ml-2 w-1/2'>
                        <h4 className='font-semibold text-base'>{companion.name}</h4>
                        <h5 className='font-medium text-xs text-gray-600'>Aadhar Verified User</h5>
                        <p className='font-normal text-xs text-gray-600'>Rating: {companion.rating}</p>
                    </div>
                    <div className='text-right'>
                        <h2 className='text-sm font-semibold text-green-600'>*{props.fare?.[companion.id]}</h2>
                        <p className='text-xs text-gray-600'>connect</p>
                    </div>
                </div>
            ))}

            <div className='bg-blue-50 p-2 rounded-lg mt-3 border-l-4 border-blue-500'>
                <p className='text-xs text-blue-800'>
                    <i className="ri-shield-check-line"></i> All companions are identity-verified and safe
                </p>
            </div>
        </div>
    )
}

export default VehiclePanel