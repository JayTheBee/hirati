import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import PrivateRoutes from './components/PrivateRoutes';
import Auth from './pages/Auth';
import Register from './pages/RegisterPage';
import EditProfile from './pages/EditProfile';
import Home from './pages/Home';
import Task from './pages/Task';
import EmailVerify from './components/auth/EmailVerification';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '1.8rem',
          },
        }}
      />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/class/:id" element={<Task />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/:id/verify/:token" element={<EmailVerify />} />
      </Routes>
    </>
  );
}

export default App;
