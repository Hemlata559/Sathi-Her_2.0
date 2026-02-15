import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import UserContext from './context/UserContext.jsx';
import SocketProvider from './context/SocketContext.jsx';
import 'leaflet/dist/leaflet.css'


createRoot(document.getElementById('root')).render(

  
    <UserContext>
      <SocketProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </UserContext>
  

)
