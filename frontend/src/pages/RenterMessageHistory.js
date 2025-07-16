// src/pages/RenterMessageHistory.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function RenterMessageHistory() {
  const { propertyId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await API.get(`/messages/thread/${propertyId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load message history');
      }
    };

    fetchThread();
  }, [propertyId]);

  return (
    <div className="container">
      <h3>Message History with Owner</h3>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <p><strong>You:</strong> {msg.content}</p>
              <p><em>Sent at:</em> {new Date(msg.createdAt).toLocaleString()}</p>
              {msg.reply && (
                <>
                  <p><strong>Owner's Reply:</strong> {msg.reply}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
