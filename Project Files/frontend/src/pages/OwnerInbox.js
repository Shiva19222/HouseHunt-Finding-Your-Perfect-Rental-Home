import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function OwnerInbox() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/messages/inbox', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(res.data);
      } catch {
        alert('Failed to load messages');
      }
    };
    fetch();
  }, []);

  const handleReply = async (id, reply) => {
    try {
      await API.post(`/messages/reply/${id}`, { reply }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Reply sent');
    } catch {
      alert('Failed to reply');
    }
  };

  return (
    <div className="container">
      <h3>Inbox</h3>
      {messages.length === 0 ? <p>No messages</p> :
        messages.map(msg => (
          <div key={msg._id} style={{ marginBottom: 20 }}>
            <p><strong>From:</strong> {msg.sender.name} ({msg.sender.email})</p>
            <p><strong>Property:</strong> {msg.property?.type} at {msg.property?.address}</p>
            <p><strong>Message:</strong> {msg.content}</p>
            {msg.reply ? <p><strong>Your Reply:</strong> {msg.reply}</p> : (
              <>
                <textarea
                  rows={2}
                  onChange={(e) => msg.reply = e.target.value}
                  style={{ width: '100%' }}
                /><br />
                <button onClick={() => handleReply(msg._id, msg.reply)}>Reply</button>
              </>
            )}
            <hr />
          </div>
        ))}
    </div>
  );
}
