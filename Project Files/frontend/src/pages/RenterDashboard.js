import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function RenterDashboard() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [message, setMessage] = useState('');
  const [bookingNote, setBookingNote] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await API.get('/properties/all');
        setProperties(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load properties');
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = filter
    ? properties.filter((p) => p.adType === filter)
    : properties;

  const handleSendMessage = async () => {
    if (!message.trim()) return alert("Message cannot be empty");
    try {
      await API.post('/messages/send', {
        propertyId: selectedProperty._id,
        content: message,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert("Message sent");
      setMessage('');
      setSelectedProperty(null);
    } catch (err) {
      alert("Failed to send message");
    }
  };

 const handleBooking = async () => {
  if (!bookingNote.trim()) {
    alert("Please enter a booking message.");
    return;
  }

  try {
    const res = await API.post('/bookings/book', {
      propertyId: selectedProperty._id,
      message: bookingNote,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    alert(res.data.message || 'Booking successful');
    setBookingNote('');
    setSelectedProperty(null);
  } catch (err) {
    console.error('Booking error:', err.response?.data || err.message);
    alert("Booking failed");
  }
};

  return (
    <div className="renter-container">
      <h2>Hello {localStorage.getItem('userName')}</h2>

      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setFilter('Rent')}>🏠 For Rent</button>
        <button onClick={() => setFilter('Sale')}>🏡 On Sale</button>
      </div>

      {selectedProperty && (
        <div style={{ border: '2px solid #333', padding: 20, marginBottom: 20 }}>
          <h3>{selectedProperty.type} - ₹{selectedProperty.amount}</h3>
          <p><strong>Address:</strong> {selectedProperty.address}</p>
          <p><strong>Description:</strong> {selectedProperty.info}</p>
          <p><strong>Owner:</strong> {selectedProperty.owner?.name}</p>

          {/* Messaging */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message to the owner"
            rows={2}
            style={{ width: '100%', marginBottom: '10px' }}
          /><br />
          <button onClick={handleSendMessage}>Send Message</button>{' '}
          <button onClick={() => navigate(`/messages/history/${selectedProperty._id}`)}>View Message History</button>

          {/* Booking */}
          <hr />
          <textarea
            value={bookingNote}
            onChange={(e) => setBookingNote(e.target.value)}
            placeholder="Write booking note or request"
            rows={2}
            style={{ width: '100%' }}
          /><br />
          <button onClick={handleBooking}>Book this Property</button>{' '}
          <button onClick={() => setSelectedProperty(null)}>Close</button>
        </div>
      )}
<button onClick={() => navigate('/bookings/my')}>
  📖 View My Bookings
</button>


      <div>
        {filteredProperties.map((prop) => (
          <div
            key={prop._id}
            style={{
              border: '1px solid #ccc',
              padding: 15,
              marginBottom: 10,
              cursor: 'pointer',
            }}
            onClick={() => setSelectedProperty(prop)}
         
          >
            <h4>{prop.type} - ₹{prop.amount}</h4>
            <p>{prop.address}</p>
            {prop.image && (
              <img
                src={`http://localhost:5000${prop.image}`}
                alt="Property"
                width="200"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
