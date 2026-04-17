import React from 'react'
import { Link } from 'react-router-dom'
import BrandNavbar from '../components/BrandNavbar'

const featureCards = [
  {
    icon: 'ri-shield-check-line',
    title: 'Verified Safety Layer',
    text: 'Travel only with identity-verified women companions, OTP confirmation, and journey start checks.'
  },
  {
    icon: 'ri-group-line',
    title: 'Smart Companion Matching',
    text: 'Match by journey timing, route similarity, safety preferences, and availability.'
  },
  {
    icon: 'ri-map-pin-range-line',
    title: 'Live Meetup Tracking',
    text: 'See each other on the map in real time so pickup coordination feels calm and predictable.'
  },
  {
    icon: 'ri-message-3-line',
    title: 'Secure Coordination Chat',
    text: 'Use a trip-linked chat to confirm ETA, meeting point, OTP readiness, and emergency updates.'
  }
]

const proofPoints = [
  'Women-first matching flow',
  'Companion live location',
  'Journey OTP + face verification',
  'Emergency contact support'
]

const Start = () => {
  return (
    <div className='brand-shell px-4 pb-12'>
      <BrandNavbar />

      <main className='mx-auto mt-8 max-w-7xl'>
        <section className='grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center'>
          <div className='px-2 pt-8 lg:pt-16'>
            <div className='inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/75 px-4 py-2 text-sm font-semibold text-fuchsia-600 shadow-sm'>
              <span className='h-2 w-2 rounded-full bg-emerald-500' />
              Safer shared journeys for women
            </div>

            <h1 className='mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-900 md:text-7xl'>
              Travel safe.
              <span className='block bg-[linear-gradient(135deg,_#8b5cf6,_#ec4899)] bg-clip-text text-transparent'>Travel together.</span>
            </h1>

            <p className='mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl'>
              SafeCompanion helps women plan trips with verified companions, live location visibility,
              secure chat, and a journey start flow designed around trust.
            </p>

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <Link to='/signup' className='brand-button inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold text-white transition'>
                Get Started
              </Link>
              <Link to='/login' className='inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-8 py-4 text-base font-bold text-slate-700 transition hover:bg-white'>
                Login
              </Link>
            </div>

            <div className='mt-10 grid max-w-2xl gap-3 sm:grid-cols-2'>
              {proofPoints.map((item) => (
                <div key={item} className='flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm'>
                  <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-500'>
                    <i className='ri-checkbox-circle-fill' />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className='relative'>
            <div className='absolute -left-6 top-10 h-24 w-24 rounded-full bg-violet-200/50 blur-2xl' />
            <div className='absolute right-0 top-0 h-32 w-32 rounded-full bg-pink-200/60 blur-3xl' />
            <div className='brand-glass relative overflow-hidden rounded-[40px] p-6 md:p-8'>
              <div className='absolute inset-x-8 top-0 h-32 rounded-b-[40px] bg-[radial-gradient(circle,_rgba(236,72,153,0.14),_transparent_70%)]' />

              <div className='relative grid gap-5'>
                <div className='rounded-[28px] bg-[linear-gradient(135deg,_#ffffff,_#fff2fb)] p-5 shadow-sm'>
                  <div className='flex items-center justify-between gap-4'>
                    <div>
                      <p className='text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-500'>Active Journey</p>
                      <h2 className='mt-2 text-2xl font-black text-slate-900'>Delhi University to Rajiv Chowk</h2>
                      <p className='mt-2 text-sm text-slate-500'>Matched with a verified companion for a 6:30 PM schedule.</p>
                    </div>
                    <div className='rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600'>Safe Match</div>
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='rounded-[28px] bg-slate-900 p-5 text-white shadow-lg'>
                    <p className='text-xs font-bold uppercase tracking-[0.22em] text-violet-200'>Live Tracking</p>
                    <div className='mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-semibold text-slate-200'>Companion proximity</span>
                        <span className='rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300'>280 m away</span>
                      </div>
                      <div className='mt-4 h-40 rounded-[20px] bg-[linear-gradient(135deg,_rgba(139,92,246,0.28),_rgba(236,72,153,0.18))] p-4'>
                        <div className='flex h-full items-end justify-between'>
                          <div className='flex flex-col items-center gap-2'>
                            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow'>
                              <i className='ri-user-location-fill' />
                            </span>
                            <span className='text-xs font-semibold'>You</span>
                          </div>
                          <div className='mb-12 h-px flex-1 border-t border-dashed border-white/40' />
                          <div className='flex flex-col items-center gap-2'>
                            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-fuchsia-600 shadow'>
                              <i className='ri-map-pin-user-fill' />
                            </span>
                            <span className='text-xs font-semibold'>Companion</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='grid gap-4'>
                    <div className='rounded-[28px] bg-white p-5 shadow-sm'>
                      <p className='text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-500'>Start Journey Gate</p>
                      <div className='mt-4 space-y-3'>
                        <div className='flex items-center justify-between rounded-2xl bg-fuchsia-50 px-4 py-3'>
                          <span className='text-sm font-semibold text-slate-700'>Live face capture</span>
                          <i className='ri-checkbox-circle-fill text-emerald-500' />
                        </div>
                        <div className='flex items-center justify-between rounded-2xl bg-violet-50 px-4 py-3'>
                          <span className='text-sm font-semibold text-slate-700'>Companion match score</span>
                          <span className='text-sm font-bold text-violet-600'>84%</span>
                        </div>
                        <div className='flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3'>
                          <span className='text-sm font-semibold text-slate-700'>Meetup OTP</span>
                          <span className='text-sm font-bold text-amber-600'>Pending</span>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-[28px] bg-[linear-gradient(135deg,_#8b5cf6,_#ec4899)] p-5 text-white shadow-lg'>
                      <p className='text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-100'>Emergency Ready</p>
                      <h3 className='mt-3 text-2xl font-black'>Help should never feel far away.</h3>
                      <p className='mt-3 text-sm leading-7 text-fuchsia-50'>Emergency contacts, verification checkpoints, and trip-linked support are built into the flow.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='features' className='mt-20'>
          <div className='mx-auto max-w-3xl text-center'>
            <p className='text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-500'>Why It Feels Safer</p>
            <h2 className='mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl'>One visual theme. One safety-first experience.</h2>
            <p className='mt-4 text-lg text-slate-600'>From first visit to trip start, every page should feel like the same trusted product.</p>
          </div>

          <div className='mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
            {featureCards.map((card) => (
              <div key={card.title} className='brand-glass rounded-[30px] p-6'>
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_rgba(139,92,246,0.12),_rgba(236,72,153,0.18))] text-2xl text-fuchsia-600'>
                  <i className={card.icon} />
                </div>
                <h3 className='mt-5 text-2xl font-black text-slate-900'>{card.title}</h3>
                <p className='mt-3 text-base leading-7 text-slate-600'>{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id='about' className='mt-20'>
          <div className='brand-glass rounded-[38px] px-6 py-8 md:px-10 md:py-12'>
            <div className='grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
              <div>
                <p className='text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-500'>About SafeCompanion</p>
                <h2 className='mt-4 text-4xl font-black tracking-tight text-slate-900'>A calmer way for women to plan shared journeys.</h2>
              </div>
              <div>
                <p className='text-lg leading-8 text-slate-600'>
                  SafeCompanion is designed around practical trust: verified companions, live location visibility,
                  real journey chat, companion request approvals, and a protected journey start flow.
                </p>
                <div className='mt-6 flex flex-wrap gap-3'>
                  <Link to='/signup' className='brand-button rounded-full px-6 py-3 text-sm font-bold text-white'>Create account</Link>
                  <Link to='/login' className='rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700'>Sign in</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Start
