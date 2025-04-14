import { create } from 'zustand';
import { User, Message } from '@/types';
import useAxios from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';

interface chatStore {
  users: User[];
  fetchUsers: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivites: Map<string, string>;
  messages: Message[];
  initSocket: (userId: string) => void;

  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  selectedUser: User | null;
}

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';
const socket: Socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

const useChatStore = create<chatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivites: new Map(),
  selectedUser: null,
  messages: [],

  setSelectedUser: (user) => set({ selectedUser: user }),

  initSocket: (userId: string) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();
      socket.emit('user_connected', userId);
      socket.on('user_online', (users: string[]) => {
        console.log(users);
        set({ onlineUsers: new Set(users) });
      });

      socket.on('user_activities', (activities: [string, string][]) => {
        set({ userActivites: new Map(activities) });
      });

      socket.on('user_connected', (userId: string) => {
        set({ onlineUsers: new Set([...get().onlineUsers, userId]) });
      });

      socket.on('user_disconnected', (userId: string) => {
        set((state) => {
          const updatedOnlineUsers = new Set(state.onlineUsers);
          updatedOnlineUsers.delete(userId);
          return { onlineUsers: updatedOnlineUsers };
        });
      });

      socket.on('receive_message', (message: Message) => {
        set((state) => ({ messages: [...state.messages, message] }));
      });

      socket.on('message_sent', (message: Message) => {
        set((state) => ({ messages: [...state.messages, message] }));
      });

      socket.on('activity_updated', ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivites);
          newActivities.set(userId, activity);
          return { userActivites: newActivities };
        });
      });

      set({ isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },

  sendMessage: async (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit('send_message', { receiverId, senderId, content });
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get('/users');
      set({ users: response.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useChatStore;
