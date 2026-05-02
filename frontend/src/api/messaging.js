import api from './axios';

export const getInbox = () => api.get('messaging/inbox/');
export const getConversation = (userId) => api.get(`messaging/conversation/${userId}/`);
export const sendMessage = (receiverId, content) =>
  api.post('messaging/send/', { receiver: receiverId, content });
export const getUnreadCount = () => api.get('messaging/unread/');