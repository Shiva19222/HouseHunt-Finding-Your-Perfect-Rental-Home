import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
  name: '',
  email: '',
  password: '',
  role: 'Renter' // or 'Owner' as needed
});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          /><br />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          /><br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          /><br />
          <input
  name="contact"
  placeholder="Contact Number"
  value={form.contact}
  onChange={handleChange}
  required
/>

          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="renter">Renter</option>
            <option value="owner">Owner</option>
          </select><br />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
