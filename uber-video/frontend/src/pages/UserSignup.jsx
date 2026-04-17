import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import BrandNavbar from '../components/BrandNavbar'
import { UserDataContext } from '../context/UserContext'
import API_BASE_URL from '../utils/api'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('')
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const startCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return

    const context = canvasRef.current.getContext('2d')
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.92)
    setImagePreview(dataUrl)
    stopCamera()
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email,
      password,
      gender: 'female',
      age,
      collegeName,
      contactNumber,
      emergencyContact: {
        name: emergencyContactName,
        number: emergencyContactNumber,
        relationship: emergencyContactRelationship
      }
    }

    try {
      setSubmitting(true)
      const response = await axios.post(`${API_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        if (imagePreview) {
          localStorage.setItem('profileImage', imagePreview)
        }
        navigate('/home', { state: { openSearchPanel: true, focusField: 'destination' } })
      }
    } catch (error) {
      console.error(error)
      alert(`Error: ${error.response?.data?.message || error.message || 'Failed to create account'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='brand-shell px-4 pb-12'>
      <BrandNavbar compact />

      <div className='mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start'>
        <div className='px-2 lg:sticky lg:top-10'>
          <div className='inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/80 px-4 py-2 text-sm font-semibold text-fuchsia-600'>
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
            Build your trusted travel profile
          </div>
          <h1 className='mt-6 text-5xl font-black tracking-tight text-slate-900 md:text-6xl'>Create your safe travel identity.</h1>
          <p className='mt-6 max-w-xl text-lg leading-8 text-slate-600'>
            Set up your profile once so companion requests, live journey coordination, and safety checks feel fast and reliable.
          </p>

          <div className='mt-8 space-y-4'>
            <div className='brand-glass rounded-[28px] p-5'>
              <p className='text-sm font-bold text-slate-900'>Why the profile photo matters</p>
              <p className='mt-2 text-sm leading-6 text-slate-600'>Your profile image helps with companion verification before the journey starts.</p>
            </div>
            <div className='brand-glass rounded-[28px] p-5'>
              <p className='text-sm font-bold text-slate-900'>Emergency contact layer</p>
              <p className='mt-2 text-sm leading-6 text-slate-600'>Your safety setup can support quicker help and more trustworthy ride coordination.</p>
            </div>
          </div>
        </div>

        <div className='brand-glass rounded-[38px] p-6 md:p-8'>
          <form onSubmit={submitHandler} className='space-y-8'>
            <div>
              <h2 className='text-3xl font-black tracking-tight text-slate-900'>Sign up</h2>
              <p className='mt-2 text-sm text-slate-500'>Everything here follows the same calm, safety-first experience.</p>
            </div>

            <div className='grid gap-5 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>First Name</label>
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='First name' />
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Last Name</label>
                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='Last name' />
              </div>
            </div>

            <div className='grid gap-5 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Email</label>
                <input required type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='email@example.com' />
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Password</label>
                <input required type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='Create a password' />
              </div>
            </div>

            <div className='grid gap-5 md:grid-cols-3'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Age</label>
                <input type='number' min='18' value={age} onChange={(e) => setAge(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='18+' />
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>College</label>
                <input value={collegeName} onChange={(e) => setCollegeName(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='College / University' />
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Contact Number</label>
                <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} maxLength='10' className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='10 digit mobile number' />
              </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
              <div className='rounded-[30px] border border-fuchsia-100 bg-white/80 p-5'>
                <p className='text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-500'>Emergency Contact</p>
                <div className='mt-4 grid gap-4'>
                  <input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='Contact name' />
                  <input value={emergencyContactNumber} onChange={(e) => setEmergencyContactNumber(e.target.value)} maxLength='10' className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100' placeholder='Phone number' />
                  <select value={emergencyContactRelationship} onChange={(e) => setEmergencyContactRelationship(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100'>
                    <option value=''>Relationship</option>
                    <option value='Mother'>Mother</option>
                    <option value='Father'>Father</option>
                    <option value='Sister'>Sister</option>
                    <option value='Brother'>Brother</option>
                    <option value='Friend'>Friend</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>
              </div>

              <div className='rounded-[30px] border border-fuchsia-100 bg-[linear-gradient(180deg,_#ffffff,_#fff5fd)] p-5'>
                <p className='text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-500'>Profile Photo</p>
                <div className='mt-4 flex min-h-[280px] flex-col rounded-[24px] border border-dashed border-fuchsia-200 bg-white p-4'>
                  {showCamera ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className='h-52 w-full rounded-[18px] object-cover' />
                      <canvas ref={canvasRef} width={640} height={480} className='hidden' />
                      <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                        <button type='button' onClick={capturePhoto} className='brand-button rounded-2xl px-4 py-3 text-sm font-bold text-white'>Capture Photo</button>
                        <button type='button' onClick={stopCamera} className='rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700'>Cancel</button>
                      </div>
                    </>
                  ) : imagePreview ? (
                    <>
                      <img src={imagePreview} alt='Profile preview' className='h-52 w-full rounded-[18px] object-cover' />
                      <button type='button' onClick={() => setImagePreview(null)} className='mt-4 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700'>Remove and recapture</button>
                    </>
                  ) : (
                    <div className='flex flex-1 flex-col items-center justify-center text-center text-slate-500'>
                      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-50 text-3xl text-fuchsia-500'>
                        <i className='ri-camera-3-line' />
                      </div>
                      <p className='mt-4 text-base font-semibold text-slate-800'>Capture your profile photo</p>
                      <p className='mt-2 max-w-xs text-sm leading-6'>This photo supports your future face-verification flow before journey start.</p>
                      <button type='button' onClick={startCamera} className='brand-button mt-5 rounded-2xl px-5 py-3 text-sm font-bold text-white'>Open Camera</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button type='submit' disabled={submitting} className={`brand-button w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition ${submitting ? 'cursor-not-allowed opacity-70' : ''}`}>
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className='text-center text-sm text-slate-600'>
              Already have an account?{' '}
              <Link to='/login' className='font-bold text-fuchsia-500 transition hover:text-fuchsia-600'>
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserSignup
