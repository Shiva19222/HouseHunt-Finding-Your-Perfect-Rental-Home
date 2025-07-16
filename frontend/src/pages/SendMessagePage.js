import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function SendMessagePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ownerId, propertyId, ownerName } = location.state || {};
  const [content, setContent] = useState('');

  const handleSend = async () => {
    try {
      await API.post('/messages/send', {
        ownerId,
        propertyId,
        content,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert('Message sent successfully!');
      navigate('/renter'); // Redirect back after sending
    } catch (err) {
      console.error(err);
      alert('Failed to send message.');
    }
  };

  if (!ownerId || !propertyId) {
    return <p>Invalid message details.</p>;
  }

  return (
    <div className="container">
      <h3>Send Message to {ownerName}</h3>
      <textarea
        rows={4}
        style={{ width: '100%' }}
        placeholder="Write your message here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
