import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useAxios from '@/hooks/useAxios';
import { useMusicStore } from '@/stores/useMusicStore';
import { Plus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface NewSong {
  title: string;
  artist: string;
  album: string;
  duration: string;
}

const AddSongDialog = () => {
  const { albums } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState<NewSong>({
    title: '',
    artist: '',
    album: '',
    duration: '0',
  });

  const [files, setFiles] = useState<{
    audio: File | null;
    image: File | null;
  }>({
    audio: null,
    image: null,
  });

  const audioRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!files.audio || !files.image) {
        return toast.error('Please select both audio and image files.');
      }
      const formData = new FormData();

      formData.append('title', newSong.title);
      formData.append('artist', newSong.artist);
      formData.append('duration', newSong.duration);

      if (newSong.album && newSong.album !== 'none') {
        formData.append('album', newSong.album);
      }
      formData.append('audioFile', files.audio);
      formData.append('imageFile', files.image);

      await useAxios.post('/admin/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Song added successfully!');
      setSongDialogOpen(false);
      setNewSong({ title: '', artist: '', album: '', duration: '0' });
      setFiles({ audio: null, image: null });
    } catch (error) {
      const axiosError = error as { response: { data: { message: string } } };
      toast.error(axiosError.response.data.message);
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
          <Plus className='mr-2 h-4 w-4' />
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Hidden Inputs */}
          <input
            type='file'
            accept='audio/*'
            ref={audioRef}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFiles((prev) => ({ ...prev, audio: file }));
            }}
            hidden
          />
          <input
            type='file'
            accept='image/*'
            ref={imageRef}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFiles((prev) => ({ ...prev, image: file }));
            }}
            hidden
          />

          {/* Image Upload UI */}
          <div
            className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
            onClick={() => {
              imageRef.current?.click();
            }}
          >
            <div className='text-center'>
              {files.image ? (
                <div className='space-y-2'>
                  <div className='text-sm text-emerald-500'>
                    Image Selected:
                  </div>
                  <div className='text-xs text-zinc-400'>
                    {files.image.name.slice(0, 20)}
                  </div>
                </div>
              ) : (
                <>
                  <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                    <Upload className='h-6 w-6 text-zinc-400' />
                  </div>
                  <div className='text-sm text-zinc-400 mb-2'>
                    Upload artwork
                  </div>
                  <Button variant='outline' size='sm' className='text-xs'>
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Audio Upload UI */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Audio File</label>
            <div className='flex items-center gap-2'>
              <Button
                onClick={() => audioRef.current?.click()}
                variant='outline'
                className='w-full'
              >
                {files.audio ? files.audio.name.slice(0, 20) : 'Upload Audio'}
              </Button>
            </div>
          </div>

          {/* Title Field */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Title</label>
            <Input
              value={newSong.title}
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          {/* Artist Field */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Artist</label>
            <Input
              value={newSong.artist}
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          {/* Duration Field */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Duration (seconds)</label>
            <Input
              value={newSong.duration}
              onChange={(e) =>
                setNewSong({ ...newSong, duration: e.target.value || '0' })
              }
              type='number'
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          {/* Album Select Field */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Album (Optional)</label>
            <Select
              value={newSong.album}
              onValueChange={(value) =>
                setNewSong({ ...newSong, album: value })
              }
            >
              <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                <SelectValue placeholder='Select album' />
              </SelectTrigger>
              <SelectContent className='bg-zinc-800 border-zinc-700'>
                <SelectItem value='none'>No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => setSongDialogOpen(false)}
            disabled={isLoading}
            variant='outline'
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'uploading...' : 'Add Song'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;
