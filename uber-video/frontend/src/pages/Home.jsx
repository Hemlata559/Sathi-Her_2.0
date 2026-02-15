import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import logo from '../assets/logo.png'

import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import RideConfirmed from '../components/RideConfirmed';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const rideConfirmedPanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ rideConfirmedPanel, setRideConfirmedPanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)
    const [travelMode, setTravelMode] = useState('')
    const [selectedCompanion, setSelectedCompanion] = useState(null)
    const [schedule, setSchedule] = useState('Today • Flexible timing')


    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const location = useLocation()
    const { user } = useContext(UserDataContext)

    // Handle companion selection
    const handleCompanionSelect = (companion) => {
        setSelectedCompanion(companion)
    }

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    // If navigated from signup with intent to open the search panel, do it once
    React.useEffect(() => {
        if (location?.state?.openSearchPanel) {
            setPanelOpen(true)
            if (location.state.focusField) setActiveField(location.state.focusField)
            // clear location state by replacing history (optional)
            window.history.replaceState({}, document.title)
        }
    }, [location])

    socket.on('ride-confirmed', ride => {


        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (rideConfirmedPanel) {
            gsap.to(rideConfirmedPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(rideConfirmedPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ rideConfirmedPanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        if (!pickup || !destination || !travelMode) {
            alert('Please enter pickup, destination, and travel mode')
            return
        }

        try {
            setVehiclePanel(true)
            setPanelOpen(false)

            console.log('Sending ride creation request:', {
                pickup,
                destination,
                departureTime: new Date().toISOString(),
                mode: travelMode
            })

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                departureTime: new Date().toISOString(),
                mode: travelMode
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.data) {
                setRide(response.data)
                setVehicleFound(true)
                alert('Journey created! Looking for companions...')
            }
        } catch (error) {
            console.error('Error creating ride:', error)
            console.error('Error response:', error.response?.data || error.message)
            alert(`Error: ${error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message || 'Failed to create journey'}`)
            setVehiclePanel(false)
        }
    }

    async function createRide() {
        // This function is kept for reference - use findTrip instead
    }

    return (
        <div className='h-[100dvh] relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src={logo} alt="App logo" />
            <div className='w-screen overflow-hidden'>
        

                {/* Map with pickup and destination */}
                <div className="w-full h-[60vh] relative overflow-hidden z-0">
                    <LiveTracking pickup={pickup} destination={destination} />
                </div>
                
            </div>
            <div className=' flex flex-col justify-end fixed bottom-0 w-full h-[100dvh]'>
                <div className='min-h-[35%] p-6 bg-white relative flex flex-col justify-between z-20'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find Travel Buddy</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                         onFocus={() => {
                            setPanelOpen(true)
                            setActiveField('pickup')
                        }}
                        onBlur={() => {
                            setTimeout(() => setPanelOpen(false), 800)
                        }}
                            
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                         <select
                            value={travelMode}
                            onChange={(e) => setTravelMode(e.target.value)}
                            className='bg-[#eee] px-4 py-2 text-lg rounded-lg w-full mt-3'
                            >
                            <option value="">Select Travel Mode</option>
                            <option value="walk">Walking</option>
                            <option value="metro">Metro</option>
                            <option value="cab">Private Cab</option>
                            <option value="bus">Bus</option>
                            <option value="mixed">Mixed</option>
                        </select>


                        
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Match
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} 
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehiclePanel={setVehiclePanel}
                    onCompanionSelect={handleCompanionSelect} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    selectedCompanion={selectedCompanion}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setRideConfirmedPanel={setRideConfirmedPanel}
                    setSchedule={setSchedule}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={rideConfirmedPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 max-h-[90vh] overflow-y-auto'>
                <RideConfirmed
                    pickup={pickup}
                    destination={destination}
                    schedule={schedule}
                    selectedCompanion={selectedCompanion}
                    setRideConfirmedPanel={setRideConfirmedPanel} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                    selectVehicle={setVehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    onCompanionSelect={handleCompanionSelect} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 max-h-[90vh] overflow-y-auto'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home