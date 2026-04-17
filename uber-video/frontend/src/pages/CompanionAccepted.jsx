import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import API_BASE_URL from '../utils/api'

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })

const createFingerprint = async (src) => {
  const image = await loadImage(src)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  const size = 16

  canvas.width = size
  canvas.height = size
  context.drawImage(image, 0, 0, size, size)

  const { data } = context.getImageData(0, 0, size, size)
  const grayscale = []

  for (let index = 0; index < data.length; index += 4) {
    const gray = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114
    grayscale.push(gray)
  }

  const average = grayscale.reduce((sum, value) => sum + value, 0) / grayscale.length
  return grayscale.map((value) => (value >= average ? 1 : 0))
}

const compareFingerprints = (reference, candidate) => {
  const length = Math.min(reference.length, candidate.length)
  let matches = 0

  for (let index = 0; index < length; index += 1) {
    if (reference[index] === candidate[index]) matches += 1
  }

  return Math.round((matches / length) * 100)
}

const CompanionAccepted = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const companion = state?.companion || {
    name: 'Akshita Negi',
    type: 'Verified travel buddy',
    image: 'https://images.squarespace-cdn.com/content/v1/58e167a8414fb5c0b2b8c13e/1503561540900-K0FXVM3QNP4843AJGQCD/Circle+Profile.jpg',
    verified: true,
    rating: 4.8
  }

  const pickup = state?.pickup || 'Your pickup location'
  const destination = state?.destination || 'Your destination'
  const schedule = state?.schedule || 'Leaving soon'
  const ride = state?.ride || null

  const [capturedFace, setCapturedFace] = useState('')
  const [otp, setOtp] = useState('')
  const [isFaceVerified, setIsFaceVerified] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState('Capture your companion live and verify before journey start.')
  const [otpStatus, setOtpStatus] = useState('Enter the meetup OTP shared at the pickup point.')
  const [cameraOpen, setCameraOpen] = useState(false)
  const [verificationScore, setVerificationScore] = useState(null)
  const [isVerifyingFace, setIsVerifyingFace] = useState(false)
  const [isStartingJourney, setIsStartingJourney] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      })

      streamRef.current = stream
      setCameraOpen(true)
      setVerificationStatus('Camera is live. Capture your companion in real time to verify identity.')

      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 0)
    } catch (error) {
      console.error('Camera access failed:', error)
      setVerificationStatus('Camera access is required so you can capture the companion live before starting.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraOpen(false)
  }

  const captureCompanionFace = () => {
    if (!videoRef.current) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedFace(dataUrl)
    setIsFaceVerified(false)
    setVerificationScore(null)
    setVerificationStatus('Live companion photo captured. Verify the match against the registered companion profile.')
    stopCamera()
  }

  const handleVerifyFace = async () => {
    if (!capturedFace) {
      setVerificationStatus('Capture a live companion picture first.')
      return
    }

    if (!companion.image) {
      setVerificationStatus('No companion profile image is available to compare against.')
      return
    }

    try {
      setIsVerifyingFace(true)
      setVerificationStatus('Comparing the live captured companion photo with the registered companion profile...')

      const [referencePrint, companionPrint] = await Promise.all([
        createFingerprint(companion.image),
        createFingerprint(capturedFace)
      ])

      const score = compareFingerprints(referencePrint, companionPrint)
      setVerificationScore(score)

      if (score >= 72) {
        setIsFaceVerified(true)
        setVerificationStatus(`Companion face verified with ${score}% similarity. OTP can now unlock the journey start.`)
      } else {
        setIsFaceVerified(false)
        setVerificationStatus(`Face verification failed with ${score}% similarity. Capture the companion again in better lighting.`)
      }
    } catch (error) {
      console.error('Face verification error:', error)
      setIsFaceVerified(false)
      setVerificationStatus('Unable to compare the captured face with the companion profile image. Please try again.')
    } finally {
      setIsVerifyingFace(false)
    }
  }

  const handleStartJourney = async () => {
    if (!ride?._id) {
      setOtpStatus('Matched ride details are missing, so the journey cannot be started yet.')
      return
    }

    if (!isFaceVerified || verificationScore === null) {
      setVerificationStatus('Verify the live captured companion face before starting the journey.')
      return
    }

    if (!otp.trim()) {
      setOtpStatus('Enter the meetup OTP before starting the journey.')
      return
    }

    try {
      setIsStartingJourney(true)
      setOtpStatus('Saving face verification and validating OTP...')

      await axios.post(
        `${API_BASE_URL}/rides/verify-face`,
        {
          rideId: ride._id,
          selfieImageUrl: capturedFace,
          referenceImageUrl: companion.image,
          similarityScore: verificationScore,
          faceVerified: true
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      await axios.post(
        `${API_BASE_URL}/rides/verify-otp`,
        {
          rideId: ride._id,
          otp: otp.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const response = await axios.post(
        `${API_BASE_URL}/rides/start`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      setOtpStatus('OTP verified and journey started successfully.')
      navigate('/riding', {
        state: {
          ride: response.data,
          companion
        }
      })
    } catch (error) {
      console.error('Failed to start journey:', error)
      setOtpStatus(error.response?.data?.message || 'Unable to verify OTP and start the journey right now.')
    } finally {
      setIsStartingJourney(false)
    }
  }

  const liveTrackingState = { companion, pickup, destination, schedule, ride, faceVerified: isFaceVerified }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_40%,_#e0f2fe)] px-4 py-8'>
      <div className='mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center'>
        <div className='grid w-full gap-6 xl:grid-cols-[1.15fr_0.85fr]'>
          <div className='rounded-[32px] bg-white/92 p-8 shadow-[0_30px_80px_rgba(59,130,246,0.18)] backdrop-blur'>
            <div className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700'>
              <i className='ri-checkbox-circle-fill' />
              Companion accepted your request
            </div>

            <h1 className='mt-5 text-4xl font-bold tracking-tight text-slate-900'>
              Complete OTP and live face verification.
            </h1>
            <p className='mt-3 max-w-2xl text-base text-slate-600'>
              Before the journey starts, capture the companion live, verify the face against the registered profile,
              and confirm the meetup OTP at the pickup point.
            </p>

            <div className='mt-8 grid gap-4 sm:grid-cols-3'>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Pickup</p>
                <p className='mt-2 text-sm font-medium text-slate-800'>{pickup}</p>
              </div>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Destination</p>
                <p className='mt-2 text-sm font-medium text-slate-800'>{destination}</p>
              </div>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Schedule</p>
                <p className='mt-2 text-sm font-medium text-slate-800'>{schedule}</p>
              </div>
            </div>

            <div className='mt-8 grid gap-4 md:grid-cols-2'>
              <button
                type='button'
                onClick={() => navigate('/chat', { state: liveTrackingState })}
                className='rounded-3xl bg-blue-700 px-6 py-5 text-left text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800'
              >
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-blue-100'>Chat</p>
                    <h2 className='mt-2 text-xl font-bold'>Open realistic trip chat</h2>
                    <p className='mt-2 text-sm text-blue-100'>Coordinate ETA, meeting point, and safety instructions.</p>
                  </div>
                  <i className='ri-chat-3-line text-3xl' />
                </div>
              </button>

              <button
                type='button'
                onClick={() => navigate('/live-tracking', { state: liveTrackingState })}
                className='rounded-3xl border border-slate-300 bg-white px-6 py-5 text-left text-slate-900 shadow-sm transition hover:bg-slate-50'
              >
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Live location</p>
                    <h2 className='mt-2 text-xl font-bold'>See companion live location</h2>
                    <p className='mt-2 text-sm text-slate-500'>Track both your marker and the companion marker on the same map.</p>
                  </div>
                  <i className='ri-map-pin-range-line text-3xl text-violet-500' />
                </div>
              </button>
            </div>

            <div className='mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Journey start verification</p>
                  <h2 className='mt-2 text-2xl font-bold text-slate-900'>OTP + live companion face check</h2>
                  <p className='mt-2 text-sm text-slate-600'>
                    Capture your companion live, verify that face, then enter the meetup OTP to unlock the journey.
                  </p>
                </div>
                <div className={`rounded-full px-4 py-2 text-xs font-semibold ${isFaceVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isFaceVerified ? 'Face Verified' : 'Pending'}
                </div>
              </div>

              <div className='mt-6 grid gap-5 lg:grid-cols-[200px_1fr]'>
                <div className='rounded-3xl border border-dashed border-slate-300 bg-white p-4'>
                  <div className='flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-slate-100'>
                    {cameraOpen ? (
                      <video ref={videoRef} autoPlay playsInline muted className='h-full w-full object-cover' />
                    ) : capturedFace ? (
                      <img src={capturedFace} alt='Captured companion preview' className='h-full w-full object-cover' />
                    ) : (
                      <div className='text-center text-slate-400'>
                        <i className='ri-camera-line text-4xl' />
                        <p className='mt-3 text-sm'>No live companion capture yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className='space-y-4'>
                  {!cameraOpen ? (
                    <button
                      type='button'
                      onClick={openCamera}
                      className='flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50'
                    >
                      <i className='ri-camera-3-line text-lg' />
                      Open camera for live companion capture
                    </button>
                  ) : (
                    <div className='grid gap-3 sm:grid-cols-2'>
                      <button
                        type='button'
                        onClick={captureCompanionFace}
                        className='rounded-2xl bg-blue-700 px-5 py-4 text-sm font-semibold text-white hover:bg-blue-800'
                      >
                        Capture companion
                      </button>
                      <button
                        type='button'
                        onClick={stopCamera}
                        className='rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50'
                      >
                        Cancel camera
                      </button>
                    </div>
                  )}

                  <button
                    type='button'
                    onClick={handleVerifyFace}
                    disabled={isVerifyingFace}
                    className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold text-white ${isVerifyingFace ? 'cursor-not-allowed bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                  >
                    {isVerifyingFace ? 'Verifying Companion Face...' : 'Verify Companion Face Match'}
                  </button>

                  <div className={`rounded-2xl px-4 py-4 text-sm ${isFaceVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {verificationStatus}
                  </div>

                  {verificationScore !== null && (
                    <div className='rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700'>
                      Similarity score: <span className='font-semibold'>{verificationScore}%</span>
                    </div>
                  )}

                  <div className='rounded-2xl border border-slate-200 bg-white px-4 py-4'>
                    <label className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Meetup OTP</label>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      type='text'
                      maxLength={6}
                      placeholder='Enter 6-digit OTP'
                      className='mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold tracking-[0.2em] text-slate-800 focus:border-blue-400 focus:outline-none'
                    />
                    <p className='mt-3 text-sm text-slate-500'>{otpStatus}</p>
                  </div>

                  <button
                    type='button'
                    onClick={handleStartJourney}
                    disabled={!isFaceVerified || isStartingJourney}
                    className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold transition ${!isFaceVerified || isStartingJourney ? 'cursor-not-allowed bg-slate-200 text-slate-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    {isStartingJourney ? 'Verifying OTP And Starting Journey...' : 'Verify OTP And Start Journey'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-[32px] bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.14)]'>
            <div className='flex flex-col items-center text-center'>
              <div className='relative'>
                <div className='absolute inset-[-16px] rounded-full border border-blue-100' />
                <img
                  src={companion.image}
                  alt={companion.name}
                  className='relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg'
                />
              </div>

              <h2 className='mt-6 text-2xl font-bold text-slate-900'>{companion.name}</h2>
              <p className='mt-1 text-sm text-slate-500'>{companion.type}</p>

              <div className='mt-4 inline-flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700'>
                <i className='ri-shield-check-line' />
                <span>{companion.verified ? 'Aadhar Verified' : 'Verification pending'}</span>
                <span className='text-amber-500'>Rating: {companion.rating}</span>
              </div>
            </div>

            <div className='mt-8 space-y-4'>
              <div className='rounded-2xl bg-blue-50 p-4'>
                <p className='text-sm font-semibold text-blue-900'>Start flow</p>
                <p className='mt-1 text-sm text-blue-700'>
                  1. Open camera. 2. Capture companion live. 3. Verify face. 4. Enter OTP. 5. Start journey.
                </p>
              </div>
              <div className='rounded-2xl bg-violet-50 p-4'>
                <p className='text-sm font-semibold text-violet-900'>Real-time capture</p>
                <p className='mt-1 text-sm text-violet-700'>
                  The journey stays locked until the live captured companion face matches the registered companion profile.
                </p>
              </div>
              <div className='rounded-2xl bg-emerald-50 p-4'>
                <p className='text-sm font-semibold text-emerald-900'>OTP protection</p>
                <p className='mt-1 text-sm text-emerald-700'>
                  OTP and face verification now work together before the backend allows journey start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanionAccepted
