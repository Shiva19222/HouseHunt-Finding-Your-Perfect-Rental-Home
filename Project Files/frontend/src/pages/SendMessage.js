import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function SendMessagePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const { ownerId, propertyId, ownerName } = location.state || {};

  if (!ownerId || !propertyId) {
    return <div>Invalid message details.</div>;
  }

  const handleSend = async () => {
    try {
      await API.post(
        '/messages/send',
        {
          ownerId,
          propertyId,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Message sent!');
      navigate('/renter');
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    }
  };

  return (
    <div className="container">
      <h3>Send Message to {ownerName || 'Owner'}</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder="Write your message..."
        style={{ width: '100%', marginBottom: 10 }}
      />
      <br />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
