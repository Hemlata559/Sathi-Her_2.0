import React, { useState } from 'react'
import LiveTracking from './LiveTracking'

// Simple deterministic coord generator (frontend-only) for display purposes
function generateCoords(seedStr) {
    let seed = 0
    for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0
    const lat = 12 + (seed % 8000) / 1000 // 12.000 - 19.999
    const lon = 77 + ((seed >> 3) % 8000) / 1000 // 77.000 - 84.999
    return { lat: Number(lat.toFixed(5)), lon: Number(lon.toFixed(5)) }
}

function suggestMeetingPoints(pickup) {
    const base = pickup || 'Central'
    return [
        { id: 1, label: `Bus Stand near ${base}`, type: 'Bus Stand', coords: generateCoords(base + 'bus') },
        { id: 2, label: `Metro Station near ${base}`, type: 'Metro Station', coords: generateCoords(base + 'metro') },
        { id: 3, label: `Famous Point near ${base}`, type: 'Famous Point', coords: generateCoords(base + 'famous') }
    ]
}

const RideConfirmed = (props) => {
    const [showChat, setShowChat] = useState(false)
    const [showMeetingPoint, setShowMeetingPoint] = useState(false)
    const [showLiveTracking, setShowLiveTracking] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, sender: 'companion', text: 'Hi! Great that we matched! 😊' },
        { id: 2, sender: 'user', text: 'Yes! Looking forward to meeting you' },
        { id: 3, sender: 'companion', text: 'I\'ll be at the meeting point 10 minutes early!' }
    ])
    const [newMessage, setNewMessage] = useState('')

    const companion = props.selectedCompanion || {
        name: 'Travel Companion',
        type: 'Companion',
        icon: 'ri-team-fill',
        color: 'text-pink-500',
        rating: 5,
        verified: true
    }

    const [selectedMeeting, setSelectedMeeting] = useState(null)
    const meetingSuggestions = suggestMeetingPoints(props.pickup)

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, sender: 'user', text: newMessage }])
            setNewMessage('')
        }
    }

    // Show live tracking panel
    if (showLiveTracking) {
        return (
            <div className='max-h-[85vh] overflow-y-auto'>
                <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                    setShowLiveTracking(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

                {/* Live Tracking Header */}
                <div className='text-center p-2 mb-2'>
                    <h3 className='text-lg font-bold text-gray-800'>Live Tracking</h3>
                    <p className='text-xs text-gray-600 mt-0.5'>Real-time location sharing with {companion.name}</p>
                </div>

                {/* Live Tracking Map */}
                <div className='w-full h-[60vh] rounded-lg overflow-hidden border-2 border-pink-200 mb-3 mx-3'>
                    <LiveTracking pickup={props.pickup} destination={props.destination} />
                </div>

                {/* Status Info */}
                <div className='bg-green-50 p-2 px-3 border-l-4 border-green-500 mb-3 mx-3 rounded'>
                    <p className='text-xs text-green-800 font-medium'>
                        <i className='ri-map-pin-user-fill text-green-600 mr-1'></i>
                        Your location is being shared with {companion.name} in real-time
                    </p>
                </div>

                {/* Back Button */}
                <button 
                    onClick={() => setShowLiveTracking(false)}
                    className='w-[93%] mx-auto block bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition text-sm mb-2'
                >
                    Back to Confirmation
                </button>
            </div>
        )
    }

    // Show chat panel
    if (showChat) {
        return (
            <div className='max-h-[85vh] overflow-y-auto'>
                <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                    setShowChat(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

                {/* Chat Header */}
                <div className='text-center p-2 mb-2 border-b'>
                    <h3 className='text-lg font-bold text-gray-800'>{companion.name}</h3>
                    <p className='text-xs text-gray-600 mt-0.5'>{companion.type}</p>
                </div>

                {/* Messages Container */}
                <div className='flex flex-col gap-2 px-3 pb-3 h-[50vh] overflow-y-auto'>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-lg ${
                                msg.sender === 'user' 
                                    ? 'bg-pink-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                            }`}>
                                <p className='text-sm'>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className='flex gap-2 px-3 py-2 border-t'>
                    <input 
                        type='text'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder='Type a message...'
                        className='flex-1 bg-gray-100 px-3 py-2 rounded-lg text-sm border border-gray-300 focus:outline-none focus:border-pink-500'
                    />
                    <button 
                        onClick={handleSendMessage}
                        className='bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition text-sm font-medium'
                    >
                        <i className='ri-send-plane-fill'></i>
                    </button>
                </div>

                {/* Back Button */}
                <button 
                    onClick={() => setShowChat(false)}
                    className='w-full mt-2 mx-3 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition text-sm'
                >
                    Back to Confirmation
                </button>
            </div>
        )
    }

    // Show meeting point panel
    if (showMeetingPoint) {
        return (
            <div className='max-h-[85vh] overflow-y-auto'>
                <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                    setShowMeetingPoint(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

                {/* Meeting Point Header */}
                <div className='text-center p-2 mb-2'>
                    <h3 className='text-lg font-bold text-gray-800'>Meeting Points</h3>
                    <p className='text-xs text-gray-600 mt-0.5'>Coordinate with {companion.name}</p>
                </div>

                {/* Your & Companion Locations with coords */}
                <div className='grid grid-cols-1 gap-3 px-3'>
                    <div className='bg-blue-50 border-l-4 border-blue-500 p-3 rounded'>
                        <h4 className='text-sm font-semibold text-blue-900 mb-2'>Your Location</h4>
                        <div className='flex items-start gap-2'>
                            <i className='ri-map-pin-user-fill text-blue-600 text-lg mt-0.5'></i>
                            <div>
                                <p className='text-sm font-medium text-blue-900'>{props.pickup}</p>
                                <p className='text-xs text-blue-700 mt-0.5'>Pickup Point</p>
                                <p className='text-xs text-blue-700 mt-1'>Coords: {`${generateCoords(props.pickup).lat}, ${generateCoords(props.pickup).lon}`}</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-purple-50 border-l-4 border-purple-500 p-3 rounded'>
                        <h4 className='text-sm font-semibold text-purple-900 mb-2'>{companion.name}'s Location</h4>
                        <div className='flex items-start gap-2'>
                            <i className='ri-map-pin-user-fill text-purple-600 text-lg mt-0.5'></i>
                            <div>
                                <p className='text-sm font-medium text-purple-900'>Nearby your area</p>
                                <p className='text-xs text-purple-700 mt-0.5'>Approximate distance: 0.5 km</p>
                            </div>
                        </div>
                    </div>

                    {/* Suggested meeting points (near pickup) */}
                    <div className='bg-green-50 border-l-4 border-green-500 p-3 rounded'>
                        <h4 className='text-sm font-semibold text-green-900 mb-2'>
                            <i className='ri-checkbox-circle-line text-green-600 mr-1'></i>
                            Suggested Meeting Points
                        </h4>
                        <div className='space-y-2'>
                            {meetingSuggestions.map((s) => (
                                <div key={s.id} className={`p-2 rounded-lg flex items-center justify-between ${selectedMeeting && selectedMeeting.id === s.id ? 'bg-white border-2 border-green-400' : 'bg-green-50'}`}>
                                    <div>
                                        <div className='text-sm font-medium text-green-900'>{s.label}</div>
                                        <div className='text-xs text-green-700'>{s.type} • Coords: {s.coords.lat}, {s.coords.lon}</div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <button onClick={() => setSelectedMeeting(s)} className='bg-teal-500 text-white px-3 py-1 rounded text-sm'>Select</button>
                                    </div>
                                </div>
                            ))}

                            {selectedMeeting && (
                                <div className='mt-2 p-2 bg-white rounded border'>
                                    <div className='flex justify-between items-center'>
                                        <div>
                                            <div className='text-sm font-semibold'>Selected: {selectedMeeting.label}</div>
                                            <div className='text-xs text-gray-600'>Coords: {selectedMeeting.coords.lat}, {selectedMeeting.coords.lon}</div>
                                        </div>
                                        <button onClick={() => {
                                            // copy to clipboard as quick action
                                            navigator.clipboard?.writeText(`${selectedMeeting.coords.lat}, ${selectedMeeting.coords.lon}`)
                                            alert('Meeting point coordinates copied')
                                        }} className='bg-gray-200 px-2 py-1 rounded text-sm'>Copy</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className='bg-yellow-50 border-l-4 border-yellow-500 p-3 mx-3 mb-3 rounded'>
                    <h4 className='text-sm font-semibold text-yellow-900 mb-1'>
                        <i className='ri-lightbulb-line text-yellow-600 mr-1'></i>
                        Tips
                    </h4>
                    <ul className='text-xs text-yellow-800 space-y-1 ml-2'>
                        <li>• Arrive 5-10 minutes early</li>
                        <li>• Share your location via chat</li>
                        <li>• Look for a person with verified badge</li>
                    </ul>
                </div>

                {/* Back Button */}
                <button 
                    onClick={() => setShowMeetingPoint(false)}
                    className='w-[93%] mx-auto block bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition text-sm mb-2'
                >
                    Back to Confirmation
                </button>
            </div>
        )
    }

    // Main confirmation view
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRideConfirmedPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <div className='flex gap-2 justify-between flex-col items-center'>
                {/* Success Header */}
                <div className='w-full text-center mb-2'>
                    <div className='flex justify-center mb-2'>
                        <div className='h-16 w-16 rounded-full bg-green-100 border-4 border-green-400 flex items-center justify-center'>
                            <i className="ri-check-double-fill text-green-600 text-3xl"></i>
                        </div>
                    </div>
                    <h2 className='text-2xl font-bold text-green-700'>Ride Confirmed!</h2>
                    <p className='text-xs text-gray-600 mt-1'>You matched with a great companion</p>
                </div>

                {/* Companion Profile */}
                <div className='w-full bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 mb-3'>
                    <div className='flex items-center gap-3'>
                        {/* Profile Icon */}
                        <div className='relative'>
                            <div className={`h-16 w-16 rounded-full bg-pink-100 border-4 border-pink-300 flex items-center justify-center ${companion.color}`}>
                                <i className={`${companion.icon} text-2xl`}></i>
                            </div>
                            <div className='absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white'></div>
                        </div>

                        {/* Companion Info */}
                        <div className='flex-1'>
                            <h3 className='text-lg font-semibold text-gray-800'>{companion.name}</h3>
                            <p className='text-xs text-gray-600'>{companion.type}</p>
                            <div className='flex gap-1 mt-0.5 items-center'>
                                <i className='ri-star-fill text-yellow-400'></i>
                                <span className='text-sm font-medium text-gray-800'>{companion.rating} • Trip verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Journey Details */}
                <div className='w-full space-y-2 mb-3'>
                    {/* Schedule */}
                    <div className='flex items-center gap-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded'>
                        <i className="ri-calendar-line text-blue-600"></i>
                        <div>
                            <h3 className='text-xs font-medium text-blue-900'>Schedule</h3>
                            <p className='text-xs text-blue-700'>{props.schedule || 'Today • Flexible'}</p>
                        </div>
                    </div>

                    {/* From */}
                    <div className='flex items-center gap-3 p-2 bg-green-50 border-l-4 border-green-500 rounded'>
                        <i className="ri-map-pin-user-fill text-green-600"></i>
                        <div>
                            <h3 className='text-xs font-medium text-green-900'>From</h3>
                            <p className='text-xs text-green-700'>{props.pickup}</p>
                        </div>
                    </div>

                    {/* To */}
                    <div className='flex items-center gap-3 p-2 bg-red-50 border-l-4 border-red-500 rounded'>
                        <i className="ri-map-pin-2-fill text-red-600"></i>
                        <div>
                            <h3 className='text-xs font-medium text-red-900'>To</h3>
                            <p className='text-xs text-red-700'>{props.destination}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='w-full space-y-2 mb-3'>
                    {/* Meeting Point */}
                    <button 
                        onClick={() => setShowMeetingPoint(true)}
                        className='w-full flex items-center gap-3 p-3 bg-teal-50 border-l-4 border-teal-500 rounded hover:bg-teal-100 transition'
                    >
                        <i className="ri-map-pin-range-line text-teal-600 text-lg"></i>
                        <div className='flex-1 text-left'>
                            <h3 className='text-sm font-medium text-teal-900'>Meeting Point</h3>
                            <p className='text-xs text-teal-700'>Coordinate with your companion</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-teal-600"></i>
                    </button>

                    {/* Chat */}
                    <button 
                        onClick={() => setShowChat(true)}
                        className='w-full flex items-center gap-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded hover:bg-blue-100 transition'
                    >
                        <i className="ri-chat-3-line text-blue-600 text-lg"></i>
                        <div className='flex-1 text-left'>
                            <h3 className='text-sm font-medium text-blue-900'>Chat</h3>
                            <p className='text-xs text-blue-700'>Chat to coordinate meeting</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-blue-600"></i>
                    </button>

                    {/* Live Tracking */}
                    <button 
                        onClick={() => setShowLiveTracking(true)}
                        className='w-full flex items-center gap-3 p-3 bg-orange-50 border-l-4 border-orange-500 rounded hover:bg-orange-100 transition'
                    >
                        <i className="ri-map-pin-line text-orange-600 text-lg"></i>
                        <div className='flex-1 text-left'>
                            <h3 className='text-sm font-medium text-orange-900'>Start Journey</h3>
                            <p className='text-xs text-orange-700'>Begin live tracking</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-orange-600"></i>
                    </button>
                </div>

                {/* Safety Info */}
                <div className='w-full bg-green-50 p-3 border-l-4 border-green-500 rounded mb-3'>
                    <p className='text-xs text-green-800'>
                        <i className="ri-shield-check-line text-green-600 mr-1"></i>
                        <span className='font-medium'>Safe Journey Ahead</span> • Share your trip with emergency contacts
                    </p>
                </div>

                <button 
                    onClick={() => props.setRideConfirmedPanel(false)}
                    className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold p-2 rounded-lg transition text-sm'
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default RideConfirmed
