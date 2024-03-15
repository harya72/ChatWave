import React, { useState } from 'react';
import axios from 'axios';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/users/reset_password/', { email });
      setMessage('Password reset email sent');
    } catch (err) {
      setError('Failed to reset password');
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ForgetPassword;
