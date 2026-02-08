
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
  }
}

  


import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'


const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [gender, setGender] = useState('female');
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

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
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/users/register`,
        newUser
      )

      if (response.status === 201 || response.status === 200) {
        const data = response.data
        setUser && setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }

      setEmail('')
      setFirstName('')
      setLastName('')
      setPassword('')

    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#fce5d1' }}>
      <div className='w-full max-w-5xl mx-auto px-6'>
        <div className='flex gap-12 items-center'>

          {/* Left image */}
          <div className='hidden lg:block flex-1'>
            <img
              src='https://media.istockphoto.com/id/1284603827/photo/friends-meeting-in-coffee-shop-on-a-weekend.jpg?s=612x612&w=0&k=20&c=rEfsbb3Uk5i_Cz-TiOq39eVTm5t30jrF2FMZt40Jps8='
              alt='Friends'
              className='w-full h-[600px] object-cover rounded-[40px]'
            />
          </div>

          {/* Right form */}
          <div className='flex-1 bg-white rounded-[40px] p-10 shadow-xl'>
            <div className='mb-8'>
              <h2 className="text-3xl font-bold tracking-tight">
                Sathi<span style={{ color: '#ff6a5b' }} className='italic'>Her</span>
              </h2>
            </div>

            <div className='mb-6'>
              <h1 className='text-3xl font-extrabold mb-1'>Start your journey!</h1>
              <p className='text-gray-600'>Create your Sathi-Her account</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder='First Name'
                  className='w-full px-4 py-3 rounded-xl border-2'
                  style={{ borderColor: '#e8dcc8' }}
                />
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder='Last Name'
                  className='w-full px-4 py-3 rounded-xl border-2'
                  style={{ borderColor: '#e8dcc8' }}
                />
              </div>

              <div>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Email Address'
                  className='w-full px-4 py-3 rounded-xl border-2'
                  style={{ borderColor: '#e8dcc8' }}
                />
              </div>

              <div className='grid grid-cols-2 gap-4 items-center'>
                <div>
                  <label className='text-sm text-gray-600 mb-1 block'>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className='w-full px-4 py-3 rounded-xl border-2'
                    style={{ borderColor: '#e8dcc8' }}
                  >
                    <option value='female'>Female</option>
                    <option value='male'>Male</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div className='relative'>
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    type={showPassword ? 'text' : 'password'}
                    className='w-full px-4 py-3 rounded-xl border-2'
                    style={{ borderColor: '#e8dcc8' }}
                  />
                  <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-4 top-3 text-gray-400'>
                    <i className={`ri-eye${showPassword ? '-off' : ''}-line text-xl`}></i>
                  </button>
                </div>
              </div>

              <button
                type='submit'
                className='w-full text-white font-bold py-3 rounded-full text-lg transition'
                style={{ background: 'linear-gradient(90deg,#ff9a7f,#ff6a5b)' }}
              >
                Create Account
              </button>
            </form>

            <div className='flex justify-center gap-8 my-6'>
              <button className='w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition'>
                <svg className='w-6 h-6' viewBox='0 0 24 24'><path fill='#ff6a5b' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/><path fill='#ff9a7f' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/></svg>
              </button>
              <button className='w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition'>
                <i className='ri-apple-fill text-2xl text-black'></i>
              </button>
            </div>

            <p className='text-center text-gray-700'>
              Already a member?{' '}
              <Link to='/login' style={{ color: '#ff6a5b' }} className='font-semibold underline hover:opacity-80'>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSignup