import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  acceptCompanionRequest,
  cancelCompanionRequest,
  declineCompanionRequest,
  fetchIncomingCompanionRequests,
  fetchOutgoingCompanionRequests
} from '../utils/companionRequests'

const CompanionRequests = () => {
  const navigate = useNavigate()
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyRequestId, setBusyRequestId] = useState('')
  const [activeTab, setActiveTab] = useState('incoming')

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true)
        setError('')
        const [incoming, outgoing] = await Promise.all([
          fetchIncomingCompanionRequests(),
          fetchOutgoingCompanionRequests()
        ])
        setIncomingRequests(incoming)
        setOutgoingRequests(outgoing)
      } catch (loadError) {
        console.error('Failed to load companion requests:', loadError)
        setError(loadError.response?.data?.message || 'Unable to load companion requests right now.')
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [])

  const handleIncomingAction = async (requestId, status) => {
    try {
      setBusyRequestId(requestId)
      const updatedRequest =
        status === 'accepted'
          ? await acceptCompanionRequest(requestId)
          : await declineCompanionRequest(requestId)

      setIncomingRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId ? updatedRequest : request
        )
      )
    } catch (actionError) {
      console.error(`Failed to ${status} request:`, actionError)
      setError(actionError.response?.data?.message || `Unable to ${status} this request right now.`)
    } finally {
      setBusyRequestId('')
    }
  }

  const handleOutgoingCancel = async (requestId) => {
    try {
      setBusyRequestId(requestId)
      const updatedRequest = await cancelCompanionRequest(requestId)
      setOutgoingRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId ? updatedRequest : request
        )
      )
    } catch (actionError) {
      console.error('Failed to cancel request:', actionError)
      setError(actionError.response?.data?.message || 'Unable to cancel this request right now.')
    } finally {
      setBusyRequestId('')
    }
  }

  const pendingCount = incomingRequests.filter((request) => request.status === 'pending').length
  const requests = activeTab === 'incoming' ? incomingRequests : outgoingRequests

  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,_#eff6ff,_#f8fafc_45%,_#ffffff)] px-4 py-8'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>Companion Inbox</p>
            <h1 className='mt-2 text-4xl font-bold text-slate-900'>Incoming companion requests</h1>
            <p className='mt-2 text-base text-slate-600'>
              Review who wants to match with you, then accept or remove the request.
            </p>
          </div>
          <button
            type='button'
            onClick={() => navigate('/home')}
            className='rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          >
            Back to Home
          </button>
        </div>

        <div className='mb-6 rounded-3xl bg-white p-5 shadow-sm'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-sm text-slate-500'>Pending incoming requests</p>
              <h2 className='text-3xl font-bold text-slate-900'>{pendingCount}</h2>
            </div>
            <div className='rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700'>
              Dedicated request center
            </div>
          </div>
        </div>

        <div className='mb-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm'>
          <button
            type='button'
            onClick={() => setActiveTab('incoming')}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold ${activeTab === 'incoming' ? 'bg-blue-700 text-white' : 'text-slate-600'}`}
          >
            Incoming
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('outgoing')}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold ${activeTab === 'outgoing' ? 'bg-blue-700 text-white' : 'text-slate-600'}`}
          >
            Outgoing
          </button>
        </div>

        <div className='space-y-4'>
          {error && (
            <div className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
              {error}
            </div>
          )}

          {loading && (
            <div className='rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm'>
              <p className='text-sm font-medium text-slate-500'>Loading companion requests...</p>
            </div>
          )}

          {!loading && requests.length === 0 && (
            <div className='rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                <i className='ri-notification-off-line text-2xl text-slate-500' />
              </div>
              <h2 className='mt-4 text-2xl font-bold text-slate-900'>No companion requests yet</h2>
              <p className='mt-2 text-sm text-slate-500'>
                {activeTab === 'incoming'
                  ? 'Requests will appear here only after you schedule a journey and someone sends you a companion request.'
                  : 'Requests you send to other companions will appear here.'}
              </p>
            </div>
          )}

          {requests.map((request) => (
            <div key={request.id} className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-start gap-4'>
                  <img
                    src={request.requesterImage}
                    alt={request.requesterName}
                    className='h-16 w-16 rounded-full object-cover shadow-md'
                  />
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h2 className='text-xl font-bold text-slate-900'>
                        {activeTab === 'incoming' ? request.requesterName : request.receiverName}
                      </h2>
                      {request.verified && (
                        <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                          Verified
                        </span>
                      )}
                      <span className='rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700'>
                        Rating {request.rating}
                      </span>
                    </div>
                    <p className='mt-2 max-w-2xl text-sm text-slate-600'>{request.message}</p>
                    <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                      <div className='rounded-2xl bg-slate-50 p-3'>
                        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Pickup</p>
                        <p className='mt-1 text-sm font-medium text-slate-800'>{request.pickup}</p>
                      </div>
                      <div className='rounded-2xl bg-slate-50 p-3'>
                        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Destination</p>
                        <p className='mt-1 text-sm font-medium text-slate-800'>{request.destination}</p>
                      </div>
                      <div className='rounded-2xl bg-slate-50 p-3'>
                        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Schedule</p>
                        <p className='mt-1 text-sm font-medium text-slate-800'>{request.schedule}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='min-w-[220px]'>
                  <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    request.status === 'accepted'
                      ? 'bg-emerald-50 text-emerald-700'
                      : request.status === 'declined'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-blue-50 text-blue-700'
                  }`}>
                    Status: {request.status}
                  </div>

                  <div className='flex flex-col gap-3'>
                    {activeTab === 'incoming' ? (
                      <>
                        <button
                          type='button'
                          disabled={request.status !== 'pending' || busyRequestId === request.id}
                          onClick={() => handleIncomingAction(request.id, 'accepted')}
                          className={`rounded-2xl px-5 py-4 text-sm font-semibold ${
                            request.status === 'pending' && busyRequestId !== request.id
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'cursor-not-allowed bg-slate-200 text-slate-500'
                          }`}
                        >
                          {busyRequestId === request.id ? 'Updating...' : 'Accept Request'}
                        </button>
                        <button
                          type='button'
                          disabled={request.status !== 'pending' || busyRequestId === request.id}
                          onClick={() => handleIncomingAction(request.id, 'declined')}
                          className={`rounded-2xl px-5 py-4 text-sm font-semibold ${
                            request.status === 'pending' && busyRequestId !== request.id
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'cursor-not-allowed bg-slate-200 text-slate-500'
                          }`}
                        >
                          Remove Request
                        </button>
                      </>
                    ) : (
                      <button
                        type='button'
                        disabled={request.status !== 'pending' || busyRequestId === request.id}
                        onClick={() => handleOutgoingCancel(request.id)}
                        className={`rounded-2xl px-5 py-4 text-sm font-semibold ${
                          request.status === 'pending' && busyRequestId !== request.id
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'cursor-not-allowed bg-slate-200 text-slate-500'
                        }`}
                      >
                        {busyRequestId === request.id ? 'Updating...' : 'Cancel Request'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompanionRequests
