import React, { useEffect, useState } from 'react'
import { fetchAvailableCompanions } from '../utils/companions'
import { createCompanionRequest } from '../utils/companionRequests'

const VehiclePanel = (props) => {
    const [showRatingOptions, setShowRatingOptions] = useState(false)
    const [minRating, setMinRating] = useState(4)
    const [companions, setCompanions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [requestingCompanionId, setRequestingCompanionId] = useState('')

    useEffect(() => {
        const loadCompanions = async () => {
            try {
                setLoading(true)
                setError('')
                const availableCompanions = await fetchAvailableCompanions()
                setCompanions(availableCompanions)
            } catch (loadError) {
                console.error('Failed to load companions:', loadError)
                setError(loadError.response?.data?.message || 'Unable to load available companions right now.')
            } finally {
                setLoading(false)
            }
        }

        loadCompanions()
    }, [])

    const handleRequestCompanion = async (companion) => {
        if (!props.ride?._id) {
            setError('Schedule the journey first so a request can be sent.')
            return
        }

        try {
            setRequestingCompanionId(companion.id)
            setError('')

            const createdRequest = await createCompanionRequest({
                rideId: props.ride._id,
                receiverId: companion.id,
                message: `Hi ${companion.name}, our route and timing look similar. Would you like to join as my companion?`
            })

            props.selectVehicle(companion.id)
            if (props.onCompanionSelect) props.onCompanionSelect(companion)
            if (props.onRequestCreated) props.onRequestCreated(createdRequest)
            if (props.onRequestCompanion) props.onRequestCompanion(companion)
            if (props.setShowCompanionList) props.setShowCompanionList(false)
            props.setConfirmRidePanel(true)
        } catch (requestError) {
            console.error('Failed to create companion request:', requestError)
            setError(requestError.response?.data?.message || 'Unable to send companion request right now.')
        } finally {
            setRequestingCompanionId('')
        }
    }

    const filteredCompanions = companions.filter((companion) => companion.rating >= minRating)

    return (
        <div className='rounded-[30px] border border-emerald-100 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-6'>
            <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                <div>
                    <p className='text-xs font-bold uppercase tracking-[0.18em] text-emerald-500'>Companion Matches</p>
                    <h3 className='mt-2 text-2xl font-black text-slate-900'>Available Companions</h3>
                    <p className='mt-2 max-w-2xl text-sm text-slate-500'>
                        Choose a verified travel buddy with a matching route and send a request.
                    </p>
                </div>
                <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-sm font-semibold text-slate-600'>Filters</span>
                <div className='relative'>
                    <button
                        onClick={() => setShowRatingOptions(!showRatingOptions)}
                        className='px-3 py-1 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold'
                    >
                        Minimum Rating {minRating}+
                    </button>
                    {showRatingOptions && (
                        <div className='absolute top-full left-0 mt-1 bg-white border border-blue-300 rounded-lg shadow-lg z-10'>
                            {[3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => {
                                        setMinRating(rating)
                                        setShowRatingOptions(false)
                                    }}
                                    className='block w-full px-3 py-2 text-left text-xs hover:bg-blue-50'
                                >
                                    {rating}+ Stars
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button className='px-3 py-1 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold'>Max. Dist. 1km</button>
            </div>
            </div>

            {error && (
                <div className='mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                    {error}
                </div>
            )}

            {loading && (
                <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500'>
                    Loading available companions...
                </div>
            )}

            {!loading && filteredCompanions.length === 0 && (
                <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-500'>
                    No companions available for the current filter yet.
                </div>
            )}

            <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {filteredCompanions.map((companion) => (
                    <div key={companion.id} className='flex h-full flex-col rounded-[26px] border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm'>
                        <div className='flex items-start gap-4'>
                            <img src={companion.image} alt='companion profile' className='h-24 w-24 rounded-2xl object-cover' />
                            <div className='min-w-0 flex-1'>
                                <h4 className='text-lg font-bold text-slate-900'>{companion.name}</h4>
                                <p className='mt-1 text-sm text-slate-600'>{companion.verified ? 'Aadhar Verified' : 'Verification pending'}</p>
                                <p className='mt-1 text-xs text-slate-500'>{companion.type}</p>
                                <p className='mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>
                                    Rating {companion.rating}
                                </p>
                            </div>
                        </div>
                        <div className='mt-5 space-y-2'>
                        <button
                            onClick={() => handleRequestCompanion(companion)}
                            disabled={requestingCompanionId === companion.id}
                            className={`w-full py-2 rounded-lg text-sm font-semibold transition ${requestingCompanionId === companion.id ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            {requestingCompanionId === companion.id ? 'Sending Request...' : 'Request Companion'}
                        </button>
                        <button
                            onClick={() => alert(`View profile for ${companion.name}`)}
                            className='w-full mt-2 border border-blue-300 text-blue-700 py-2 rounded-lg text-sm hover:bg-blue-100'
                        >
                            View Profile
                        </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className='text-xs text-slate-500 mt-4'>
                <i className="ri-shield-check-line"></i> All companions are identity-verified and safe
            </div>
        </div>
    )
}

export default VehiclePanel
