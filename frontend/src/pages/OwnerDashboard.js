// src/pages/OwnerDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('userName') || 'Owner';

  const buttonStyle = {
    padding: '15px 30px',
    fontSize: '16px',
    margin: '10px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px'
  };

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome, {name}!</h2>
      <p>Manage your properties and connect with renters</p>

      <div style={{ marginTop: '30px' }}>
        <button onClick={() => navigate('/owner/property')} style={buttonStyle}>
          🏠 Enter Property Details
        </button>
        <button onClick={() => navigate('/owner/inbox')} style={buttonStyle}>
          💬 Message Box
        </button>
        <button onClick={() => navigate('/owner/bookings')} style={buttonStyle}>
          📩 Booking Requests
        </button>
      </div>
    </div>
  );
}
