import { cn } from '@/lib/utils';
import { HomeIcon, Library, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from './ui/button';
import { SignedIn } from '@clerk/clerk-react';
import { ScrollArea } from './ui/scroll-area';
import PlaylistSkeleton from './skeletons/PlaylistSkeleton';
import { useMusicStore } from '@/stores/useMusicStore.js';
import { useEffect } from 'react';

const LeftSideBar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className='flex flex-col h-full gap-2'>
      <div className='rounded-lg bg-zinc-900 p-4'>
        <div className='space-y-2 '>
          <Link
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'w-full justify-start text-white hover:bg-zinc-800',
              })
            )}
            to={'/rr'}
          >
            <HomeIcon className='mr-2 size-5' />
            <span className='hidden md:inline'>Home</span>
          </Link>

          <SignedIn>
            <Link
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className:
                    'w-full justify-start text-white hover:bg-zinc-800',
                })
              )}
              to={'/'}
            >
              <MessageCircle className='mr-2 size-5' />
              <span className='hidden md:inline'>Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>
      <div className='rounded-lg bg-zinc-900 p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center text-white px-2'>
            <Library className='size-5 mr-2' />
            <span className='hidden md:inline'>Playlists</span>
          </div>
        </div>
        <ScrollArea className=' h-[calc(100vh-300px)]'>
          <div className='space-y-2'>
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums?.map((album) => (
                <Link
                  key={album._id}
                  to={`/albums/${album._id}`}
                  className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
                >
                  <img
                    src={album?.imageUrl}
                    className='size-12 rounded-md flex-shrink-0 object-cover'
                  />
                  <div className='flex-1 min-w-0 hidden md:block'>
                    <p className='font-medium truncate'>{album.title}</p>
                    <p className='text-sm text-zinc-400 truncate '>
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSideBar;
