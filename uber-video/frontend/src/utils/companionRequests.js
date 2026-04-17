import axios from 'axios'
import API_BASE_URL from './api'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

const getDisplayName = (user) => {
  if (!user) return 'Unknown user'

  const first =
    user.fullName?.firstName ||
    user.fullname?.firstname ||
    user.firstname ||
    ''
  const last =
    user.fullName?.lastName ||
    user.fullname?.lastname ||
    user.lastname ||
    ''

  return `${first} ${last}`.trim() || user.email || 'Unknown user'
}

export const normalizeCompanionRequest = (request) => {
  const sender = request?.sender || request?.requester || null
  const receiver = request?.receiver || null
  const ride = request?.ride || {}

  return {
    id: request?._id || request?.id,
    requesterName: getDisplayName(sender),
    requesterImage: sender?.profileImageUrl || request?.requesterImage || 'https://i.pravatar.cc/100?img=32',
    receiverName: getDisplayName(receiver),
    receiverImage: receiver?.profileImageUrl || 'https://i.pravatar.cc/100?img=48',
    pickup: ride?.pickup || request?.pickup || 'Pickup not shared',
    destination: ride?.destination || request?.destination || 'Destination not shared',
    schedule: ride?.scheduleLabel || request?.schedule || 'Flexible timing',
    journeyScheduled: ride?.status ? ['scheduled', 'matched', 'verified', 'in_progress'].includes(ride.status) : true,
    message: request?.message || 'Would you like to be my companion for this ride?',
    rating: sender?.stats?.averageRating || request?.rating || 4.5,
    verified: sender?.isVerified ?? request?.verified ?? true,
    status: request?.status || 'pending',
    createdAt: request?.createdAt,
    rideId: ride?._id || request?.rideId,
    raw: request
  }
}

export const createCompanionRequest = async ({ rideId, receiverId, message }) => {
  const response = await axios.post(
    `${API_BASE_URL}/companion-requests`,
    {
      rideId,
      receiverId,
      message
    },
    { headers: getAuthHeaders() }
  )

  return normalizeCompanionRequest(response.data)
}

export const fetchIncomingCompanionRequests = async () => {
  const response = await axios.get(`${API_BASE_URL}/companion-requests/incoming`, {
    headers: getAuthHeaders()
  })

  return response.data.map(normalizeCompanionRequest)
}

export const fetchOutgoingCompanionRequests = async () => {
  const response = await axios.get(`${API_BASE_URL}/companion-requests/outgoing`, {
    headers: getAuthHeaders()
  })

  return response.data.map(normalizeCompanionRequest)
}

export const acceptCompanionRequest = async (requestId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/companion-requests/${requestId}/accept`,
    {},
    { headers: getAuthHeaders() }
  )

  return normalizeCompanionRequest(response.data)
}

export const declineCompanionRequest = async (requestId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/companion-requests/${requestId}/decline`,
    {},
    { headers: getAuthHeaders() }
  )

  return normalizeCompanionRequest(response.data)
}

export const cancelCompanionRequest = async (requestId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/companion-requests/${requestId}/cancel`,
    {},
    { headers: getAuthHeaders() }
  )

  return normalizeCompanionRequest(response.data)
}
