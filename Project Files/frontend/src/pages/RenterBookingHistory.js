import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function RenterBookingHistory() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch booking details');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="container">
      <h2>My Booking History</h2>

      {bookings.length === 0 ? (
        <p>No bookings made yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li
              key={booking._id}
              style={{
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
            >
              <p><strong>Property:</strong> {booking.property?.type} - {booking.property?.address}</p>
              <p><strong>Amount:</strong> ₹{booking.property?.amount}</p>
              <p><strong>Message:</strong> {booking.message}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Owner:</strong> {booking.ownerId?.name} ({booking.ownerId?.email})</p>
              <p><em>Booked on:</em> {new Date(booking.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
