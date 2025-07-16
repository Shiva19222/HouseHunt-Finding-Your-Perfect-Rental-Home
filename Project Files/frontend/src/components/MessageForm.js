// src/components/MessageForm.js
import React, { useState } from 'react';
import API from '../services/api';

export default function MessageForm({ ownerId }) {
  const [message, setMessage] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await API.post('/messages/send', {
        receiver: ownerId,
        text: message,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      alert('Message sent!');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSend}>
      <textarea
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      /><br />
      <button type="submit">Send Message</button>
    </form>
  );
}
