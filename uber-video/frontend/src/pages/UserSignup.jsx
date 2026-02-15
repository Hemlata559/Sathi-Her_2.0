import React, { useState, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'



const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ age, setAge ] = useState('')
  const [ collegeName, setCollegeName ] = useState('')
  const [ contactNumber, setContactNumber ] = useState('')
  const [ emergencyContactName, setEmergencyContactName ] = useState('')
  const [ emergencyContactNumber, setEmergencyContactNumber ] = useState('')
  const [ emergencyContactRelationship, setEmergencyContactRelationship ] = useState('')
  const [ userData, setUserData ] = useState({})
  const [gender, setGender] = useState('female')
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)


  const navigate = useNavigate()

  const { user, setUser } = useContext(UserDataContext)


  // const submitHandler = async (e) => {
  //   e.preventDefault()
  //   const newUser = {
  //     fullname: {
  //       firstname: firstName,
  //       lastname: lastName
  //     },
  //     email: email,
  //     password: password,
  //     gender: gender

  //   }


    
    



  //   if (response.status === 201) {
  //     const data = response.data
  //     setUser(data.user)
  //     localStorage.setItem('token', data.token)
  //     navigate('/home')
  //   }


  //   setEmail('')
  //   setFirstName('')
  //   setLastName('')
  //   setPassword('')

  // }


  // Handle image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setShowCamera(false)
    }
  }

  // Start camera
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

  // Capture photo from camera
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d')
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          setProfileImage(blob)
          const reader = new FileReader()
          reader.onloadend = () => {
            setImagePreview(reader.result)
            stopCamera()
          }
          reader.readAsDataURL(blob)
        }
      })
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      setShowCamera(false)
    }
  }

  const submitHandler = async (e) => {
  e.preventDefault()

  const newUser = {
    fullname: {
      firstname: firstName,
      lastname: lastName
    },
    email: email,
    password: password,
    gender: gender,
    age: age,
    collegeName: collegeName,
    contactNumber: contactNumber,
    emergencyContact: {
      name: emergencyContactName,
      number: emergencyContactNumber,
      relationship: emergencyContactRelationship
    }
  }

  try {
    // ✅ THIS LINE WAS MISSING
    const response = await axios.post(
      'http://localhost:5000/users/register',
      newUser
    )

    if (response.status === 201) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      // navigate to home and request the panel to open for entering destination
      navigate('/home', { state: { openSearchPanel: true, focusField: 'destination' } })
    }

    // reset form
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setAge('')
    setCollegeName('')
    setContactNumber('')
    setEmergencyContactName('')
    setEmergencyContactNumber('')
    setEmergencyContactRelationship('')
    setProfileImage(null)
    setImagePreview(null)

  } catch (error) {
    console.error(error)
    alert(`Error: ${error.response?.data?.message || error.message || 'Failed to create account'}`)
  }
}

  


  return (
    <div>
      <div className='p-7 min-h-screen flex flex-col justify-between'>
        <div>
          <h3 className="text-4xl font-extrabold tracking-tight text-black mb-7">
            Sathi<span className="text-gray-500">-Her</span>
          </h3>

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            
            {/* Email Section - Full Width */}
            <div className='mb-6'>
              <h3 className='text-lg font-medium mb-2'>What's your email</h3>
              <input
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base placeholder:text-sm'
                type="email"
                placeholder='email@example.com'
              />
            </div>

            {/* Password Section - Full Width */}
            <div className='mb-8'>
              <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
              <input
                className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base placeholder:text-sm'
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                required
                type="password"
                placeholder='password'
              />
            </div>
            
            {/* Two Column Layout */}
            <div className='flex gap-8 mb-8'>
              
              {/* LEFT SIDE - Form Fields */}
              <div className='w-1/2'>
                
                {/* Name Fields */}
                <h3 className='text-lg font-medium mb-3'>What's your name</h3>
                <div className='flex gap-3 mb-6'>
                  <input
                    required
                    className='bg-[#eeeeee] flex-1 rounded-lg px-4 py-3 border text-base placeholder:text-sm'
                    type="text"
                    placeholder='First name'
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value) }}
                  />
                  <input
                    required
                    className='bg-[#eeeeee] flex-1 rounded-lg px-4 py-3 border text-base placeholder:text-sm'
                    type="text"
                    placeholder='Last name'
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value) }}
                  />
                </div>

                {/* Age and College */}
                <div className='flex gap-3 mb-6'>
                  <div className='flex-1'>
                    <h3 className='text-sm font-medium mb-2'>Age</h3>
                    <input
                      className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base placeholder:text-sm'
                      type="number"
                      placeholder='Age (minimum 18)'
                      value={age}
                      onChange={(e) => { 
                        const value = e.target.value
                        if (value === '' || parseInt(value) >= 18) {
                          setAge(value)
                        }
                      }}
                      min="18"
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-sm font-medium mb-2'>Gender</h3>
                    <select
                      value={gender}
                      disabled
                      className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base cursor-not-allowed opacity-75'
                    >
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                {/* College Name */}
                <h3 className='text-sm font-medium mb-2'>College Name</h3>
                <input
                  className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base placeholder:text-sm mb-6'
                  type="text"
                  placeholder='Your College/University'
                  value={collegeName}
                  onChange={(e) => { setCollegeName(e.target.value) }}
                />

                {/* Contact Number */}
                <h3 className='text-sm font-medium mb-2'>Contact Number</h3>
                <input
                  className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base placeholder:text-sm mb-6'
                  type="tel"
                  placeholder='10 digit mobile number'
                  value={contactNumber}
                  onChange={(e) => { setContactNumber(e.target.value) }}
                  maxLength="10"
                />
              </div>

              {/* RIGHT SIDE - Image Capture */}
              <div className='w-1/2'>
                <div className='h-full min-h-96 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg flex flex-col'>
                  
                  {/* Header */}
                  <h3 className='text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Profile Picture</h3>
                  <p className='text-sm text-gray-600 mb-6'>Capture your photo to complete your profile</p>

                  {/* Camera Button */}
                  <div className='mb-6'>
                    <button
                      type='button'
                      onClick={startCamera}
                      disabled={showCamera}
                      className='w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl px-4 py-4 text-base transition transform hover:scale-105 shadow-md'
                    >
                      📷 Capture from Camera
                    </button>
                  </div>

                  {/* Camera Feed */}
                  {showCamera && (
                    <div className='flex-1 p-4 bg-white rounded-xl border-2 border-blue-300 shadow-inner mb-4 flex flex-col'>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className='w-full h-full rounded-lg object-cover'
                      />
                      <canvas
                        ref={canvasRef}
                        width={640}
                        height={480}
                        className='hidden'
                      />
                      <div className='flex gap-3 mt-4'>
                        <button
                          type='button'
                          onClick={capturePhoto}
                          className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg px-4 py-3 transition transform hover:scale-105'
                        >
                          ✓ Capture Photo
                        </button>
                        <button
                          type='button'
                          onClick={stopCamera}
                          className='flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-lg px-4 py-3 transition transform hover:scale-105'
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && !showCamera && (
                    <div className='flex-1 p-6 bg-white rounded-xl border-2 border-green-300 shadow-inner flex flex-col items-center justify-center'>
                      <div className='relative mb-4 w-full h-full flex items-center justify-center'>
                        <div className='absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg opacity-30'></div>
                        <img
                          src={imagePreview}
                          alt='Profile preview'
                          className='relative w-56 h-56 rounded-2xl object-cover shadow-xl border-4 border-white'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => {
                          setImagePreview(null)
                          setProfileImage(null)
                        }}
                        className='w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-lg px-4 py-2 transition'
                      >
                        ✕ Remove & Retake
                      </button>
                    </div>
                  )}

                  {!imagePreview && !showCamera && (
                    <div className='flex-1 bg-white rounded-xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center shadow-inner hover:shadow-md transition'>
                      <div className='text-center'>
                        <div className='text-6xl mb-3'>📸</div>
                        <p className='text-lg font-semibold text-gray-700 mb-2'>Ready to capture?</p>
                        <p className='text-sm text-gray-500'>Click the button above to start your camera</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Emergency Contact Section - Full Width */}
            <div className='mb-8 p-6 bg-gray-50 rounded-lg border-2 border-orange-300'>
              <h3 className='text-lg font-medium mb-4 text-orange-700'>Emergency Contact Information</h3>
              
              <div className='flex gap-3 mb-4'>
                <div className='flex-1'>
                  <label className='text-sm font-medium mb-2 block'>Contact Name</label>
                  <input
                    className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base placeholder:text-sm'
                    type="text"
                    placeholder='Emergency contact name'
                    value={emergencyContactName}
                    onChange={(e) => { setEmergencyContactName(e.target.value) }}
                  />
                </div>
                <div className='flex-1'>
                  <label className='text-sm font-medium mb-2 block'>Phone Number</label>
                  <input
                    className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base placeholder:text-sm'
                    type="tel"
                    placeholder='10 digit phone number'
                    value={emergencyContactNumber}
                    onChange={(e) => { setEmergencyContactNumber(e.target.value) }}
                    maxLength="10"
                  />
                </div>
                <div className='flex-1'>
                  <label className='text-sm font-medium mb-2 block'>Relationship</label>
                  <select
                    value={emergencyContactRelationship}
                    onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                    className='bg-[#eeeeee] w-full rounded-lg px-4 py-3 border text-base'
                  >
                    <option value="">Select relationship</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Sister">Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button - Full Width */}
            <button
              type='submit'
              className='bg-[#111] hover:bg-[#222] text-white font-semibold rounded-lg px-4 py-3 w-full text-lg transition mb-6'
            >
              Create account
            </button>

            {/* Login Link */}
            <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600 hover:text-blue-800 font-medium'>Login here</Link></p>

          </form>
        </div>

        <div>
          <p className='text-[10px] leading-tight text-gray-600'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>

      </div>
    </div >
  )
}

export default UserSignup