import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

console.log(import.meta.env.VITE_BASE_URL)

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }


    }
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-3'>Confirm Match Details</h3>
            
            {/* Companion Card */}
            <div className='flex items-center justify-between p-2 border-2 border-pink-300 rounded-lg mt-2 bg-pink-50'>
                <div className='flex items-center gap-2'>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <div>
                        <h2 className='text-base font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                        <div className='flex gap-0.5'>
                            <span className='text-yellow-400 text-xs'>★★★★★</span>
                        </div>
                    </div>
                </div>
                <span className='text-xs bg-pink-500 text-white px-2 py-1 rounded-full'>Verified</span>
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

                    {/* Duration */}
                    <div className='flex items-center gap-3 p-2'>
                        <i className="ri-timer-line text-blue-500"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Duration</h3>
                            <p className='text-xs text-gray-600'>~2 hours</p>
                        </div>
                    </div>

                    {/* Cost */}
                    <div className='flex items-center gap-3 p-2 bg-green-50 border-l-4 border-green-500'>
                        <i className="ri-coin-line text-green-600"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Cost Sharing</h3>
                            <p className='text-xs text-gray-600'>₹{props.ride?.fare}</p>
                        </div>
                    </div>
                </div>

                <div className='mt-3 w-full'>
                    <form onSubmit={submitHander}>
                        <div className='mb-2'>
                            <label className='text-xs font-medium text-gray-700'>Enter Verification Code</label>
                            <input 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                type="text" 
                                className='bg-[#eee] px-3 py-2 font-mono text-sm rounded-lg w-full mt-1' 
                                placeholder='4-digit code' 
                                maxLength="4"
                            />
                        </div>

                        <button className='w-full mt-2 text-sm flex justify-center bg-pink-500 hover:bg-pink-600 text-white font-semibold p-2 rounded-lg transition'>
                            <i className="ri-heart-fill mr-1"></i> Confirm Match
                        </button>
                        <button 
                            onClick={() => {
                                props.setConfirmRidePopupPanel(false)
                                props.setRidePopupPanel(false)
                            }} 
                            type="button"
                            className='w-full mt-1 bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 font-semibold p-2 rounded-lg transition'
                        >
                            Cancel
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp