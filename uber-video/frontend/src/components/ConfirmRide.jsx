import React from 'react'
import { useNavigate } from 'react-router-dom'
import LiveTracking from './LiveTracking'

const ConfirmRide = (props) => {
    // Get companion data - use selectedCompanion or fallback to defaults
    const companion = props.selectedCompanion || {
        name: 'Select a Companion',
        type: 'Companion',
        icon: 'ri-team-fill',
        color: 'text-pink-500',
        rating: 5,
        verified: true
    };

    const [showChat, setShowChat] = React.useState(false)
    const [showLiveTracking, setShowLiveTracking] = React.useState(false)
    const [showScheduleSelector, setShowScheduleSelector] = React.useState(false)
    const [selectedSchedule, setSelectedSchedule] = React.useState('Today • Flexible timing')
    const [messages, setMessages] = React.useState([
        { id: 1, sender: 'companion', text: 'Hi! Excited for the journey!' },
        { id: 2, sender: 'user', text: 'Me too! What time works for you?' },
        { id: 3, sender: 'companion', text: 'Around 10 AM would be perfect! 😊' }
    ])
    const [newMessage, setNewMessage] = React.useState('')

    // Local verification & camera states (frontend-only matching stub)
    const [ridesCompleted, setRidesCompleted] = React.useState(props.user?.ridesCompleted ?? 0)
    const [aadhaarVerified, setAadhaarVerified] = React.useState(props.user?.aadhaarVerified ?? false)
    const [showCamera, setShowCamera] = React.useState(false)
    const [capturedImage, setCapturedImage] = React.useState(null)
    const [matchResult, setMatchResult] = React.useState(null) // 'Matched' | 'Not Matched' | null
    const videoRef = React.useRef(null)
    const streamRef = React.useRef(null)

    const scheduleOptions = [
        { id: 1, label: 'Today • Now', time: 'Immediate departure' },
        { id: 2, label: 'Today • Morning (8-12 AM)', time: 'Morning trip' },
        { id: 3, label: 'Today • Afternoon (12-5 PM)', time: 'Afternoon trip' },
        { id: 4, label: 'Today • Evening (5-8 PM)', time: 'Evening trip' },
        { id: 5, label: 'Today • Flexible timing', time: 'Anytime today' },
        { id: 6, label: 'Tomorrow • Morning', time: 'Morning trip tomorrow' }
    ]

    const navigate = useNavigate();
    const [meetingAddress, setMeetingAddress] = React.useState(props.pickup || 'Krishna Nagar bus Stop')
    const [selectedMeeting, setSelectedMeeting] = React.useState(null)

    // Simple deterministic coords generator and meeting point suggestions
    const generateCoords = (seedStr) => {
        let seed = 0
        for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0
        const lat = 12 + (seed % 8000) / 1000
        const lon = 77 + ((seed >> 3) % 8000) / 1000
        return { lat: Number(lat.toFixed(5)), lon: Number(lon.toFixed(5)) }
    }

    const suggestMeetingPoints = (pickup) => {
        const base = pickup || 'Central'
        return [
            { id: 1, label: `Bus Stand near ${base}`, type: 'Bus Stand', coords: generateCoords(base + 'bus') },
            { id: 2, label: `Metro Station near ${base}`, type: 'Metro Station', coords: generateCoords(base + 'metro') },
            { id: 3, label: `Famous Point near ${base}`, type: 'Famous Point', coords: generateCoords(base + 'famous') }
        ]
    }

    const meetingSuggestions = suggestMeetingPoints(props.pickup)

    const getRandomAddress = () => {
        const samples = [
            '221B Baker Street, London',
            '1600 Amphitheatre Parkway, Mountain View, CA',
            'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
            'Shibuya Crossing, Tokyo, Japan',
            'Brandenburg Gate, Pariser Platz, Berlin, Germany',
            'Connaught Place, New Delhi, India'
        ]
        return samples[Math.floor(Math.random() * samples.length)]
    }

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, sender: 'user', text: newMessage }])
            setNewMessage('')
        }
    }

    // Camera & verification helpers (frontend-only stub)
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            streamRef.current = stream
            if (videoRef.current) videoRef.current.srcObject = stream
            setShowCamera(true)
        } catch (e) {
            console.error('Camera access error', e)
            alert('Unable to access camera')
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        setShowCamera(false)
    }

    const captureImage = () => {
        if (!videoRef.current) return
        const video = videoRef.current
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg')
        setCapturedImage(dataUrl)
        // run a frontend-only stub match
        runAIMatch(dataUrl)
        stopCamera()
    }

    const handleFileInput = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setCapturedImage(reader.result)
            runAIMatch(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const runAIMatch = (capturedDataUrl) => {
        // Frontend-only heuristic to simulate matching against stored profile image
        const stored = props.user?.profileImage || localStorage.getItem('profileImage')
        if (!stored) {
            setMatchResult('NoReference')
            return
        }
        // crude similarity: compare string length difference
        const diff = Math.abs(stored.length - capturedDataUrl.length)
        const ratio = diff / Math.max(stored.length, capturedDataUrl.length)
        if (ratio < 0.15) {
            setMatchResult('Matched')
        } else {
            setMatchResult('NotMatched')
        }
    }

    React.useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop())
            }
        }
    }, [])

    // Show schedule selector
    if (showScheduleSelector) {
        return (
            <div className='max-h-[85vh] overflow-y-auto'>
                <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                    setShowScheduleSelector(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

                {/* Schedule Selector Header */}
                <div className='text-center p-2 mb-3'>
                    <h3 className='text-lg font-bold text-gray-800'>Select Schedule</h3>
                    <p className='text-xs text-gray-600 mt-0.5'>When do you want to travel?</p>
                </div>

                {/* Schedule Options */}
                <div className='space-y-2 px-3 pb-3'>
                    {scheduleOptions.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => {
                                setSelectedSchedule(option.label)
                                setShowScheduleSelector(false)
                            }}
                            className={`p-3 rounded-lg border-l-4 cursor-pointer transition ${
                                selectedSchedule === option.label
                                    ? 'bg-blue-50 border-l-4 border-blue-500'
                                    : 'bg-gray-50 border-l-4 border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            <div className='flex items-center gap-2'>
                                {selectedSchedule === option.label && (
                                    <i className='ri-checkbox-circle-fill text-blue-600 text-lg'></i>
                                )}
                                {selectedSchedule !== option.label && (
                                    <i className='ri-checkbox-blank-circle-line text-gray-400 text-lg'></i>
                                )}
                                <div className='flex-1'>
                                    <h4 className='text-sm font-semibold text-gray-800'>{option.label}</h4>
                                    <p className='text-xs text-gray-600'>{option.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Button */}
                <button 
                    onClick={() => setShowScheduleSelector(false)}
                    className='w-[93%] mx-auto block bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition text-sm'
                >
                    Back to Confirm
                </button>
            </div>
        )
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
                    Back to Confirm
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
                    Back to Confirm
                </button>
            </div>
        )
    }

    return (
        <div className='w-full z-30 bg-white max-h-[90vh] overflow-y-auto p-4 rounded-t-lg shadow-lg'>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                if (props.setConfirmRidePanel) props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-3'>Confirm Companion Match</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                {/* Profile Icon */}
                <div className='relative'>
                    <div className={`h-20 w-20 rounded-full bg-pink-100 border-4 border-pink-300 flex items-center justify-center ${companion.color}`}>
                        <i className={`${companion.icon} text-4xl`}></i>
                    </div>
                    <div className='absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white'></div>
                </div>

                <div className='w-full mt-3'>
                    {/* Companion Info */}
                    <div className='flex items-center gap-3 p-2 border-b-2'>
                        <div className='flex-1'>
                            <h3 className='text-base font-semibold'>{companion.name}</h3>
                            <p className='text-xs text-gray-600 font-medium'>{companion.type}</p>
                            <div className='flex gap-1 mt-0.5'>
                                <span className='text-yellow-400 text-sm'>★ {companion.rating}</span>
                                <span className='text-xs text-gray-600'>(Available)</span>
                            </div>
                        </div>
                        <i className={`${companion.icon} ${companion.color} text-lg`}></i>
                    </div>

                    {/* Schedule */}
                    <div onClick={() => setShowScheduleSelector(true)} className='cursor-pointer flex items-center gap-3 p-2 border-b-2 hover:bg-blue-50 transition rounded'>
                        <i className="ri-calendar-line text-blue-500"></i>
                        <div className='flex-1'>
                            <h3 className='text-sm font-medium'>Schedule</h3>
                            <p className='text-xs text-gray-600'>{selectedSchedule}</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400"></i>
                    </div>

                    {/* Location */}
                    <div className='cursor-pointer flex flex-col gap-2 p-2 border-b-2'>
                        <div className='flex items-center gap-3' title='Click to generate random address' onClick={() => setMeetingAddress(getRandomAddress())}>
                            <i className="ri-map-pin-user-fill text-purple-500"></i>
                            <div>
                                <h3 className='text-sm font-medium'>Starting Point</h3>
                                <p className='text-xs text-gray-600'>{props.pickup}</p>
                            </div>
                        </div>

                        {/* Auto-suggest meeting points near pickup */}
                        <div className='mt-2'>
                            <h4 className='text-xs text-gray-700 font-medium mb-1'>Suggested meeting points</h4>
                            <div className='flex gap-2 overflow-x-auto'>
                                {meetingSuggestions.map(s => (
                                    <div key={s.id} className={`px-3 py-2 rounded-lg border ${selectedMeeting && selectedMeeting.id === s.id ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'}`}>
                                        <div className='text-xs font-semibold text-gray-800'>{s.label}</div>
                                        <div className='text-[11px] text-gray-600'>{s.type}</div>
                                        <div className='text-[11px] text-gray-500 mt-1'>Coords: {s.coords.lat}, {s.coords.lon}</div>
                                        <button onClick={() => { setSelectedMeeting(s); setMeetingAddress(s.label) }} className='mt-2 w-full bg-teal-500 text-white text-xs py-1 rounded'>Use</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className='flex items-center gap-3 p-2 border-b-2'>
                        <i className="ri-map-pin-2-fill text-red-500"></i>
                        <div>
                            <h3 className='text-sm font-medium'>Destination</h3>
                            <p className='text-xs text-gray-600'>{props.destination}</p>
                        </div>
                    </div>

                    {/* Verification & Safety */}
                    <div className='space-y-2'>
                        <div className='flex items-center justify-between p-2 border-b-2'>
                            <div>
                                <h4 className='text-sm font-medium'>Your profile</h4>
                                <p className='text-xs text-gray-600'>Rides completed: <span className='font-semibold'>{ridesCompleted}</span></p>
                            </div>
                            <div className='text-right'>
                                <p className='text-xs text-gray-600'>Aadhaar: {aadhaarVerified ? <span className='text-green-700 font-medium'>Verified</span> : <span className='text-red-600 font-medium'>Not verified</span>}</p>
                            </div>
                        </div>

                        <div className='p-2'>
                            <h4 className='text-sm font-medium mb-1'>Verify now (camera)</h4>
                            <p className='text-xs text-gray-600 mb-2'>Open camera and capture a selfie to verify account ownership.</p>

                            {!showCamera && (
                                <div className='flex gap-2'>
                                    <button onClick={startCamera} className='bg-blue-500 text-white px-3 py-2 rounded'>Open Camera</button>
                                    <label className='bg-gray-200 px-3 py-2 rounded cursor-pointer'>
                                        <input type='file' accept='image/*' onChange={handleFileInput} className='hidden' />Upload
                                    </label>
                                </div>
                            )}

                            {showCamera && (
                                <div className='mt-2'>
                                    <video ref={videoRef} autoPlay playsInline className='w-full rounded-lg border' />
                                    <div className='flex gap-2 mt-2'>
                                        <button onClick={captureImage} className='bg-green-500 text-white px-3 py-2 rounded'>Capture</button>
                                        <button onClick={stopCamera} className='bg-gray-200 px-3 py-2 rounded'>Cancel</button>
                                    </div>
                                </div>
                            )}

                            {capturedImage && (
                                <div className='mt-3'>
                                    <h5 className='text-sm font-medium'>Captured</h5>
                                    <img src={capturedImage} alt='captured' className='w-32 h-32 object-cover rounded mt-1 border' />
                                    <p className='text-xs mt-1'>Match result: {matchResult === 'Matched' ? <span className='text-green-700 font-medium'>Matched</span> : matchResult === 'NotMatched' ? <span className='text-red-600 font-medium'>Not matched</span> : <span className='text-gray-600'>Pending</span>}</p>
                                </div>
                            )}
                        </div>

                        <div className='bg-green-50 p-2 border-l-4 border-green-500 mt-2'>
                            <p className='text-xs text-green-800'>
                                <i className="ri-shield-check-line"></i> Verified companions • Emergency contact shared
                            </p>
                        </div>
                    </div>

                </div>

                <button onClick={() => {
                    if (props.setRideConfirmedPanel) props.setRideConfirmedPanel(true)
                    if (props.setConfirmRidePanel) props.setConfirmRidePanel(false)
                    if (props.setSchedule) props.setSchedule(selectedSchedule)
                }} className='w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold p-2 rounded-lg transition text-sm'>
                    <i className="ri-check-line"></i> Confirm & Find Match
                </button>

                <button onClick={() => {
                    if (props.setConfirmRidePanel) props.setConfirmRidePanel(false)
                }} className='w-full mt-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold p-2 rounded-lg transition text-sm'>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide