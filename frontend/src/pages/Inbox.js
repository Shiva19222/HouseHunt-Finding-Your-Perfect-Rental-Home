// src/pages/Inbox.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      const res = await API.get('/messages/inbox', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load inbox');
    }
  };

  const openThread = async (msg) => {
    try {
      const res = await API.get(`/messages/thread/${msg.property._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSelectedThread({
        thread: res.data,
        property: msg.property,
        renter: msg.sender,
      });
    } catch (err) {
      alert('Failed to load thread');
    }
  };

  const handleReply = async () => {
    try {
      await API.post(
        '/messages/send',
        {
          propertyId: selectedThread.property._id,
          content: replyText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setReplyText('');
      openThread({ property: selectedThread.property, sender: selectedThread.renter });
    } catch (err) {
      alert('Failed to send reply');
    }
  };

  return (
    <div className="container">
      <h3>📨 Message Inbox</h3>

      {selectedThread ? (
        <>
          <h4>Chat with {selectedThread.renter.name}</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            {selectedThread.thread.map((msg) => (
              <div
                key={msg._id}
                style={{
                  textAlign: msg.sender._id === selectedThread.renter._id ? 'left' : 'right',
                  marginBottom: '10px',
                }}
              >
                <b>{msg.sender.name}:</b> {msg.content}
                <br />
                <small>{new Date(msg.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
          <textarea
            rows="3"
            placeholder="Reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{ width: '100%', marginTop: 10 }}
          />
          <br />
          <button onClick={handleReply}>Send Reply</button>{' '}
          <button onClick={() => setSelectedThread(null)}>Close</button>
        </>
      ) : (
        <>
          {messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            <ul>
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  style={{
                    marginBottom: '15px',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => openThread(msg)}
                >
                  <p><strong>From:</strong> {msg.sender?.name} ({msg.sender?.email})</p>
                  <p><strong>Regarding:</strong> {msg.property?.type} at {msg.property?.address}</p>
                  <p><strong>Message:</strong> {msg.content}</p>
                  <p><em>Received at:</em> {new Date(msg.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
