import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import OwnerDashboard from './pages/OwnerDashboard';
import RenterDashboard from './pages/RenterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SendMessagePage from './pages/SendMessagePage';
import RenterMessageHistory from './pages/RenterMessageHistory';
import PropertyManager from './pages/PropertyManager';
import BookingManager from './pages/BookingManager';
import OwnerBookingRequests from './pages/OwnerBookingRequests';
import RenterBookingHistory from './pages/RenterBookingHistory';
import Inbox from './pages/Inbox';

import './App.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">Welcome to HouseHunt</header>

        <div className="app-body">
          <aside className="sidebar">
            <nav>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/admin">Admin</Link>
              <Link to="/inbox">Messages</Link>
            </nav>
          </aside>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/owner" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />
              <Route path="/renter" element={<PrivateRoute><RenterDashboard /></PrivateRoute>} />
              <Route path="/inbox" element={<PrivateRoute><Inbox /></PrivateRoute>} />
              <Route path="/messages/send" element={<SendMessagePage />} />
              <Route path="/messages/history/:propertyId" element={<RenterMessageHistory />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/property" element={<PropertyManager />} />
              <Route path="/owner/inbox" element={<Inbox />} />
              <Route path="/bookings/manage" element={<BookingManager />} />
              <Route path="/owner/bookings" element={<OwnerBookingRequests />} />
              <Route path="/bookings/my" element={<RenterBookingHistory />} />
              <Route path="/renter/bookings" element={<RenterBookingHistory />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
            />
            <Route
              path="/owner"
              element={
                <PrivateRoute>
                  <OwnerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/renter"
              element={
                <PrivateRoute>
                  <RenterDashboard />
                </PrivateRoute>
              }
            />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
