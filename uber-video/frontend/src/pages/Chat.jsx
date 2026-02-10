import React, { useRef, useEffect, useContext } from 'react'
import { UserDataContext } from '../context/UserContext.jsx'

const Chat = () => {
  const [messages, setMessages] = React.useState([
    { id: 1, from: 'Companion', text: 'Hi, I can meet at the pickup point.' },
    { id: 2, from: 'Companion', text: 'Would you like to share your ETA?' },
    { id: 3, from: 'Companion', type: 'file', filename: 'Portfolio.pdf', size: '2 MB' }
  ])

  const [text, setText] = React.useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // scroll to bottom when messages change
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), from: 'You', text }])
    setText('')
    inputRef.current?.focus()
  }

  const attachFile = () => {
    setMessages(prev => [...prev, { id: Date.now(), from: 'You', type: 'file', filename: 'Snapshot.png', size: '480 KB' }])
  }

  const downloadFile = (m) => {
    // placeholder: in real app we'd fetch/download
    alert(`Downloading ${m.filename}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const { user } = useContext(UserDataContext)
  const first = user?.fullName?.firstName?.trim()
  const last = user?.fullName?.lastName?.trim()
  let displayName = (first || last) ? `${first || ''}${first && last ? ' ' : ''}${last || ''}` : (user?.email || 'Companion')
  if (displayName === 'test5@gmail.com') displayName = 'Alia Rajput'

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col'>
        {/* Header */}
          <div className='p-4 flex items-center gap-3 border-b'>
          <div className='h-12 w-12 rounded-full bg-gradient-to-tr from-pink-300 to-pink-500 flex items-center justify-center text-white font-bold'>{(displayName[0]||'A').toUpperCase()}</div>
          <div className='flex-1'>
            <div className='font-semibold'>{displayName}</div>
            <div className='text-xs text-green-500'>Online</div>
          </div>
          <div className='text-gray-400'>
            <i className='ri-more-2-fill text-xl'></i>
          </div>
        </div>

        {/* Messages */}
        <div ref={listRef} className='p-4 flex-1 overflow-auto bg-gradient-to-b from-indigo-50 to-white'>
          <div className='space-y-3'>
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.from === 'You' ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white' : 'bg-white'} max-w-[80%] p-3 rounded-2xl shadow`}>
                  {m.type === 'file' ? (
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-indigo-100 rounded-md'>
                        <i className='ri-file-3-line text-indigo-600 text-xl'></i>
                      </div>
                      <div className='flex-1 text-left'>
                        <div className='font-medium'>{m.filename}</div>
                        <div className='text-xs text-gray-500'>{m.size}</div>
                      </div>
                      <button onClick={() => downloadFile(m)} className='text-indigo-600'>
                        <i className='ri-download-line'></i>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className='text-xs text-gray-400'>{m.from}</div>
                      <div className='text-sm'>{m.text}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className='p-3 border-t bg-white flex items-center gap-3'>
          <button onClick={attachFile} className='text-gray-500 p-2 rounded-lg hover:bg-gray-100'>
            <i className='ri-attachment-line text-xl'></i>
          </button>
          <textarea ref={inputRef} value={text} onChange={e => setText(e.target.value)} onKeyDown={onKeyDown} rows={1} placeholder='Type a message' className='flex-1 resize-none p-2 rounded-lg border focus:outline-none' />
          <button onClick={send} className='bg-pink-500 text-white p-2 rounded-lg'>
            <i className='ri-send-plane-2-fill'></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
