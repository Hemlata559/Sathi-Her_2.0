import axios from 'axios'
import API_BASE_URL from './api'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

const getDisplayName = (user) => {
  if (!user) return 'Companion'

  const first = user.fullName?.firstName || user.fullname?.firstname || user.firstname || ''
  const last = user.fullName?.lastName || user.fullname?.lastname || user.lastname || ''

  return `${first} ${last}`.trim() || user.email || 'Companion'
}

export const normalizeTrackingPayload = (tracking) => ({
  rideId: tracking?.rideId || tracking?._id,
  role: tracking?.role || 'user',
  status: tracking?.status || 'matched',
  liveTracking: Boolean(tracking?.liveTracking),
  liveLocations: {
    user: tracking?.liveLocations?.user || null,
    companion: tracking?.liveLocations?.companion || null
  },
  participants: {
    user: tracking?.participants?.user
      ? {
          id: tracking.participants.user._id,
          name: getDisplayName(tracking.participants.user),
          image: tracking.participants.user.profileImageUrl || 'https://i.pravatar.cc/100?img=32'
        }
      : null,
    companion: tracking?.participants?.companion
      ? {
          id: tracking.participants.companion._id,
          name: getDisplayName(tracking.participants.companion),
          image: tracking.participants.companion.profileImageUrl || 'https://i.pravatar.cc/100?img=48'
        }
      : null
  }
})

export const fetchRideLiveTracking = async (rideId) => {
  const response = await axios.get(`${API_BASE_URL}/rides/${rideId}/live-tracking`, {
    headers: getAuthHeaders()
  })

  return normalizeTrackingPayload(response.data)
}
