// src/components/ToastMessage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast, selectToast } from '../features/ui/uiSlice';

const ToastMessage = () => {
  const toast = useSelector(selectToast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toast) {
      // Automatically remove toast after 3 seconds
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
      padding: '12px 24px', borderRadius: '8px', color: '#fff',
      backgroundColor: toast.type === 'success' ? '#48bb78' : '#f56565', // Green for success, Red for error
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontWeight: 'bold',
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      {toast.message}
    </div>
  );
};

export default ToastMessage;