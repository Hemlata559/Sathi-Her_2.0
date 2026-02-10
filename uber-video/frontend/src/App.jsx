import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'

import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'


import Riding from './pages/Riding'
import Schedule from './pages/Schedule'
import Chat from './pages/Chat'
import LiveTracking from './components/LiveTracking'

import 'remixicon/fonts/remixicon.css'

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/schedule' element={<UserProtectWrapper><Schedule /></UserProtectWrapper>} />
        <Route path='/chat' element={<UserProtectWrapper><Chat /></UserProtectWrapper>} />
        <Route path='/live-tracking' element={<UserProtectWrapper><LiveTracking /></UserProtectWrapper>} />
        

        <Route path='/signup' element={<UserSignup />} />
        
        <Route path='/home'
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        

        
       
      </Routes>
    </div>
  )
}

export default App