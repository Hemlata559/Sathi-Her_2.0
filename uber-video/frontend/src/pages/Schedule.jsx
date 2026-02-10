import React from 'react'
import { useNavigate } from 'react-router-dom'

const Schedule = () => {
    const navigate = useNavigate();
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');

    return (
        <div className='p-4'>
            <h2 className='text-2xl font-semibold mb-4'>Schedule Companion</h2>

            <div className='space-y-3 max-w-md'>
                <label className='block'>
                    <span className='text-sm'>Date</span>
                    <input type='date' value={date} onChange={e => setDate(e.target.value)} className='w-full mt-1 p-2 border rounded' />
                </label>

                <label className='block'>
                    <span className='text-sm'>Time</span>
                    <input type='time' value={time} onChange={e => setTime(e.target.value)} className='w-full mt-1 p-2 border rounded' />
                </label>

                <div className='flex gap-2'>
                    <button onClick={() => { /* TODO: wire schedule to backend */ navigate('/home') }} className='bg-pink-500 text-white p-2 rounded'>Confirm</button>
                    <button onClick={() => navigate(-1)} className='bg-gray-200 p-2 rounded'>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Schedule
