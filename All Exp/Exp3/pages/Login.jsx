import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error);

  // State for the password input and selected role
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState('');

  // If already logged in, go to dashboard
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Handle clicking a role button
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setPassword(''); // Clear previous password
  };

  // Handle the actual login submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    // Map the role to hardcoded credentials (safe for demo)
    const credentials = {
      admin: { username: 'admin', password: 'admin123' },
      editor: { username: 'editor', password: 'editor123' },
      viewer: { username: 'viewer', password: 'viewer123' }
    };
    
    // Validate the password entered by user
    if (password === credentials[selectedRole].password) {
      dispatch(loginUser(credentials[selectedRole]));
    } else {
      alert('Incorrect password! Please try again.');
    }
  };

  // Helper to go back to role selection
  const handleBack = () => {
    setSelectedRole(null);
    setPassword('');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: '#f0f4f8'
    }}>
      <div style={{ 
        background: '#fff', 
        padding: '48px', 
        borderRadius: '20px', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)', 
        width: '420px', 
        textAlign: 'center' 
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px', color: '#2d3748' }}>Welcome Back</h2>
        
        {/* Conditional Heading */}
        {!selectedRole ? (
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '32px' }}>
            Select your role to begin
          </p>
        ) : (
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '32px' }}>
            Enter your password for <strong style={{ color: '#2d3748', textTransform: 'capitalize' }}>{selectedRole}</strong>
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ 
            background: '#fed7d7', color: '#c53030', padding: '10px', 
            borderRadius: '8px', marginBottom: '20px', fontSize: '14px' 
          }}>
            {error}
          </div>
        )}

        {/* STAGE 1: Role Selection Buttons */}
        {!selectedRole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button onClick={() => handleRoleSelect('admin')} style={styles.btnAdmin}>
              🔐 Admin Login <span style={styles.subText}>(Full Access)</span>
            </button>
            <button onClick={() => handleRoleSelect('editor')} style={styles.btnEditor}>
              ✏️ Editor Login <span style={styles.subText}>(Edit & Create)</span>
            </button>
            <button onClick={() => handleRoleSelect('viewer')} style={styles.btnViewer}>
              👀 Viewer Login <span style={styles.subText}>(Read Only)</span>
            </button>
          </div>
        )}

        {/* STAGE 2: Password Form */}
        {selectedRole && (
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="password" 
              placeholder="Enter password..." 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{
                padding: '14px', borderRadius: '10px', border: '2px solid #e2e8f0', 
                fontSize: '16px', outline: 'none', transition: 'border 0.2s',
                textAlign: 'center'
              }}
              autoFocus
              required
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={isLoading} style={{
                flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                background: '#4299e1', color: '#fff', boxShadow: '0 4px 6px rgba(66,153,225,0.3)'
              }}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <button type="button" onClick={handleBack} style={{
                padding: '14px 20px', borderRadius: '10px', border: '1px solid #e2e8f0',
                fontSize: '16px', fontWeight: '500', cursor: 'pointer',
                background: '#fff', color: '#4a5568'
              }}>
                Back
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px' }}>
              *Hint: admin123, editor123, or viewer123
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

// Styles object to keep buttons looking clean
const styles = {
  btnAdmin: {
    padding: '16px', borderRadius: '12px', border: 'none', 
    fontSize: '16px', fontWeight: '600', cursor: 'pointer',
    background: '#2b6cb0', color: '#fff',
    boxShadow: '0 4px 6px rgba(43, 108, 176, 0.3)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
  },
  btnEditor: {
    padding: '16px', borderRadius: '12px', border: 'none', 
    fontSize: '16px', fontWeight: '600', cursor: 'pointer',
    background: '#319795', color: '#fff',
    boxShadow: '0 4px 6px rgba(49, 151, 149, 0.3)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
  },
  btnViewer: {
    padding: '16px', borderRadius: '12px', border: 'none', 
    fontSize: '16px', fontWeight: '600', cursor: 'pointer',
    background: '#718096', color: '#fff',
    boxShadow: '0 4px 6px rgba(113, 128, 150, 0.3)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
  },
  subText: { fontSize: '12px', fontWeight: 'normal', opacity: 0.8 }
};

export default Login;