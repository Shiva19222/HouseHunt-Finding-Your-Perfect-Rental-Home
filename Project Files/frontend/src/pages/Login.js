import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      console.log('Login response:', res.data); // ADD THIS
      localStorage.setItem('userType', res.data.user.type.toLowerCase());
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      console.log(res.data.user)
      navigate('/dashboard');
      console.log('Navigating to dashboard...');
    } catch (err) {
      alert('Login failed. Wrong credentials');
    }
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          /><br />
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          /><br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
