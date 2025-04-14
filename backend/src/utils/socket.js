import { Server } from 'socket.io';
import Message from '../models/message.model.js';

export const initializeSocket = (httpserver) => {
  const io = new Server(httpserver, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  const userSocket = new Map(); // Store user sockets
  const userActivites = new Map(); // Store user activities

  io.on('connection', (socket) => {
    socket.on('user_connected', (userId) => {
      userSocket.set(userId, socket.id); // Store the socket ID for the user
      userActivites.set(socket.id, 'Idle');

      //broadcast to all connected users that a new user has connected
      io.emit('user_connected', userId);

      socket.emit('user_online', Array.from(userSocket.keys())); // Send the list of online users to the newly connected user
      io.emit('activites', Array.from(userActivites.entries())); // Send the list of user activities to all clients
    });

    socket.on('update_activity', ({ userId, activity }) => {
      userActivites.set(userId, activity); // Update the user's activity
      io.emit('activity_updated', { userId, activity });
    });

    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content,
        });

        // Send the message to the receiver
        const receiverSocketId = userSocket.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', message);
        }

        // Send the message to the sender
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      // Remove the user from the userSocket map
      userSocket.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          userSocket.delete(userId);
          userActivites.delete(socket.id); // Remove the user's activity
          io.emit('user_disconnected', userId); // Notify all clients about the disconnection
        }
      });
    });
  });
};
