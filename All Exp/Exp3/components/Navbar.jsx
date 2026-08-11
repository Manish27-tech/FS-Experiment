import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>📝 Blog Manager</h2>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ background: '#ebf8ff', padding: '4px 12px', borderRadius: '12px' }}>Role: <b>{user?.role}</b></span>
        <span>Welcome, {user?.username}!</span>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px' }}>Logout</button>
      </div>
    </div>
  );
};
export default Navbar;