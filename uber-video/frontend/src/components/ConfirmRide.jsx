import React from 'react'

const ConfirmRide = ({
  pickup,
  destination,
  vehicleType,
  selectedCompanion,
  setConfirmRidePanel,
  setRideConfirmedPanel,
  setSchedule,
  setVehicleFound
}) => {
  const companion = selectedCompanion || {
    name: 'Selected companion',
    type: 'Travel buddy',
    icon: 'ri-team-fill',
    color: 'text-pink-500',
    rating: 5
  }

  const handleConfirm = () => {
    setSchedule?.('Schedule: Now')
    setVehicleFound?.(true)
    setConfirmRidePanel?.(false)
    setRideConfirmedPanel?.(true)
  }

  return (
    <div className='w-full rounded-t-3xl bg-white p-5 shadow-lg'>
      <button
        type='button'
        onClick={() => setConfirmRidePanel?.(false)}
        className='mx-auto mb-3 block text-3xl text-gray-300'
      >
        <i className='ri-arrow-down-wide-line' />
      </button>

      <h3 className='mb-4 text-2xl font-semibold'>Confirm Ride</h3>

      <div className='space-y-3'>
        <div className='flex items-center gap-3 rounded-xl border border-slate-200 p-3'>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 ${companion.color}`}>
            <i className={`${companion.icon} text-2xl`} />
          </div>
          <div>
            <p className='font-semibold text-slate-900'>{companion.name}</p>
            <p className='text-sm text-slate-500'>{companion.type}</p>
            <p className='text-sm text-amber-500'>? {companion.rating}</p>
          </div>
        </div>

        <div className='rounded-xl border border-slate-200 p-3'>
          <p className='text-sm text-slate-500'>Pickup</p>
          <p className='font-medium text-slate-900'>{pickup || 'Not selected'}</p>
        </div>

        <div className='rounded-xl border border-slate-200 p-3'>
          <p className='text-sm text-slate-500'>Destination</p>
          <p className='font-medium text-slate-900'>{destination || 'Not selected'}</p>
        </div>

        <div className='rounded-xl border border-slate-200 p-3'>
          <p className='text-sm text-slate-500'>Travel mode</p>
          <p className='font-medium capitalize text-slate-900'>{vehicleType || 'cab'}</p>
        </div>
      </div>

      <button
        type='button'
        onClick={handleConfirm}
        className='mt-5 w-full rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800'
      >
        Confirm Ride
      </button>

      <button
        type='button'
        onClick={() => setConfirmRidePanel?.(false)}
        className='mt-2 w-full rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-300'
      >
        Cancel
      </button>
    </div>
  )
}

export default ConfirmRide
