import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  FileText,
  Search,
  PlusCircle,
  LayoutDashboard,
  Users,
  Briefcase,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ShieldCheck,
  UserCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isSuperAdmin, isOfficer, isCitizen, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Municipal Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white text-[11px] py-1 px-4 sm:px-8 flex justify-between items-center font-medium">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            BMC & TMC Unified Civic Grievance Redressal Portal
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <span>BMC Helpline: <strong>1916</strong></span>
          <span>•</span>
          <span>TMC Toll-Free: <strong>1800-222-108</strong></span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">Civic<span className="text-blue-600">Connect</span></span>
                <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">BMC/TMC</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">Citizen Grievance Management</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/track"
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                isActive('/track') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Track Complaint
            </Link>

            {/* Citizen Links */}
            {isAuthenticated && isCitizen && (
              <>
                <Link
                  to="/citizen/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/citizen/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/citizen/submit"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/citizen/submit') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Complaint
                </Link>

                <Link
                  to="/citizen/complaints"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/citizen/complaints') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Complaints
                </Link>
              </>
            )}

            {/* Officer Links */}
            {isAuthenticated && isOfficer && (
              <>
                <Link
                  to="/officer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/officer/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Officer Dashboard
                </Link>

                <Link
                  to="/officer/complaints"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/officer/complaints') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Assigned Complaints
                </Link>
              </>
            )}

            {/* Admin Links */}
            {isAuthenticated && isSuperAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/admin/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>

                <Link
                  to="/admin/complaints"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/admin/complaints') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  All Complaints
                </Link>

                <Link
                  to="/admin/departments"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/admin/departments') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Departments
                </Link>

                <Link
                  to="/admin/officers"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/admin/officers') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Officers
                </Link>
              </>
            )}
          </nav>

          {/* User Profile / Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2 text-right">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {isSuperAdmin ? 'Chief Administrator' : isOfficer ? 'Ward Officer' : 'Citizen'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Track Complaint
          </Link>

          {isAuthenticated && isCitizen && (
            <>
              <Link
                to="/citizen/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/citizen/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Submit Complaint
              </Link>
              <Link
                to="/citizen/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                My Complaints
              </Link>
            </>
          )}

          {isAuthenticated && isOfficer && (
            <>
              <Link
                to="/officer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Officer Dashboard
              </Link>
              <Link
                to="/officer/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Assigned Complaints
              </Link>
            </>
          )}

          {isAuthenticated && isSuperAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                All Complaints
              </Link>
              <Link
                to="/admin/departments"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Departments
              </Link>
              <Link
                to="/admin/officers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Officers
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
