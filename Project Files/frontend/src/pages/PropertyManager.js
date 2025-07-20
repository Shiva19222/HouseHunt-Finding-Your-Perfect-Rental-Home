import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function PropertyManager() {
  const [form, setForm] = useState({
    type: '',
    adType: '',
    address: '',
    contact: '',
    amount: '',
    info: '',
    specificDate: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await API.get('/properties/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProperties(res.data);
    } catch (err) {
      alert('Failed to fetch properties');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (prop) => {
    setEditingId(prop._id);
    setForm({
      type: prop.type,
      adType: prop.adType,
      address: prop.address,
      contact: prop.contact,
      amount: prop.amount,
      info: prop.info,
      specificDate: prop.specificDate || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await API.delete(`/properties/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchProperties();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (imageFile) formData.append('image', imageFile);

      if (editingId) {
        await API.put(`/properties/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await API.post('/properties/create', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setEditingId(null);
      setForm({
        type: '',
        adType: '',
        address: '',
        contact: '',
        amount: '',
        info: '',
        specificDate: ''
      });
      setImageFile(null);
      fetchProperties();
    } catch (err) {
      alert('Failed to save property');
    }
  };

  return (
    <div className="container">
      <h3>{editingId ? 'Edit Property' : 'Add New Property'}</h3>
      <form onSubmit={handleSubmit}>
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type" required /><br />
        <select name="adType" value={form.adType} onChange={handleChange} required>
          <option value="">Select Ad Type</option>
          <option value="Rent">Rent</option>
          <option value="Sale">Sale</option>
          <option value="Rent for Specific Time">Rent for Specific Time</option>
        </select><br />
        {form.adType === 'Rent for Specific Time' && (
          <input type="date" name="specificDate" value={form.specificDate} onChange={handleChange} required />
        )}
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required /><br />
        <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" required /><br />
        <input name="amount" value={form.amount} onChange={handleChange} type="number" placeholder="Amount" required /><br />
        <textarea name="info" value={form.info} onChange={handleChange} placeholder="Additional Info" /><br />
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} /><br />
        <button type="submit">{editingId ? 'Update' : 'Add'} Property</button>
      </form>

      <h4>Your Properties</h4>
      {properties.length === 0 ? <p>No properties yet.</p> : (
        <ul>
          {properties.map(prop => (
            <li key={prop._id}>
              <strong>{prop.type}</strong> - {prop.adType} - ₹{prop.amount}<br />
              {prop.address}<br />
              {prop.info}<br />
              {prop.image && <img src={`http://localhost:5000${prop.image}`} alt="Property" width="200" />}<br />
              <button onClick={() => handleEdit(prop)}>Edit</button>
              <button onClick={() => handleDelete(prop._id)}>Delete</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
