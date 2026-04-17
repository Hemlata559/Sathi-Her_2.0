import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { useLocation } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { fetchRideLiveTracking, normalizeTrackingPayload } from '../utils/liveTracking'
import 'leaflet/dist/leaflet.css'

const defaultPosition = [28.6139, 77.209]

const createIcon = (iconUrl) =>
  L.icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

const pickupIcon = createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png')
const destinationIcon = createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png')
const currentIcon = createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png')
const companionIcon = createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png')

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const RoutePolyline = ({ pickupCoords, destinationCoords, companionCoords, currentPosition }) => {
  const map = useMap()
  const [route, setRoute] = useState(null)

  useEffect(() => {
    const start = pickupCoords || currentPosition
    const end = destinationCoords

    if (!start || !end) return

    const getRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=geojson`
        )
        const data = await response.json()

        if (data.routes?.[0]?.geometry?.coordinates) {
          setRoute(data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]))
        } else {
          setRoute([start, end])
        }
      } catch (routeError) {
        console.error('Route error:', routeError)
        setRoute([start, end])
      }
    }

    getRoute()
  }, [pickupCoords, destinationCoords, currentPosition])

  useEffect(() => {
    const points = [currentPosition, pickupCoords, destinationCoords, companionCoords].filter(Boolean)
    if (map && points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50] })
    }
  }, [companionCoords, currentPosition, destinationCoords, map, pickupCoords])

  if (!route) return null
  return <Polyline positions={route} color='#2563eb' weight={5} opacity={0.85} />
}

const MapViewport = ({ currentPosition, pickupCoords, destinationCoords, companionCoords }) => {
  const map = useMap()

  useEffect(() => {
    const points = [currentPosition, pickupCoords, destinationCoords, companionCoords].filter(Boolean)
    if (map && points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50] })
    }
  }, [companionCoords, currentPosition, destinationCoords, map, pickupCoords])

  return null
}

const getViewerRole = (tracking, currentUserId) => {
  if (tracking?.role) return tracking.role
  if (tracking?.participants?.user?.id === currentUserId) return 'user'
  if (tracking?.participants?.companion?.id === currentUserId) return 'companion'
  return 'user'
}

const LiveTracking = ({ pickup: pickupProp = '', destination: destinationProp = '', companion: companionProp = null }) => {
  const location = useLocation()
  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  const pickup = pickupProp || location.state?.pickup || ''
  const destination = destinationProp || location.state?.destination || ''
  const fallbackCompanion = companionProp || location.state?.companion || { name: 'Companion' }
  const rideId = location.state?.ride?._id || location.state?.rideId || ''

  const [position, setPosition] = useState(defaultPosition)
  const [pickupCoords, setPickupCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)
  const [tracking, setTracking] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const watchIdRef = useRef(null)

  const viewerRole = useMemo(() => getViewerRole(tracking, user?._id), [tracking, user?._id])
  const companionSlot = viewerRole === 'user' ? 'companion' : 'user'
  const companionName = tracking?.participants?.[companionSlot]?.name || fallbackCompanion?.name || 'Companion'
  const companionCoords = tracking?.liveLocations?.[companionSlot]
    ? [tracking.liveLocations[companionSlot].lat, tracking.liveLocations[companionSlot].lng]
    : null

  useEffect(() => {
    let ignore = false

    const geocode = async (query) => {
      if (!query) return null

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
          { headers: { Accept: 'application/json' } }
        )
        const data = await response.json()
        if (!data?.length) return null
        return [Number(data[0].lat), Number(data[0].lon)]
      } catch (geocodeError) {
        console.error('Geocoding error:', geocodeError)
        return null
      }
    }

    const loadAddresses = async () => {
      const [pickupResult, destinationResult] = await Promise.all([geocode(pickup), geocode(destination)])
      if (ignore) return

      setPickupCoords(pickupResult)
      setDestinationCoords(destinationResult)
    }

    loadAddresses()

    return () => {
      ignore = true
    }
  }, [destination, pickup])

  useEffect(() => {
    let ignore = false

    const loadTracking = async () => {
      if (!rideId) {
        setIsLoading(false)
        setError('Matched ride details were not found, so backend live tracking could not be started.')
        return
      }

      try {
        setError('')
        const trackingState = await fetchRideLiveTracking(rideId)

        if (!ignore) {
          setTracking(trackingState)
        }
      } catch (loadError) {
        if (!ignore) {
          console.error('Failed to load live tracking:', loadError)
          setError(loadError.response?.data?.message || 'Unable to load live location details right now.')
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadTracking()

    return () => {
      ignore = true
    }
  }, [rideId])

  useEffect(() => {
    if (!navigator.geolocation) {
      setError((currentError) => currentError || 'Geolocation is not supported on this device. Showing fallback map position instead.')
      setIsLoading(false)
      return undefined
    }

    const emitLocation = (coords) => {
      const nextPosition = [coords.latitude, coords.longitude]
      setPosition(nextPosition)

      if (socket && rideId && user?._id) {
        socket.emit('update-location-user', {
          rideId,
          userId: user._id,
          location: {
            lat: coords.latitude,
            lng: coords.longitude
          }
        })
      }
    }

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        emitLocation(geoPosition.coords)
      },
      () => {
        setError((currentError) => currentError || 'Location permission was denied. Showing fallback positioning until access is granted.')
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
    )

    watchIdRef.current = navigator.geolocation.watchPosition(
      (geoPosition) => {
        emitLocation(geoPosition.coords)
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [rideId, socket, user?._id])

  useEffect(() => {
    if (!socket || !rideId) return undefined

    const handleTrackingUpdate = (payload) => {
      const normalized = normalizeTrackingPayload(payload)
      if (normalized.rideId !== rideId) return

      setTracking((currentTracking) => ({
        ...normalized,
        role: currentTracking?.role || getViewerRole(normalized, user?._id)
      }))
    }

    const handleTrackingError = (payload) => {
      setError(payload?.message || 'Unable to update live location right now.')
    }

    socket.on('ride-live-location-updated', handleTrackingUpdate)
    socket.on('ride-live-location-error', handleTrackingError)

    return () => {
      socket.off('ride-live-location-updated', handleTrackingUpdate)
      socket.off('ride-live-location-error', handleTrackingError)
    }
  }, [rideId, socket, user?._id])

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-slate-100 text-sm font-medium text-slate-500'>
        Loading live tracking...
      </div>
    )
  }

  return (
    <div className='relative h-full w-full'>
      {error && (
        <div className='absolute left-3 right-3 top-3 z-[1000] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm md:max-w-md'>
          {error}
        </div>
      )}

      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        <Marker position={position} icon={currentIcon}>
          <Popup>Your live location</Popup>
        </Marker>

        {pickupCoords && (
          <Marker position={pickupCoords} icon={pickupIcon}>
            <Popup>Pickup point</Popup>
          </Marker>
        )}

        {destinationCoords && (
          <Marker position={destinationCoords} icon={destinationIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {companionCoords && (
          <Marker position={companionCoords} icon={companionIcon}>
            <Popup>{companionName} live location</Popup>
          </Marker>
        )}

        {(pickupCoords || position) && destinationCoords && (
          <RoutePolyline
            pickupCoords={pickupCoords}
            destinationCoords={destinationCoords}
            companionCoords={companionCoords}
            currentPosition={position}
          />
        )}

        <MapViewport
          currentPosition={position}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          companionCoords={companionCoords}
        />
      </MapContainer>
    </div>
  )
}

export default LiveTracking
