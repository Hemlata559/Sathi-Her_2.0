import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import BrandNavbar from '../components/BrandNavbar'
import { UserDataContext } from '../context/UserContext'
import API_BASE_URL from '../utils/api'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email: email.trim().toLowerCase(),
        password,
        gender: 'female'
      })

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (err) {
      console.error(err.response?.data)
      alert(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'Login failed'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='brand-shell px-4 pb-12'>
      <BrandNavbar compact />

      <div className='mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
        <div className='px-2'>
          <div className='inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/80 px-4 py-2 text-sm font-semibold text-fuchsia-600'>
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
            Welcome back to your safe travel space
          </div>
          <h1 className='mt-6 text-5xl font-black tracking-tight text-slate-900 md:text-6xl'>Continue your journey with confidence.</h1>
          <p className='mt-6 max-w-xl text-lg leading-8 text-slate-600'>
            Re-enter your account to manage companion requests, view live routes, and coordinate your next verified trip.
          </p>

          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            <div className='brand-glass rounded-[28px] p-5'>
              <p className='text-sm font-bold text-slate-900'>Real-time trip chat</p>
              <p className='mt-2 text-sm leading-6 text-slate-600'>Talk to your matched companion inside a ride-linked conversation.</p>
            </div>
            <div className='brand-glass rounded-[28px] p-5'>
              <p className='text-sm font-bold text-slate-900'>Verified start flow</p>
              <p className='mt-2 text-sm leading-6 text-slate-600'>OTP and live face verification stay connected to the same ride.</p>
            </div>
          </div>
        </div>

        <div className='brand-glass rounded-[38px] p-6 md:p-8 lg:p-10'>
          <div className='mx-auto max-w-md'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#8b5cf6,_#ec4899)] text-white shadow-lg shadow-fuchsia-200'>
                <i className='ri-shield-check-fill text-2xl' />
              </div>
              <div>
                <h2 className='text-3xl font-black tracking-tight text-slate-900'>SafeCompanion</h2>
                <p className='text-sm text-slate-500'>Sign in to continue your safe journey</p>
              </div>
            </div>

            <div className='mt-8 space-y-3'>
              <button type='button' className='w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50'>
                <span className='flex items-center justify-center gap-3'>
                  <i className='ri-google-fill text-lg text-rose-500' />
                  Continue with Google
                </span>
              </button>
              <button type='button' className='w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50'>
                <span className='flex items-center justify-center gap-3'>
                  <i className='ri-apple-fill text-lg text-slate-900' />
                  Continue with Apple
                </span>
              </button>
            </div>

            <div className='my-8 flex items-center gap-4 text-sm text-slate-400'>
              <div className='h-px flex-1 bg-slate-200' />
              Or continue with email
              <div className='h-px flex-1 bg-slate-200' />
            </div>

            <form onSubmit={submitHandler} className='space-y-5'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Email Address</label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-800 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100'
                  type='email'
                  placeholder='Enter your email'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Password</label>
                <div className='relative'>
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-14 text-base text-slate-800 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                  />
                  <button type='button' onClick={() => setShowPassword((value) => !value)} className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400'>
                    <i className={`ri-eye${showPassword ? '-off' : ''}-line text-xl`} />
                  </button>
                </div>
              </div>

              <div className='flex justify-end'>
                <button type='button' className='text-sm font-semibold text-fuchsia-500 transition hover:text-fuchsia-600'>Forgot Password?</button>
              </div>

              <button type='submit' disabled={submitting} className={`brand-button w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition ${submitting ? 'cursor-not-allowed opacity-70' : ''}`}>
                {submitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className='mt-8 text-center text-sm text-slate-600'>
              Don&apos;t have an account?{' '}
              <Link to='/signup' className='font-bold text-fuchsia-500 transition hover:text-fuchsia-600'>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
