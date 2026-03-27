import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import logo from '../assets/logo.png'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import RideConfirmed from '../components/RideConfirmed'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import ConnectingOverlay from '../components/ConnectingOverlay'
import { SocketContext } from '../context/SocketContext'
import { useLocation } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [rideConfirmedPanel, setRideConfirmedPanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [fare, setFare] = useState({})
  const [vehicleType, setVehicleType] = useState('cabs')
  const [ride, setRide] = useState(null)
  const [travelMode, setTravelMode] = useState('cab')
  const [selectedCompanion, setSelectedCompanion] = useState(null)
  const [schedule, setSchedule] = useState('Set Your Schedule')
  const [showScheduleOptions, setShowScheduleOptions] = useState(false)
  const [scheduleHour, setScheduleHour] = useState('06')
  const [scheduleMinute, setScheduleMinute] = useState('00')
  const [schedulePeriod, setSchedulePeriod] = useState('PM')
  const [customDepartureTime, setCustomDepartureTime] = useState(null)
  const [showConnectingOverlay, setShowConnectingOverlay] = useState(false)

  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const rideConfirmedPanelRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)

  const navigate = useNavigate()
  const { socket } = useContext(SocketContext)
  const location = useLocation()
  const { user } = useContext(UserDataContext)

  useEffect(() => {
    if (!user?._id) return
    socket.emit('join', { userType: 'user', userId: user._id })
  }, [socket, user])

  useEffect(() => {
    if (location?.state?.openSearchPanel) {
      setPanelOpen(true)
      if (location.state.focusField) setActiveField(location.state.focusField)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    socket.on('ride-confirmed', (ride) => {
      setVehicleFound(false)
      setWaitingForDriver(true)
      setRide(ride)
    })
    socket.on('ride-started', (ride) => {
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride } })
    })

    return () => {
      socket.off('ride-confirmed')
      socket.off('ride-started')
    }
  }, [socket, navigate])

  const handlePickupChange = async (e) => {
    setPickup(e.target.value)
    if (!e.target.value) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL}/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setPickupSuggestions(response.data)
    } catch {
      setPickupSuggestions([])
    }
  }

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value)
    if (!e.target.value) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL}/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setDestinationSuggestions(response.data)
    } catch {
      setDestinationSuggestions([])
    }
  }

  const getDepartureTime = () => {
    if (customDepartureTime) return customDepartureTime

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // If schedule includes explicit time, use it
    const timeMatch = schedule.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i)
    if (timeMatch) {
      const [_, timePart, period] = timeMatch
      const [hourStr, minStr] = timePart.split(':')
      let hh = Number(hourStr)
      const mm = Number(minStr)
      if (period.toUpperCase() === 'PM' && hh < 12) hh += 12
      if (period.toUpperCase() === 'AM' && hh === 12) hh = 0
      const target = new Date(today)
      target.setHours(hh, mm, 0, 0)
      return target.toISOString()
    }

    if (schedule.toLowerCase().includes('tomorrow')) {
      return new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
    }

    return now.toISOString()
  }

  const findTrip = async () => {
    if (!pickup || !destination || !travelMode) {
      alert('Please enter pickup, destination, and travel mode')
      return
    }

    try {
      setVehiclePanel(true)
      setPanelOpen(false)
      const departureTime = getDepartureTime()

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL}/rides/create`, {
        pickup,
        destination,
        departureTime,
        mode: travelMode,
        schedule
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

      if (response.data) {
        setRide(response.data)
        setVehicleFound(false)
      }
    } catch (error) {
      console.error('Ride create error:', error)
      alert(`Error: ${error.response?.data?.message || error.message || 'Unable to create ride'}`)
      setVehiclePanel(false)
    }
  }

  useGSAP(() => {
    const target = panelRef.current
    if (!target) return
    if (panelOpen) {
      gsap.to(target, { height: '220px', padding: 20 })
    } else {
      gsap.to(target, { height: '0px', padding: 0 })
    }
  }, [panelOpen])

  useGSAP(() => {
    const pv = vehiclePanelRef.current
    if (!pv) return
    gsap.to(pv, { transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)' })
  }, [vehiclePanel])

  useGSAP(() => {
    const cv = confirmRidePanelRef.current
    if (!cv) return
    gsap.to(cv, { transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)' })
  }, [confirmRidePanel])

  useGSAP(() => {
    const rv = rideConfirmedPanelRef.current
    if (!rv) return
    gsap.to(rv, { transform: rideConfirmedPanel ? 'translateY(0)' : 'translateY(100%)' })
  }, [rideConfirmedPanel])

  useGSAP(() => {
    const wf = waitingForDriverRef.current
    if (!wf) return
    gsap.to(wf, { transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)' })
  }, [waitingForDriver])

  return (
    <div className='h-[100dvh] relative bg-slate-50'>
      {showConnectingOverlay && (
        <div className='absolute inset-0 z-[1001]'>
          <ConnectingOverlay companion={selectedCompanion} onCancel={() => setShowConnectingOverlay(false)} />
        </div>
      )}

      <div className='w-full h-[45vh] relative overflow-hidden z-0'>
        <LiveTracking pickup={pickup} destination={destination} />
      </div>

      <div className='fixed bottom-0 w-full z-[999]'>
        <div className='max-w-[1090px] mx-auto bg-white rounded-t-[30px] p-5 shadow-2xl border-t border-slate-200'>
          <div className='relative flex flex-col md:flex-row items-center justify-between gap-3 mb-0'>
            <div className='bg-white-300 px-4 py-2 rounded-xl'>
              <h2 className='text-2xl font-bold'>Find Travel Buddy</h2>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-2'>
            <div className='flex items-center gap-2'>
              <img src='https://as2.ftcdn.net/jpg/03/63/90/39/1000_F_363903973_6sBZzXzkOA6qKXWreOhK93G6yaHtGhPD.jpg' alt='pickup' className='w-8 h-8 rounded-lg object-cover' />
              <input
                value={pickup}
                onChange={handlePickupChange}
                placeholder='Enter your current location'
                className='flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
              />
            </div>
            <div className='flex items-center gap-2'>
              <img src='https://img.freepik.com/premium-vector/red-pointer-checkpoint-end-point-route-sign-symbol-beginning-end-movement-map-traveler-tourist-destination-pointer-simple-colored-flat-vector-icon-isolated-white-background_71609-6406.jpg' alt='destination' className='w-8 h-8 rounded-lg object-cover' />
              <input
                value={destination}
                onChange={handleDestinationChange}
                placeholder='Enter your destination'
                className='flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
              />
            </div>
          </div>

          <div className='flex gap-2 mt-3'>
            {['cab', 'bus', 'metro', 'walk'].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setTravelMode(mode)
                  setVehicleType(mode)
                }}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl border transition ${travelMode === mode ? 'bg-blue-700 text-white border-blue-800' : 'bg-white text-slate-700 border-slate-300'}`}
              >
                <i className={`ri-${mode === 'cab' ? 'car-line' : mode === 'bus' ? 'bus-line' : mode === 'metro' ? 'train-line' : 'walk-line'} text-xl`} />
                <span className='ml-2'>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </button>
            ))}
          </div>

          <div className='mt-3 w-fit'>
            <button
              type='button'
              className='w-fit min-w-[220px] border border-slate-300 rounded-xl px-4 py-2 text-left flex items-center justify-between'
              onClick={() => setShowScheduleOptions((prev) => !prev)}
            >
              <span className='flex items-center gap-2'>
                <i className='ri-calendar-event-line' />
                {schedule}
              </span>
              <i className={`ri-arrow-${showScheduleOptions ? 'up' : 'down'}-s-line`} />
            </button>

            {showScheduleOptions && (
              <div className='mt-2 p-3 rounded-xl border border-slate-200 bg-white shadow-sm max-w-[420px]'>
                <div className='grid grid-cols-[96px_32px_96px] items-center gap-2 mb-3'>
                  <input
                    type='number'
                    min={1}
                    max={12}
                    value={scheduleHour}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '')
                      if (value === '') {
                        setScheduleHour('')
                        return
                      }
                      if (value.length > 2) value = value.slice(0, 2)
                      const num = parseInt(value, 10)
                      if (!Number.isNaN(num) && num >= 1 && num <= 12) {
                        setScheduleHour(String(num).padStart(2, '0'))
                      }
                    }}
                    className='w-full h-16 text-4xl text-center border rounded-xl'
                  />
                  <div className='text-4xl font-bold text-center'>:</div>
                  <input
                    type='number'
                    min={0}
                    max={59}
                    value={scheduleMinute}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '')
                      if (value === '') {
                        setScheduleMinute('')
                        return
                      }
                      if (value.length > 2) value = value.slice(0, 2)
                      const num = parseInt(value, 10)
                      if (!Number.isNaN(num) && num >= 0 && num <= 59) {
                        setScheduleMinute(String(num).padStart(2, '0'))
                      }
                    }}
                    className='w-full h-16 text-4xl text-center border rounded-xl'
                  />
                </div>

                <div className='grid grid-cols-2 gap-2 mb-3'>
                  <button
                    onClick={() => setSchedulePeriod('AM')}
                    className={`py-3 rounded-xl font-bold ${schedulePeriod === 'AM' ? 'bg-purple-100 border border-purple-500 text-purple-700' : 'border border-slate-300 text-slate-700'}`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => setSchedulePeriod('PM')}
                    className={`py-3 rounded-xl font-bold ${schedulePeriod === 'PM' ? 'bg-purple-100 border border-purple-500 text-purple-700' : 'border border-slate-300 text-slate-700'}`}
                  >
                    PM
                  </button>
                </div>

                <div className='flex justify-end gap-2'>
                  <button
                    onClick={() => setShowScheduleOptions(false)}
                    className='px-4 py-2 rounded-lg border text-sm text-slate-600'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const scheduleText = `Schedule: Today • ${scheduleHour}:${scheduleMinute} ${schedulePeriod}`
                      setSchedule(scheduleText)
                      const now = new Date()
                      const mapHour = (Number(scheduleHour) % 12) + (schedulePeriod === 'PM' ? 12 : 0)
                      now.setHours(mapHour, Number(scheduleMinute), 0, 0)
                      setCustomDepartureTime(now.toISOString())
                      setShowScheduleOptions(false)
                    }}
                    className='px-4 py-2 rounded-lg bg-purple-600 text-white text-sm'
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={findTrip}
            className='w-full bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold text-sm mt-3'
          >
            Find Companions
          </button>
        </div>
      </div>

      <div ref={vehiclePanelRef} className='fixed inset-x-0 bottom-0 translate-y-full z-[1000] bg-white px-3 py-10 pt-12'>
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          onCompanionSelect={setSelectedCompanion}
          onRequestCompanion={() => setShowConnectingOverlay(true)}
        />
      </div>

      <div ref={confirmRidePanelRef} className='fixed inset-x-0 bottom-0 translate-y-full z-50 bg-white px-3 py-6 pt-12'>
        <ConfirmRide
          createRide={findTrip}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          selectedCompanion={selectedCompanion}
          setConfirmRidePanel={setConfirmRidePanel}
          setRideConfirmedPanel={setRideConfirmedPanel}
          setSchedule={setSchedule}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div ref={rideConfirmedPanelRef} className='fixed inset-x-0 bottom-0 translate-y-full z-50 bg-white px-3 py-6 pt-12 max-h-[90vh] overflow-y-auto'>
        <RideConfirmed
          pickup={pickup}
          destination={destination}
          schedule={schedule}
          selectedCompanion={selectedCompanion}
          setRideConfirmedPanel={setRideConfirmedPanel}
        />
      </div>

      <div ref={waitingForDriverRef} className='fixed inset-x-0 bottom-0 translate-y-full z-50 bg-white px-3 py-6 pt-12 max-h-[90vh] overflow-y-auto'>
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  )
}

export default Home
