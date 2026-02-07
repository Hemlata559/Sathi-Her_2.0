import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'



const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ userData, setUserData ] = useState({})
  const [gender, setGender] = useState('female');


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


  const submitHandler = async (e) => {
  e.preventDefault()

  const newUser = {
    fullname: {
      firstname: firstName,
      lastname: lastName
    },
    email: email,
    password: password,
    gender: gender
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
      navigate('/home')
    }

    // reset form
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')

  } catch (error) {
    console.error(error)
    alert(`Error: ${error.response?.data?.message || error.message || 'Failed to create account'}`)
  }
}

  


  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <h3 className="text-4xl font-extrabold tracking-tight text-black">
  Sathi<span className="text-gray-500">-Her</span>
</h3>

         

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>

            <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />
            <h3 className='text-lg font-medium mb-2'>Gender</h3>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg'
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>

           

            <button
              type='submit'
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Create account</button>

          </form>
          <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
        </div>
        <div>
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div >
  )
}

export default UserSignup