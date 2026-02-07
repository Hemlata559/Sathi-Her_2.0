// import React, { useState, useContext } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { UserDataContext } from '../context/UserContext'



// const UserSignup = () => {
//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')
//   const [ firstName, setFirstName ] = useState('')
//   const [ lastName, setLastName ] = useState('')
//   const [ userData, setUserData ] = useState({})
//   const [gender, setGender] = useState('female');


//   const navigate = useNavigate()



//   const { user, setUser } = useContext(UserDataContext)




//   const submitHandler = async (e) => {
//     e.preventDefault()
//     const newUser = {
//       fullname: {
//         firstname: firstName,
//         lastname: lastName
//       },
//       email: email,
//       password: password,
//       gender: gender

//     }

//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

//     if (response.status === 201) {
//       const data = response.data
//       setUser(data.user)
//       localStorage.setItem('token', data.token)
//       navigate('/home')
//     }


//     setEmail('')
//     setFirstName('')
//     setLastName('')
//     setPassword('')

//   }
//   return (
//     <div>
//       <div className='p-7 h-screen flex flex-col justify-between'>
//         <div>
//           <h3 className="text-4xl font-extrabold tracking-tight text-black">
//   Sathi<span className="text-gray-500">-Her</span>
// </h3>

         

//           <form onSubmit={(e) => {
//             submitHandler(e)
//           }}>

//             <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
//             <div className='flex gap-4 mb-7'>
//               <input
//                 required
//                 className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//                 type="text"
//                 placeholder='First name'
//                 value={firstName}
//                 onChange={(e) => {
//                   setFirstName(e.target.value)
//                 }}
//               />
//               <input
//                 required
//                 className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//                 type="text"
//                 placeholder='Last name'
//                 value={lastName}
//                 onChange={(e) => {
//                   setLastName(e.target.value)
//                 }}
//               />
//             </div>

//             <h3 className='text-lg font-medium mb-2'>What's your email</h3>
//             <input
//               required
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value)
//               }}
//               className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//               type="email"
//               placeholder='email@example.com'
//             />

//             <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

//             <input
//               className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value)
//               }}
//               required type="password"
//               placeholder='password'
//             />
//             <h3 className='text-lg font-medium mb-2'>Gender</h3>
//             <select
//               value={gender}
//               onChange={(e) => setGender(e.target.value)}
//               className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg'
//             >
//               <option value="female">Female</option>
//             </select>

           

//             <button
//               className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//             >Create account</button>

//           </form>
//           <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
//         </div>
//         <div>
//           <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
//             Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
//         </div>
//       </div>
//     </div >
//   )
// }

// export default UserSignup

import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    travelMode: '',
    emergencyName: '',
    emergencyPhone: '',
    consent: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!formData.consent) return alert('Consent required')

    const payload = {
      fullname: {
        firstname: formData.firstName,
        lastname: formData.lastName,
      },
      dob: formData.dob,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      city: formData.city,
      travelMode: formData.travelMode,
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
      },
      gender: 'female',
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      payload
    )

    if (response.status === 201) {
      setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-extrabold">
          Sathi<span className="text-gray-500">-Her</span>
        </h1>
        <h2 className="text-xl font-semibold mt-1">Create your account</h2>
        <p className="text-sm text-gray-600 mb-6">
          Verified women. Safer journeys.
        </p>

        <form onSubmit={submitHandler} className="space-y-5">

          {/* Personal Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Personal Information</h3>
            <div className="flex gap-3 mb-3">
              <input
                name="firstName"
                placeholder="First name"
                className="input"
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last name"
                className="input"
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="date"
              name="dob"
              className="input w-full"
              onChange={handleChange}
              required
            />
          </div>

          {/* Verification */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Verification</h3>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="input w-full mb-3"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input w-full mb-3"
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Mobile number"
              className="input w-full"
              onChange={handleChange}
              required
            />
          </div>

          {/* Travel Context */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Travel Context</h3>
            <input
              name="city"
              placeholder="City"
              className="input w-full mb-3"
              onChange={handleChange}
              required
            />
            <select
              name="travelMode"
              className="input w-full"
              onChange={handleChange}
              required
            >
              <option value="">Travel mode</option>
              <option value="metro">Metro</option>
              <option value="bus">Bus</option>
              <option value="walk">Walking</option>
            </select>
          </div>

          {/* Safety */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Safety Setup</h3>
            <input
              name="emergencyName"
              placeholder="Emergency contact name"
              className="input w-full mb-3"
              onChange={handleChange}
              required
            />
            <input
              name="emergencyPhone"
              placeholder="Emergency contact number"
              className="input w-full mb-3"
              onChange={handleChange}
              required
            />
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                name="consent"
                onChange={handleChange}
              />
              I agree to safety guidelines and live location sharing during trips
            </label>
          </div>

          <button className="bg-black text-white w-full py-3 rounded-lg font-semibold">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default UserSignup
