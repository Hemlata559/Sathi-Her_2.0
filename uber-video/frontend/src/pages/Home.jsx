import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import RideConfirmed from '../components/RideConfirmed'
import WaitingForDriver from '../components/WaitingForDriver'
import ConnectingOverlay from '../components/ConnectingOverlay'
import { SocketContext } from '../context/SocketContext'
import { useLocation } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import API_BASE_URL from '../utils/api'
import {
  cancelCompanionRequest,
  fetchIncomingCompanionRequests,
  fetchOutgoingCompanionRequests,
  normalizeCompanionRequest
} from '../utils/companionRequests'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [rideConfirmedPanel, setRideConfirmedPanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
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
  const [incomingRequests, setIncomingRequests] = useState([])
  const [activeIncomingRequest, setActiveIncomingRequest] = useState(null)
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [activeOutgoingRequest, setActiveOutgoingRequest] = useState(null)

  const confirmRidePanelRef = useRef(null)
  const rideConfirmedPanelRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const navigate = useNavigate()
  const { socket } = useContext(SocketContext)
  const location = useLocation()
  const { user } = useContext(UserDataContext)

  useEffect(() => {
    if (!user?._id) return
    socket.emit('join', { userType: 'user', userId: user._id })
  }, [socket, user])

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const [fetchedRequests, fetchedOutgoingRequests] = await Promise.all([
          fetchIncomingCompanionRequests(),
          fetchOutgoingCompanionRequests()
        ])
        setIncomingRequests(fetchedRequests)
        setOutgoingRequests(fetchedOutgoingRequests)
        const pending = fetchedRequests.find((request) => request.status === 'pending')
        if (pending) setActiveIncomingRequest(pending)
        const pendingOutgoing = fetchedOutgoingRequests.find((request) => request.status === 'pending')
        if (pendingOutgoing) setActiveOutgoingRequest(pendingOutgoing)
      } catch (error) {
        console.error('Failed to load companion requests:', error)
        setIncomingRequests([])
        setOutgoingRequests([])
      }
    }

    loadRequests()
  }, [])

  useEffect(() => {
    if (location?.state?.openSearchPanel) {
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

  useEffect(() => {
    const handleIncomingCompanionRequest = (request) => {
      const normalizedRequest = normalizeCompanionRequest(request)

      setIncomingRequests((currentRequests) => {
        const existingIndex = currentRequests.findIndex((item) => item.id === normalizedRequest.id)
        if (existingIndex >= 0) {
          const nextRequests = [...currentRequests]
          nextRequests[existingIndex] = normalizedRequest
          return nextRequests
        }

        return [normalizedRequest, ...currentRequests]
      })
      setActiveIncomingRequest(normalizedRequest)
    }

    const handleIncomingRequestStatusUpdate = (request) => {
      const normalizedRequest = normalizeCompanionRequest(request)

      setIncomingRequests((currentRequests) =>
        currentRequests.map((item) =>
          item.id === normalizedRequest.id ? normalizedRequest : item
        )
      )

      setActiveIncomingRequest((currentActiveRequest) =>
        currentActiveRequest?.id === normalizedRequest.id ? null : currentActiveRequest
      )
    }

    const handleOutgoingRequestAccepted = (request) => {
      const normalizedRequest = normalizeCompanionRequest(request)

      setOutgoingRequests((currentRequests) =>
        currentRequests.map((item) =>
          item.id === normalizedRequest.id ? normalizedRequest : item
        )
      )
      setActiveOutgoingRequest(normalizedRequest)

      setTimeout(() => {
        setShowConnectingOverlay(false)
        setActiveOutgoingRequest(null)
        navigate('/companion-accepted', {
          state: {
            companion: {
              id: normalizedRequest.raw?.receiver?._id,
              name: normalizedRequest.receiverName,
              image: normalizedRequest.receiverImage,
              verified: true,
              rating: 4.5,
              type: 'Accepted travel buddy'
            },
            pickup: normalizedRequest.pickup,
            destination: normalizedRequest.destination,
            schedule: normalizedRequest.schedule,
            ride
          }
        })
      }, 1200)
    }

    const handleOutgoingRequestCancelled = (request) => {
      const normalizedRequest = normalizeCompanionRequest(request)
      setOutgoingRequests((currentRequests) =>
        currentRequests.map((item) =>
          item.id === normalizedRequest.id ? normalizedRequest : item
        )
      )
      setActiveOutgoingRequest((currentActiveRequest) =>
        currentActiveRequest?.id === normalizedRequest.id ? normalizedRequest : currentActiveRequest
      )
    }

    socket.on('companion-request', handleIncomingCompanionRequest)
    socket.on('companion-request-accepted', handleOutgoingRequestAccepted)
    socket.on('companion-request-declined', handleOutgoingRequestCancelled)
    socket.on('companion-request-cancelled', handleOutgoingRequestCancelled)

    return () => {
      socket.off('companion-request', handleIncomingCompanionRequest)
      socket.off('companion-request-accepted', handleOutgoingRequestAccepted)
      socket.off('companion-request-declined', handleOutgoingRequestCancelled)
      socket.off('companion-request-cancelled', handleOutgoingRequestCancelled)
    }
  }, [navigate, ride, socket])

  const handleCancelOutgoingRequest = async () => {
    if (!activeOutgoingRequest?.id) {
      setShowConnectingOverlay(false)
      return
    }

    try {
      const updatedRequest = await cancelCompanionRequest(activeOutgoingRequest.id)
      setOutgoingRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === updatedRequest.id ? updatedRequest : request
        )
      )
    } catch (error) {
      console.error('Failed to cancel outgoing request:', error)
    } finally {
      setShowConnectingOverlay(false)
      setActiveOutgoingRequest(null)
    }
  }

  const handlePickupChange = async (e) => {
    setPickup(e.target.value)
    if (!e.target.value) return
    try {
      const response = await axios.get(`${API_BASE_URL}/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch {
      // Suggestion requests should fail quietly while the user keeps typing.
    }
  }

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value)
    if (!e.target.value) return
    try {
      const response = await axios.get(`${API_BASE_URL}/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch {
      // Suggestion requests should fail quietly while the user keeps typing.
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
      const departureTime = getDepartureTime()

      const response = await axios.post(`${API_BASE_URL}/rides/create`, {
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

  const pendingRequestsCount = incomingRequests.filter((request) => request.status === 'pending').length
  const hasActiveRide = Boolean(ride?._id)
  const userDisplayName =
    user?.fullname?.firstname ||
    user?.fullName?.firstName ||
    user?.email?.split('@')[0] ||
    'Profile'
  const userInitial = userDisplayName.charAt(0).toUpperCase()

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
    <div className='brand-shell min-h-screen relative pb-14'>
      <nav className='absolute inset-x-0 top-0 z-[1002]'>
        <div className='mx-auto flex max-w-[1090px] items-center justify-between px-4 py-4'>
          <div className='rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Sathi-Her</p>
            <h1 className='text-lg font-bold text-slate-900'>Travel Buddy Dashboard</h1>
          </div>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => navigate('/companion-requests')}
              className='relative rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur'
            >
              <span className='flex items-center gap-2'>
                <i className='ri-notification-3-line text-lg' />
                Requests
              </span>
              {pendingRequestsCount > 0 && (
                <span className='absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white'>
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              type='button'
              onClick={() => navigate('/user/logout')}
              className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur'
            >
              <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white'>
                {userInitial}
              </span>
              <span className='hidden sm:block'>{userDisplayName}</span>
            </button>
          </div>
        </div>
      </nav>

      {showConnectingOverlay && (
        <div className='absolute inset-0 z-[1001]'>
          <ConnectingOverlay
            companion={selectedCompanion || {
              name: activeOutgoingRequest?.receiverName,
              image: activeOutgoingRequest?.receiverImage
            }}
            requestStatus={activeOutgoingRequest?.status || 'pending'}
            onCancel={handleCancelOutgoingRequest}
          />
        </div>
      )}

      <div className='mx-auto max-w-[1090px] px-4 pt-28'>
        <div className='relative overflow-hidden rounded-[34px] border border-white/70 bg-white/75 shadow-[0_24px_80px_rgba(76,29,149,0.10)] backdrop-blur'>
          {hasActiveRide ? (
            <div className='h-[42vh] min-h-[320px]'>
              <LiveTracking pickup={pickup} destination={destination} />
            </div>
          ) : (
            <div className='grid min-h-[280px] gap-6 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),_transparent_30%),linear-gradient(135deg,_#fff9fd,_#fcf7ff_55%,_#fffdf8)] p-6 md:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center'>
              <div>
                <div className='inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/80 px-4 py-2 text-sm font-semibold text-fuchsia-600'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500' />
                  Dashboard ready
                </div>
                <h2 className='mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl'>
                  Welcome back, {userDisplayName}.
                </h2>
                <p className='mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg'>
                  Start with your pickup and destination, choose a schedule, and we&apos;ll help you find a verified companion for the trip.
                </p>

                <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                  <div className='rounded-2xl border border-fuchsia-100 bg-white/80 p-4 shadow-sm'>
                    <p className='text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-500'>Companion Requests</p>
                    <p className='mt-2 text-2xl font-black text-slate-900'>{pendingRequestsCount}</p>
                    <p className='mt-1 text-sm text-slate-500'>Pending requests waiting in your inbox.</p>
                  </div>
                  <div className='rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm'>
                    <p className='text-xs font-bold uppercase tracking-[0.18em] text-emerald-500'>Journey Status</p>
                    <p className='mt-2 text-2xl font-black text-slate-900'>Ready to plan</p>
                    <p className='mt-1 text-sm text-slate-500'>No active live-tracking session until a ride is created.</p>
                  </div>
                </div>
              </div>

              <div className='grid gap-4'>
                <div className='rounded-[28px] bg-slate-900 p-5 text-white shadow-lg'>
                  <p className='text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-200'>Safety Layer</p>
                  <h3 className='mt-3 text-2xl font-black'>OTP, live face match, and tracking stay ride-linked.</h3>
                </div>
                <div className='rounded-[28px] bg-white p-5 shadow-sm'>
                  <p className='text-xs font-bold uppercase tracking-[0.18em] text-violet-500'>Quick Start</p>
                  <ul className='mt-3 space-y-3 text-sm font-medium text-slate-600'>
                    <li>1. Add pickup and destination</li>
                    <li>2. Choose travel mode and schedule</li>
                    <li>3. Create the ride and request a companion</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='mt-8 rounded-[34px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(76,29,149,0.10)] backdrop-blur md:p-6'>
          <div className='relative mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
            <div className='px-1 py-2'>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-500'>Plan Journey</p>
              <h2 className='text-3xl font-black tracking-tight text-slate-900'>Find Travel Buddy</h2>
              <p className='mt-2 text-sm text-slate-500'>Set your route first, then browse matching companions below.</p>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-3'>
            <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3'>
              <img src='https://as2.ftcdn.net/jpg/03/63/90/39/1000_F_363903973_6sBZzXzkOA6qKXWreOhK93G6yaHtGhPD.jpg' alt='pickup' className='w-8 h-8 rounded-lg object-cover' />
              <input
                value={pickup}
                onChange={handlePickupChange}
                placeholder='Enter your current location'
                className='flex-1 bg-transparent text-sm focus:outline-none'
              />
            </div>
            <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3'>
              <img src='https://img.freepik.com/premium-vector/red-pointer-checkpoint-end-point-route-sign-symbol-beginning-end-movement-map-traveler-tourist-destination-pointer-simple-colored-flat-vector-icon-isolated-white-background_71609-6406.jpg' alt='destination' className='w-8 h-8 rounded-lg object-cover' />
              <input
                value={destination}
                onChange={handleDestinationChange}
                placeholder='Enter your destination'
                className='flex-1 bg-transparent text-sm focus:outline-none'
              />
            </div>
          </div>

          <div className='mt-4 grid grid-cols-2 gap-2 md:grid-cols-4'>
            {['cab', 'bus', 'metro', 'walk'].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setTravelMode(mode)
                  setVehicleType(mode)
                }}
                className={`px-4 py-3 text-sm font-semibold rounded-2xl border transition ${travelMode === mode ? 'bg-blue-700 text-white border-blue-800' : 'bg-white text-slate-700 border-slate-300'}`}
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
            className='brand-button w-full px-6 py-3 rounded-xl font-bold text-sm mt-3 text-white'
          >
            Find Companions
          </button>
        </div>

        {vehiclePanel && (
          <div className='mt-8'>
            <VehiclePanel
              ride={ride}
              selectVehicle={setVehicleType}
              fare={fare}
              setConfirmRidePanel={setConfirmRidePanel}
              setVehiclePanel={setVehiclePanel}
              onCompanionSelect={setSelectedCompanion}
              onRequestCompanion={() => setShowConnectingOverlay(true)}
              onRequestCreated={setActiveOutgoingRequest}
            />
          </div>
        )}
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

      {activeIncomingRequest?.status === 'pending' && activeIncomingRequest?.journeyScheduled && (
        <div className='fixed right-4 top-24 z-[1100] w-[min(92vw,380px)] rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)]'>
          <div className='flex items-start gap-3'>
            <img
              src={activeIncomingRequest.requesterImage}
              alt={activeIncomingRequest.requesterName}
              className='h-14 w-14 rounded-full object-cover'
            />
            <div className='flex-1'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-blue-500'>New Request</p>
              <h3 className='mt-1 text-lg font-bold text-slate-900'>{activeIncomingRequest.requesterName}</h3>
              <p className='mt-1 text-sm text-slate-600'>{activeIncomingRequest.message}</p>
            </div>
            <button
              type='button'
              onClick={() => setActiveIncomingRequest(null)}
              className='text-slate-400 hover:text-slate-600'
            >
              <i className='ri-close-line text-xl' />
            </button>
          </div>

          <div className='mt-4 grid gap-2 sm:grid-cols-2'>
            <div className='rounded-2xl bg-slate-50 p-3'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Pickup</p>
              <p className='mt-1 text-sm font-medium text-slate-800'>{activeIncomingRequest.pickup}</p>
            </div>
            <div className='rounded-2xl bg-slate-50 p-3'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Destination</p>
              <p className='mt-1 text-sm font-medium text-slate-800'>{activeIncomingRequest.destination}</p>
            </div>
          </div>

          <div className='mt-4 flex gap-3'>
            <button
              type='button'
              onClick={() => {
                setActiveIncomingRequest(null)
                navigate('/companion-requests')
              }}
              className='flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700'
            >
              Review Request
            </button>
            <button
              type='button'
              onClick={() => setActiveIncomingRequest(null)}
              className='flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200'
            >
              Later
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
