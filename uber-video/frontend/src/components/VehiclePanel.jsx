import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-3'>Choose Companion </h3>
            
            {/* Companion Type 1 */}
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
            }} className='flex border-2 border-pink-200 hover:border-pink-500 active:border-pink-700 mb-2 rounded-xl w-full p-3 items-center justify-between bg-pink-50 cursor-pointer transition'>
                <i className="ri-team-fill text-pink-500 text-3xl"></i>
                <div className='ml-2 w-1/2'>
                    <h4 className='font-semibold text-base'>Alia Rajput</h4>
                    <h5 className='font-medium text-xs text-gray-600'>Aadhar Verified User</h5>
                    <p className='font-normal text-xs text-gray-600'>Rating: 3.5</p>
                </div>
                <div className='text-right'>
                    <h2 className='text-sm font-semibold text-green-600'>*{props.fare.car}</h2>
                    <p className='text-xs text-gray-600'>connect</p>
                </div>
            </div>

            {/* Companion Type 2 */}
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex border-2 border-pink-200 hover:border-pink-500 active:border-pink-700 mb-2 rounded-xl w-full p-3 items-center justify-between bg-pink-50 cursor-pointer transition'>
                <i className="ri-user-follow-fill text-blue-500 text-3xl"></i>
                <div className='ml-2 w-1/2'>
                    <h4 className='font-semibold text-base'>Akshita Negi</h4>
                    <h5 className='font-medium text-xs text-gray-600'>Aadhar Verified User</h5>
                    <p className='font-normal text-xs text-gray-600'>Rating: 4.5</p>
                </div>
                <div className='text-right'>
                    <h2 className='text-sm font-semibold text-green-600'>*{props.fare.moto}</h2>
                    <p className='text-xs text-gray-600'>connect</p>
                </div>
            </div>

            {/* Companion Type 3 */}
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex border-2 border-pink-200 hover:border-pink-500 active:border-pink-700 mb-2 rounded-xl w-full p-3 items-center justify-between bg-pink-50 cursor-pointer transition'>
                <i className="ri-team-line text-purple-500 text-3xl"></i>
                <div className='ml-2 w-1/2'>
                    <h4 className='font-semibold text-base'>Himanshi Sharma</h4>
                    <h5 className='font-medium text-xs text-gray-600'>Aadhar Verified User</h5>
                    <p className='font-normal text-xs text-gray-600'>Rating: 5</p>
                </div>
                <div className='text-right'>
                    <h2 className='text-sm font-semibold text-green-600'>*{props.fare.auto}</h2>
                    <p className='text-xs text-gray-600'>connect</p>
                </div>
            </div>

            <div className='bg-blue-50 p-2 rounded-lg mt-3 border-l-4 border-blue-500'>
                <p className='text-xs text-blue-800'>
                    <i className="ri-shield-check-line"></i> All companions are identity-verified and safe
                </p>
            </div>
        </div>
    )
}

export default VehiclePanel