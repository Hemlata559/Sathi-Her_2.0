import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import {
  fetchConversationMessages,
  getOrCreateConversation,
  markConversationAsRead,
  normalizeChatMessage,
  sendConversationMessage
} from '../utils/chat'

const formatTime = (date) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date))
}

const Chat = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  const companion = state?.companion || {
    id: '',
    name: 'Akshita Negi',
    image: 'https://images.squarespace-cdn.com/content/v1/58e167a8414fb5c0b2b8c13e/1503561540900-K0FXVM3QNP4843AJGQCD/Circle+Profile.jpg',
    verified: true,
    rating: 4.8,
    type: 'Verified travel buddy'
  }

  const pickup = state?.pickup || 'Pickup point'
  const destination = state?.destination || 'Destination'
  const schedule = state?.schedule || 'Leaving soon'
  const rideId = state?.ride?._id || state?.rideId || ''

  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    let ignore = false

    const loadConversation = async () => {
      if (!rideId || !companion.id) {
        setLoading(false)
        setError('This chat will be available once the ride and matched companion are loaded.')
        return
      }

      try {
        setLoading(true)
        setError('')

        const nextConversation = await getOrCreateConversation({
          rideId,
          otherUserId: companion.id
        })

        if (ignore) return

        setConversation(nextConversation)

        const fetchedMessages = await fetchConversationMessages(nextConversation.id)

        if (ignore) return

        setMessages(fetchedMessages)
        await markConversationAsRead(nextConversation.id)
      } catch (loadError) {
        if (!ignore) {
          console.error('Failed to load conversation:', loadError)
          setError(loadError.response?.data?.message || 'Unable to open the trip chat right now.')
          setMessages([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadConversation()

    return () => {
      ignore = true
    }
  }, [companion.id, rideId])

  useEffect(() => {
    if (!socket || !conversation?.id) return undefined

    const handleNewMessage = (incomingMessage) => {
      const normalizedMessage = normalizeChatMessage(incomingMessage)

      if (normalizedMessage.conversationId !== conversation.id) return

      setMessages((currentMessages) => {
        if (currentMessages.some((message) => message.id === normalizedMessage.id)) {
          return currentMessages
        }

        return [...currentMessages, normalizedMessage]
      })

      if (normalizedMessage.senderId !== user?._id) {
        markConversationAsRead(conversation.id).catch((readError) => {
          console.error('Failed to mark conversation as read:', readError)
        })
      }
    }

    socket.on('new-message', handleNewMessage)

    return () => {
      socket.off('new-message', handleNewMessage)
    }
  }, [conversation?.id, socket, user?._id])

  const send = async (draft = text) => {
    if (!draft.trim() || !conversation?.id || sending) return

    try {
      setSending(true)
      setError('')

      const sentMessage = await sendConversationMessage({
        conversationId: conversation.id,
        text: draft.trim()
      })

      setMessages((currentMessages) => {
        if (currentMessages.some((message) => message.id === sentMessage.id)) {
          return currentMessages
        }

        return [...currentMessages, sentMessage]
      })

      setText('')
      inputRef.current?.focus()
    } catch (sendError) {
      console.error('Failed to send message:', sendError)
      setError(sendError.response?.data?.message || 'Unable to send the message right now.')
    } finally {
      setSending(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const quickReplies = [
    'What is your ETA?',
    'I am near the pickup point',
    'Please share live location',
    'We should verify before starting'
  ]

  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_45%,_#ffffff_100%)] p-4'>
      <div className='mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:grid lg:grid-cols-[320px_1fr]'>
        <aside className='border-b border-slate-200 bg-slate-50 p-6 lg:border-b-0 lg:border-r'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='mb-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700'
          >
            <i className='ri-arrow-left-line' />
            Back
          </button>

          <div className='flex items-center gap-4'>
            <img src={companion.image} alt={companion.name} className='h-16 w-16 rounded-full object-cover shadow-md' />
            <div>
              <h2 className='text-xl font-bold text-slate-900'>{companion.name}</h2>
              <p className='text-sm text-emerald-600'>Real-time matched chat</p>
              <p className='text-sm text-slate-500'>{companion.type}</p>
            </div>
          </div>

          <div className='mt-6 space-y-3'>
            <div className='rounded-2xl bg-white p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Pickup</p>
              <p className='mt-2 text-sm font-medium text-slate-800'>{pickup}</p>
            </div>
            <div className='rounded-2xl bg-white p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Destination</p>
              <p className='mt-2 text-sm font-medium text-slate-800'>{destination}</p>
            </div>
            <div className='rounded-2xl bg-white p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Schedule</p>
              <p className='mt-2 text-sm font-medium text-slate-800'>{schedule}</p>
            </div>
            <div className='rounded-2xl bg-white p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Conversation</p>
              <p className='mt-2 text-sm font-medium text-slate-800'>
                {conversation?.id ? 'Connected to backend chat' : 'Waiting for journey chat to open'}
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={() => navigate('/live-tracking', { state: { companion, pickup, destination, schedule, ride: state?.ride } })}
            className='mt-6 w-full rounded-2xl bg-blue-700 px-5 py-4 text-sm font-semibold text-white hover:bg-blue-800'
          >
            See Companion Live Location
          </button>
        </aside>

        <section className='flex min-h-[60vh] flex-col'>
          <div className='border-b border-slate-200 px-6 py-5'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <h1 className='text-2xl font-bold text-slate-900'>Trip coordination chat</h1>
                <p className='mt-1 text-sm text-slate-500'>This conversation is now backed by your matched ride and real backend messages.</p>
              </div>
              <div className='rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700'>
                Verified match
              </div>
            </div>
          </div>

          {error && (
            <div className='mx-6 mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
              {error}
            </div>
          )}

          <div ref={listRef} className='flex-1 space-y-4 overflow-auto bg-[linear-gradient(180deg,_#f8fafc,_#ffffff)] px-6 py-6'>
            {loading ? (
              <div className='rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm'>
                Loading your matched conversation...
              </div>
            ) : messages.length === 0 ? (
              <div className='rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-500'>
                No messages yet. Start the conversation and coordinate your meetup.
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.senderId === user?._id
                const senderLabel = isUser ? 'You' : message.senderName || companion.name

                return (
                  <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-[24px] px-4 py-3 shadow-sm ${isUser ? 'bg-blue-700 text-white' : 'border border-slate-200 bg-white text-slate-800'}`}>
                      <div className={`text-xs font-semibold ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                        {senderLabel}
                      </div>
                      <div className='mt-1 text-sm leading-6'>{message.text}</div>
                      <div className={`mt-2 text-[11px] ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                        {formatTime(message.createdAt)}
                        {isUser ? ` • ${message.status}` : ''}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className='border-t border-slate-200 bg-white px-6 py-4'>
            <div className='mb-3 flex flex-wrap gap-2'>
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type='button'
                  onClick={() => send(reply)}
                  disabled={!conversation?.id || sending}
                  className='rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className='flex items-end gap-3'>
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder='Type a message to your companion'
                className='min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-400 focus:outline-none'
              />
              <button
                type='button'
                onClick={() => send()}
                disabled={!conversation?.id || sending}
                className='rounded-2xl bg-blue-700 px-5 py-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300'
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Chat
