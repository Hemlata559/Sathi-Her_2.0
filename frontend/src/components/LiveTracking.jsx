import React, { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

const RecenterMap = ({ position }) => {
  const map = useMap()

  useEffect(() => {
    map.setView(position, map.getZoom())
  }, [position])

  return null
}
const LockCenterOnZoom = ({ position }) => {
  const map = useMap()

  useEffect(() => {
    const handleZoom = () => {
      map.setView(position)
    }

    map.on('zoomend', handleZoom)

    return () => {
      map.off('zoomend', handleZoom)
    }
  }, [map, position])

  return null
}

const defaultPosition = [28.6139, 77.2090] // Delhi fallback

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const LiveTracking = () => {
  const [position, setPosition] = useState(defaultPosition)

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude])
    })

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return (
    <MapContainer
     center={position}
      zoom={12} 
      maxZoom={18}
       minZoom={5} 
       maxBounds={[
         [6.4627, 68.1097],
         [35.5133, 97.3956]
        ]} 
         maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap position={position} />
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
      <LockCenterOnZoom position={position} />
    </MapContainer>
  )
}

export default LiveTracking
