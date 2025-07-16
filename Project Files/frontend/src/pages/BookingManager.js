import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings/owner', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBookings(res.data);
      } catch (err) {
        alert('Failed to load bookings');
      }
    };
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/bookings/update/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h3>Booking Requests</h3>
      {bookings.length === 0 ? <p>No bookings yet</p> : (
        <ul>
          {bookings.map((b) => (
            <li key={b._id} style={{ marginBottom: 15, borderBottom: '1px solid #ccc' }}>
              <p><strong>Property:</strong> {b.propertyId?.type} at {b.propertyId?.address}</p>
              <p><strong>Renter:</strong> {b.userId?.name} ({b.userId?.email})</p>
              <p><strong>Message:</strong> {b.message}</p>
              <p><strong>Status:</strong> {b.status}</p>
              {b.status === 'pending' && (
                <>
                  <button onClick={() => handleStatusUpdate(b._id, 'confirmed')}>Confirm</button>{' '}
                  <button onClick={() => handleStatusUpdate(b._id, 'rejected')}>Reject</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
