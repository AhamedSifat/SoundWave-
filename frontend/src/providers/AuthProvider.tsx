import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import useAxios from '@/hooks/useAxios';
import { Loader } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import useChatStore from '@/stores/useChatStore';

const updateApiToken = (token: string | null) => {
  if (token) {
    useAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete useAxios.defaults.headers.common['Authorization'];
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();

        updateApiToken(token);
        if (token) {
          await checkAdminStatus();
          if (user) {
            initSocket(user.id);
          } else {
            console.error('User ID is null or undefined');
          }
        }
      } catch (error) {
        updateApiToken(null);
        console.log('error in auth provider', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      disconnectSocket();
    };
  }, [checkAdminStatus, getToken, userId, initSocket, disconnectSocket]);

  if (loading) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <Loader className='size-8 text-emerald-500 animate-spin' />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthProvider;
