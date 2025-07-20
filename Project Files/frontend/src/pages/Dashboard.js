import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

useEffect(() => {
  const type = localStorage.getItem('userType')?.toLowerCase();
  if (type === 'owner') navigate('/owner');
  else if (type === 'renter') navigate('/renter');
  else if (type === 'admin') navigate('/admin');
  else navigate('/login');
}, [navigate]);


  return null; // optional fallback if needed
}
