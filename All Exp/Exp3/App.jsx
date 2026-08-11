import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreLogin, selectUser } from './features/auth/authSlice';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ToastMessage from './components/ToastMessage';

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const token = localStorage.getItem('token');
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[0]));
        dispatch(restoreLogin({ user: { id: payload.userId, username: payload.username, role: payload.role }, token }));
      } catch (e) { localStorage.removeItem('token'); }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastMessage />
    </BrowserRouter>
  );
}
export default App;