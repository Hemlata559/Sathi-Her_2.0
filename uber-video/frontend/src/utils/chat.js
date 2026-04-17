import axios from 'axios'
import API_BASE_URL from './api'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

const getUserName = (user) => {
  if (!user) return 'Unknown user'

  const first = user.fullName?.firstName || user.fullname?.firstname || user.firstname || ''
  const last = user.fullName?.lastName || user.fullname?.lastname || user.lastname || ''

  return `${first} ${last}`.trim() || user.email || 'Unknown user'
}

export const normalizeConversation = (conversation) => ({
  id: conversation?._id || conversation?.id,
  rideId: conversation?.ride?._id || conversation?.ride,
  participants: (conversation?.participants || []).map((participant) => ({
    id: participant?._id || participant?.id,
    name: getUserName(participant),
    image: participant?.profileImageUrl || 'https://i.pravatar.cc/100?img=32'
  })),
  lastMessageAt: conversation?.lastMessageAt,
  lastMessagePreview: conversation?.lastMessagePreview || '',
  raw: conversation
})

export const normalizeChatMessage = (message) => ({
  id: message?._id || message?.id,
  conversationId: message?.conversation?._id || message?.conversation,
  senderId: message?.sender?._id || message?.sender,
  senderName: getUserName(message?.sender),
  receiverId: message?.receiver?._id || message?.receiver,
  receiverName: getUserName(message?.receiver),
  text: message?.text || '',
  status: message?.status || 'sent',
  createdAt: message?.createdAt,
  raw: message
})

export const getOrCreateConversation = async ({ rideId, otherUserId }) => {
  const response = await axios.post(
    `${API_BASE_URL}/chat/conversations`,
    { rideId, otherUserId },
    { headers: getAuthHeaders() }
  )

  return normalizeConversation(response.data)
}

export const fetchConversationMessages = async (conversationId) => {
  const response = await axios.get(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
    headers: getAuthHeaders()
  })

  return response.data.map(normalizeChatMessage)
}

export const sendConversationMessage = async ({ conversationId, text }) => {
  const response = await axios.post(
    `${API_BASE_URL}/chat/messages`,
    { conversationId, text },
    { headers: getAuthHeaders() }
  )

  return normalizeChatMessage(response.data)
}

export const markConversationAsRead = async (conversationId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/chat/conversations/${conversationId}/read`,
    {},
    { headers: getAuthHeaders() }
  )

  return response.data
}
