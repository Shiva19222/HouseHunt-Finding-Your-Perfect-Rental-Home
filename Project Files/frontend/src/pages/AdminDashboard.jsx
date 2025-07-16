import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [owners, setOwners] = useState([]);

  const fetchPendingOwners = async () => {
    try {
      const res = await API.get('/admin/pending-owners', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOwners(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load pending owners');
    }
  };

  const handleApproval = async (ownerId, approved) => {
    try {
      await API.put(`/admin/approve-owner/${ownerId}`, { approved }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(`Owner ${approved ? 'approved' : 'rejected'}`);
      fetchPendingOwners(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <h4>Pending Owner Approvals</h4>
      {owners.length === 0 ? (
        <p>No pending owner requests.</p>
      ) : (
        <ul>
          {owners.map((owner) => (
            <li key={owner._id}>
              <strong>{owner.name}</strong> - {owner.email}
              <br />
              <button onClick={() => handleApproval(owner._id, true)}>✅ Approve</button>{' '}
              <button onClick={() => handleApproval(owner._id, false)}>❌ Reject</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
