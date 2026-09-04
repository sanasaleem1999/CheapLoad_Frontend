import { io } from 'socket.io-client';
import { SOCKET_URL } from '../Constants/URL';

// Single shared client for the app
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export const connectSocket = () => {
  if (socket.connected) return socket;
  console.log('connected socket', socket.id);
  // Attach token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) socket.auth = { token };
  }

  socket.connect();
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const emitSocketEvent = (event, payload, callback) => {
  if (socket.connected) {
    socket.emit(event, payload, callback);
  }
};

export const sendMessage = (toUserId, text, postId,conversationId) => {
  emitSocketEvent('message:send', { toUserId, text, postId, conversationId });
}
export const startChat = (toUserId,postId=null) => {
  emitSocketEvent('chat:start', { otherUserId:toUserId, postId });
}
export const joinRoom = (conversationId) => {
  emitSocketEvent('conversation:join', { conversationId });
}

