import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function OwnerBookingRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/bookings/owner', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to fetch booking requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await API.patch(`/bookings/update/${id}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert(`✅ Booking ${newStatus}`);
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update booking status');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h2>📩 Booking Requests</h2>
      {requests.length === 0 ? (
        <p>No booking requests found.</p>
      ) : (
        requests.map((r) => (
          <div
            key={r._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <p><strong>🏠 Property:</strong> {r.property?.type} - {r.property?.address}</p>
            <p><strong>👤 Renter:</strong> {r.userId?.name} ({r.userId?.email})</p>
            <p><strong>📝 Note:</strong> {r.note || 'No message provided'}</p>
            <p><strong>📅 Requested on:</strong> {new Date(r.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <span style={{ color: r.status === 'Pending' ? 'orange' : r.status === 'Approved' ? 'green' : 'red' }}>{r.status}</span></p>

            {r.status === 'Pending' && (
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => updateStatus(r._id, 'Approved')}
                  style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none' }}
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => updateStatus(r._id, 'Rejected')}
                  style={{ backgroundColor: 'red', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none' }}
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
