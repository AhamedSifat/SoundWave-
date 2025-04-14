import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import MainLayout from './layout/MainLayout';
import AlbumPage from './pages/AlbumPage';
import AdminPage from './pages/admin/AdminPage';
import { Toaster } from 'react-hot-toast';
import ChatPage from './pages/chat/ChatPage';
import NotFoundPage from './pages/404/NotFoundPage';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/auth-callback' element={<AuthCallbackPage />} />
        <Route path='admin' element={<AdminPage />} />
        <Route
          path='/sso-callback'
          element={
            <AuthenticateWithRedirectCallback
              signUpFallbackRedirectUrl={'/auth-callback'}
            />
          }
        />
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/albums/:albumId' element={<AlbumPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster position='top-center' reverseOrder={false} />
    </div>
  );
};

export default App;
