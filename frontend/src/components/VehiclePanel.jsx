import React from 'react'
import user1 from '../assets/user1.png'
import user2 from '../assets/user2.png'
import image from '../assets/image.png'

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Choose Your Sathi</h3>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
            }} className='flex border-2 active:border-black  mb-2 rounded-xl w-full p-3  items-center justify-between'>
                <img className='h-14 w-14 rounded-full object-cover' src={user1} alt="" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>Akshita<span><i className="ri-user-3-fill"></i></span></h4>
                    <h5 className='font-medium text-sm'>20 mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>1 km away</p>
                </div>
                <h2 className='text-lg font-semibold'>₹{props.fare.car}</h2>
            </div>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3  items-center justify-between'>
                <img className='h-14 w-14 rounded-full object-cover' src={user2} alt="" />
                <div className='-ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>Mansi <span><i className="ri-user-3-fill"></i></span></h4>
                    <h5 className='font-medium text-sm'>5 mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>300 m away</p>
                </div>
                <h2 className='text-lg font-semibold'>₹{props.fare.moto}</h2>
            </div>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3  items-center justify-between'>
                <img className='h-14 w-14 rounded-full object-cover' src={image} alt="" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>Astha <span><i className="ri-user-3-fill"></i></span></h4>
                    <h5 className='font-medium text-sm'>8 mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>600 m away</p>
                </div>
                <h2 className='text-lg font-semibold'>₹{props.fare.auto}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel