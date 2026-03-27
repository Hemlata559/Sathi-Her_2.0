import React, { useState } from 'react'

const VehiclePanel = (props) => {
    const [showRatingOptions, setShowRatingOptions] = useState(false)
    const [minRating, setMinRating] = useState(4)
    const companions = [
        {
            id: 'car',
            name: 'Alia Rajput',
            type: 'Group Activity',
            verified: true,
            rating: 3.5,
            icon: 'ri-team-fill',
            color: 'text-pink-500',
            image: 'https://optimizerecruitment.ie/wp-content/uploads/2021/12/128-1284293_marina-circle-girl-picture-in-circle-png-transparent.png'
        },
        {
            id: 'moto',
            name: 'Akshita Negi',
            type: 'Close Friend',
            verified: true,
            rating: 4.5,
            icon: 'ri-user-follow-fill',
            color: 'text-blue-500',
            image: 'https://images.squarespace-cdn.com/content/v1/58e167a8414fb5c0b2b8c13e/1503561540900-K0FXVM3QNP4843AJGQCD/Circle+Profile.jpg'
        },
        {
            id: 'auto',
            name: 'Himanshi Sharma',
            type: 'Adventure Partner',
            verified: true,
            rating: 5,
            icon: 'ri-team-line',
            color: 'text-purple-500',
            image: 'https://www.nicepng.com/png/detail/182-1829287_cammy-lin-ux-designer-circle-picture-profile-girl.png'
        }
    ]


    return (
        <div className='p-4'>
            <h3 className='text-2xl font-bold mb-3'>Available Companions</h3>
            <div className='mb-2 flex items-center gap-2 flex-wrap'>
                <span className='text-black-500 text-sm font-semibold'>Filters</span>
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

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {companions.filter((companion) => companion.rating >= minRating).map((companion) => (
                    <div key={companion.id} className='bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm'>
                        <h4 className='text-lg font-bold text-emerald-700 mb-2'>Available Companion</h4>
                        <p className='text-xl font-semibold'>{companion.name}</p>
                        <img src={companion.image || 'https://a.storyblok.com/f/191576/2400x1260/fd054dca6a/round_profile_picture_og_image.webp'} alt='companion profile' className='w-28 h-28 rounded-lg object-cover my-2' />
                        <p className='text-sm text-slate-600'>Aadhar Verified</p>
                        <p className='text-xs text-slate-500 mb-4'>{companion.type}</p>
                        <button
                            onClick={() => {
                                props.selectVehicle(companion.id)
                                if (props.onCompanionSelect) props.onCompanionSelect(companion)
                                if (props.onRequestCompanion) props.onRequestCompanion(companion)
                                if (props.setShowCompanionList) props.setShowCompanionList(false)
                                props.setConfirmRidePanel(true)
                            }}
                            className='w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition'
                        >
                            Request Companion
                        </button>
                        <button
                            onClick={() => alert(`View profile for ${companion.name}`)}
                            className='w-full mt-2 border border-blue-300 text-blue-700 py-2 rounded-lg text-sm hover:bg-blue-100'
                        >
                            View Profile
                        </button>
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