// import React, { useState, useContext } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { UserDataContext } from '../context/UserContext'
// import axios from 'axios'

// const UserLogin = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [gender, setGender] = useState('female') // default

//   const { setUser } = useContext(UserDataContext)
//   const navigate = useNavigate()

//   const submitHandler = async (e) => {
//     e.preventDefault()

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/users/login`,
//         {
//           email,
//           password,
//           gender   // backend demand kar raha hai
//         }
//       )

//       if (response.status === 200) {
//         const data = response.data
//         setUser(data.user)
//         localStorage.setItem('token', data.token)
//         navigate('/home')
//       }

//     } catch (err) {
//       console.log(err.response?.data)
//       alert(err.response?.data?.errors?.[0]?.msg || "Login failed")
//     }

//     setEmail('')
//     setPassword('')
//   }

//   return (
//     <div className='p-7 h-screen flex flex-col justify-between'>
//       <div>
//         <h3 className="text-4xl font-extrabold tracking-tight text-black">
//   Sathi<span className="text-gray-500">-Her</span>
// </h3>


//         <form onSubmit={submitHandler}>
//           <h3 className='text-lg font-medium mb-2'>What's your email</h3>
//           <input
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg'
//             type="email"
//             placeholder='email@example.com'
//           />

//           <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
//           <input
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg'
//             type="password"
//             placeholder='password'
//           />

//           {/* Hidden gender field */}
//           <input type="hidden" value={gender} />

//           <button
//             type='submit'
//             className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'
//           >
//             Login
//           </button>
//         </form>

//         <p className='text-center'>
//           New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default UserLogin
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [gender, setGender] = useState('female')

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        {
          email,
          password,
          gender
        }
      )

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }

    } catch (err) {
      console.log(err.response?.data)
      alert(err.response?.data?.errors?.[0]?.msg || "Login failed")
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#fce5d1' }}>
      <div className='w-full max-w-5xl mx-auto px-6'>
        <div className='flex gap-12 items-center'>
          
          {/* Left Side - Image */}
          <div className='hidden lg:block flex-1'>
            <img 
              src='https://i.pinimg.com/1200x/7c/fd/ef/7cfdefa81cba287c4cb6f3ec32588b67.jpg'
              alt='Travel friends'
              className='w-full h-[600px] object-cover rounded-[40px]'
            />
          </div>

          {/* Right Side - Form */}
          <div className='flex-1 bg-white rounded-[40px] p-10 shadow-xl'>
            {/* Logo */}
            <div className='mb-12'>
              <h2 className="text-3xl font-bold tracking-tight">
                  Sathi<span style={{ color: '#f55a4b' }} className='italic'> Her</span>
              </h2>
            </div>

            {/* Heading */}
            <div className='mb-8'>
              <h1 className='text-4xl font-bold text-black mb-2'>Welcome Back!</h1>
              <p className='text-gray-600 text-base'>Log in to your Sathi-Her community</p>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className='space-y-6'>
              {/* Email Input */}
              <div>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-5 py-3 rounded-xl border-2'
                  style={{ borderColor: '#fcc17e' }}
                  type="email"
                  placeholder='Email Address'
                />
              </div>

              {/* Password Input */}
              <div className='relative'>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-5 py-3 rounded-xl border-2'
                  style={{ borderColor: '#fda379' }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-3 text-gray-400'
                >
                  <i className={`ri-eye${showPassword ? '-off' : ''}-line text-2xl`}></i>
                </button>
              </div>

              {/* Hidden gender field */}
              <input type="hidden" value={gender} />

              {/* Login Button */}
              <button
                type='submit'
                className='w-full text-white font-bold py-3 rounded-full text-lg transition'
                style={{ backgroundColor: '#ff9a7f' }}
              >
                Start My Journey
              </button>
            </form>

            {/* Social Login */}
            <div className='flex justify-center gap-8 my-8'>
              <button className='w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition'>
                <svg className='w-6 h-6' viewBox='0 0 24 24'><path fill='#ff6a5b' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/><path fill='#ff9a7f' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/></svg>
              </button>
              <button className='w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition'>
                <i className='ri-apple-fill text-2xl text-black'></i>
              </button>
            </div>

            {/* Signup Link */}
            <p className='text-center text-gray-700'>
              New to the sisterhood?{' '}
              <Link to='/signup' style={{ color: '#ff6a5b' }} className='font-semibold underline hover:opacity-80'>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin

