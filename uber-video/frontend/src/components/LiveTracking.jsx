import React, { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const RoutePolyline = ({ pickupCoords, destinationCoords }) => {
  const map = useMap()
  const [route, setRoute] = useState(null)

  useEffect(() => {
    if (!pickupCoords || !destinationCoords) return

    const getRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${destinationCoords[1]},${destinationCoords[0]}?overview=geojson`
        )
        const data = await response.json()
        
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]])
          setRoute(coords)
          
          if (map) {
            const bounds = L.latLngBounds([pickupCoords, destinationCoords])
            map.fitBounds(bounds, { padding: [50, 50] })
          }
        }
      } catch (error) {
        console.error('Route error:', error)
        setRoute([pickupCoords, destinationCoords])
      }
    }

    getRoute()
  }, [pickupCoords, destinationCoords, map])

  if (!route) return null
  return <Polyline positions={route} color="#3b82f6" weight={4} opacity={0.8} />
}

const RecenterMap = ({ position }) => {
  const map = useMap()

  useEffect(() => {
    if (map && position) {
      map.setView(position, 15)
    }
  }, [position, map])

  return null
}

const defaultPosition = [28.6139, 77.2090]

const pickupIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const destinationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const currentIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const LiveTracking = ({ pickup = '', destination = '' }) => {
  const [position, setPosition] = useState(defaultPosition)
  const [pickupCoords, setPickupCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const watchIdRef = useRef(null)

  // Geocode pickup and destination
  useEffect(() => {
    const geocodeAddresses = async () => {
      try {
        if (pickup) {
          const pickupRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pickup)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'sathi-her-app' } }
          )
          const pickupData = await pickupRes.json()
          if (pickupData.length > 0) {
            setPickupCoords([parseFloat(pickupData[0].lat), parseFloat(pickupData[0].lon)])
          }
        }

        if (destination) {
          const destRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'sathi-her-app' } }
          )
          const destData = await destRes.json()
          if (destData.length > 0) {
            setDestinationCoords([parseFloat(destData[0].lat), parseFloat(destData[0].lon)])
          }
        }
      } catch (err) {
        console.error('Geocoding error:', err)
      }
    }

    geocodeAddresses()
  }, [pickup, destination])

  // Get current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
        setIsLoading(false)
      },
      (err) => {
        console.warn('Position error:', err)
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      },
      (err) => console.error('Watch error:', err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [])

  if (isLoading) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
        <p>Loading map...</p>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {error && <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#ef4444', color: 'white', padding: '12px 16px', borderRadius: '6px', zIndex: 1000 }}>{error}</div>}

      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Current location */}
        <Marker position={position} icon={currentIcon}>
          <Popup>Current Location</Popup>
        </Marker>

        {/* Pickup */}
        {pickupCoords && (
          <Marker position={pickupCoords} icon={pickupIcon}>
            <Popup>Pickup</Popup>
          </Marker>
        )}

        {/* Destination */}
        {destinationCoords && (
          <Marker position={destinationCoords} icon={destinationIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Route */}
        {pickupCoords && destinationCoords && <RoutePolyline pickupCoords={pickupCoords} destinationCoords={destinationCoords} />}

        <RecenterMap position={position} />
      </MapContainer>
    </div>
  )
}

export default LiveTracking
