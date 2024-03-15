// PasswordResetPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PasswordResetPage() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/users/reset_password_confirm/', { uid, token, new_password: password });
      setSuccess(true);
        navigate('/')
    } catch (err) {
      setError('Password reset failed');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      {success ? (
        <p>Password reset successfully</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default PasswordResetPage;
