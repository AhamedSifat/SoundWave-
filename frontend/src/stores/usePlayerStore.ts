import { create } from 'zustand';
import { Song } from '@/types';
import useChatStore from './useChatStore';

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex?: number) => {
    if (songs.length === 0) return;
    const song = songs[startIndex ?? 0];

    const socket = useChatStore.getState().socket as {
      emit(
        arg0: string,
        arg1: { userId: string | undefined; activity: string }
      ): unknown;
      auth?: { userId?: string };
    };
    if (socket && socket.auth) {
      socket.emit('update_activity', {
        userId: socket?.auth?.userId,
        activity: `playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;
    const songIndex = get().queue.findIndex((s) => s._id === song._id);

    const socket = useChatStore.getState().socket;
    if (socket && socket.auth) {
      socket.emit('update_activity', {
        userId: socket?.auth?.userId,
        activity: `playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      currentSong: song,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      isPlaying: true,
    });
  },

  togglePlay: () => {
    const currentSong = get().currentSong;
    if (!currentSong) return;
    const socket = useChatStore.getState().socket;
    if (socket && socket.auth) {
      socket.emit('update_activity', {
        userId: socket?.auth?.userId,
        activity:
          !get().isPlaying && currentSong
            ? `playing ${currentSong.title} by ${currentSong.artist}`
            : 'Idle',
      });
    }
    set({
      isPlaying: !get().isPlaying,
    });
  },

  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      const socket = useChatStore.getState().socket;
      if (socket && socket.auth) {
        socket.emit('update_activity', {
          userId: socket?.auth?.userId,
          activity: `playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      const socket = useChatStore.getState().socket;
      if (socket && socket.auth) {
        socket.emit('update_activity', {
          userId: socket?.auth?.userId,
          activity: 'Idle',
        });
      }
      set({
        isPlaying: false,
      });
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      const socket = useChatStore.getState().socket;
      if (socket && socket.auth) {
        socket.emit('update_activity', {
          userId: socket?.auth?.userId,
          activity: `playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      const socket = useChatStore.getState().socket;
      if (socket && socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: 'Idle',
        });
      }
      set({
        isPlaying: false,
      });
    }
  },
}));
