// frontend/src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [owners, setOwners] = useState([]);

  const fetchPendingOwners = async () => {
    try {
      const res = await API.get('/admin/pending-owners', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOwners(res.data);
    } catch (err) {
      alert('Failed to load pending owners');
    }
  };

  const approveOwner = async (id) => {
    try {
      await API.put(`/admin/approve-owner/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Owner approved!');
      fetchPendingOwners(); // reload list
    } catch (err) {
      alert('Failed to approve');
    }
  };

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <h4>Pending Owner Requests</h4>
      {owners.length === 0 ? (
        <p>No pending owners</p>
      ) : (
        <ul>
          {owners.map(owner => (
            <li key={owner._id}>
              <p><strong>{owner.name}</strong> - {owner.email}</p>
              <button onClick={() => approveOwner(owner._id)}>✅ Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
