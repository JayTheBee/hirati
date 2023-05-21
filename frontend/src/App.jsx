import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import PrivateRoutes from './components/PrivateRoutes';
import Auth from './pages/Auth';
import Reset from './pages/Reset';
import Register from './pages/RegisterPage';
import EditProfile from './pages/EditProfile';
import Class from './pages/Class';
import Task from './pages/Task';
import Question from './pages/Question';
import Playground from './pages/Playground';
import EmailVerify from './components/auth/EmailVerification';
import Editor from './pages/Editor';
import CodeEditor from './components/editor jb/Main';
import Scoring from './pages/Score';

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
          <Route path="/" element={<Class />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/class/:id" element={<Task />} />
          <Route path="/class/:id/task" element={<Question />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/score/:id" element={<Scoring />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editor" exact element={<Editor />} />
        <Route path="/auth/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/dummy-editor" exact element={<CodeEditor />} />
      </Routes>
    </>
  );
}

export default App;
