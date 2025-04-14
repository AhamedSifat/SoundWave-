import { create } from 'zustand';
import useAxios from '@/hooks/useAxios';
import { Song, Album } from '@/types';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface Albumbyid {
  imageUrl: string;
  title: string;
  artist: string;
  songs: {
    _id: string;
    imageUrl: string;
    title: string;
    artist: string;
    duration: number;
    createdAt: string;
  }[];
  releaseYear: string;
}

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Albumbyid | null;
  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  featuredSongs: Song[];
  fetchFeaturedSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  stats: {
    totalSongs: number;
    totalAlbums: number;
    totalUsers: number;
    totalArtists: number;
  };

  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  trendingSongs: [],
  featuredSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await useAxios.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success('Song deleted successfully');
    } catch (err) {
      toast.error('Error deleting song');
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await useAxios.delete(`/admin/albums/${id}`);

      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.filter((song) => song.albumId?.toString() !== id),
      }));

      toast.success('Album and its songs deleted successfully');
    } catch (err) {
      toast.error('Error deleting album and its songs');
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get('/stats');
      set({ stats: response.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get('/songs');
      set({ songs: response.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get('/albums');
      set({ albums: response.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get('/songs/featured');
      set({ featuredSongs: response.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get('/songs/trending');
      set({ trendingSongs: response.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await useAxios.get('/songs/made-for-you');
      set({ madeForYouSongs: response.data });
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
