import axios from 'axios'
import API_BASE_URL from './api'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

export const normalizeCompanion = (companion) => {
  const first =
    companion?.fullName?.firstName ||
    companion?.fullname?.firstname ||
    ''
  const last =
    companion?.fullName?.lastName ||
    companion?.fullname?.lastname ||
    ''

  const displayName = `${first} ${last}`.trim() || 'Verified Companion'
  const averageRating = companion?.stats?.averageRating || 4.5

  return {
    id: companion?._id,
    name: displayName,
    type: companion?.collegeName || 'Travel Companion',
    verified: companion?.isVerified ?? true,
    rating: averageRating > 0 ? Number(averageRating.toFixed(1)) : 4.5,
    icon: 'ri-team-fill',
    color: 'text-pink-500',
    image: companion?.profileImageUrl || 'https://i.pravatar.cc/160?img=32',
    raw: companion
  }
}

export const fetchAvailableCompanions = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/companions`, {
    headers: getAuthHeaders()
  })

  return response.data.map(normalizeCompanion)
}
