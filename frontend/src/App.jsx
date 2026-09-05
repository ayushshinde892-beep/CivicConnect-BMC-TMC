import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TrackComplaintPage from './pages/TrackComplaintPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitComplaintPage from './pages/citizen/SubmitComplaintPage';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import ComplaintDetailsPage from './pages/citizen/ComplaintDetailsPage';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerComplaintsPage from './pages/officer/OfficerComplaintsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminComplaintDetailsPage from './pages/admin/AdminComplaintDetailsPage';
import ManageDepartmentsPage from './pages/admin/ManageDepartmentsPage';
import ManageOfficersPage from './pages/admin/ManageOfficersPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/track" element={<TrackComplaintPage />} />

              {/* Citizen Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
                <Route path="/citizen/submit" element={<SubmitComplaintPage />} />
                <Route path="/citizen/complaints" element={<MyComplaintsPage />} />
                <Route path="/citizen/complaints/:id" element={<ComplaintDetailsPage />} />
              </Route>

              {/* Officer & Admin Protected Routes */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                {/* Officer Portal */}
                <Route path="/officer/dashboard" element={<OfficerDashboard />} />
                <Route path="/officer/complaints" element={<OfficerComplaintsPage />} />
                <Route path="/officer/complaints/:id" element={<AdminComplaintDetailsPage />} />

                {/* Admin Management */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
                <Route path="/admin/complaints/:id" element={<AdminComplaintDetailsPage />} />
                <Route path="/admin/departments" element={<ManageDepartmentsPage />} />
                <Route path="/admin/officers" element={<ManageOfficersPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
