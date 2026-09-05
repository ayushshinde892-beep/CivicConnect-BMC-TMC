import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { officerPortalAPI, complaintAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import ResolveModal from '../../components/ResolveModal';
import RejectModal from '../../components/RejectModal';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PlayCircle,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  Building,
  UserCheck,
  CheckCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDashboardData = async () => {
    try {
      const res = await officerPortalAPI.getDashboard();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load officer dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleStartProgress = async (complaintId) => {
    try {
      await complaintAPI.startProgress(complaintId);
      setActionSuccess('Complaint moved to IN_PROGRESS successfully.');
      fetchDashboardData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update progress');
    }
  };

  const handleConfirmResolve = async (remark) => {
    if (!selectedComplaint) return;
    await complaintAPI.resolve(selectedComplaint.id, remark);
    setActionSuccess(`Complaint ${selectedComplaint.complaintNumber} marked as RESOLVED.`);
    setShowResolveModal(false);
    setSelectedComplaint(null);
    fetchDashboardData();
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleConfirmReject = async (reason) => {
    if (!selectedComplaint) return;
    await complaintAPI.reject(selectedComplaint.id, reason);
    setActionSuccess(`Complaint ${selectedComplaint.complaintNumber} REJECTED.`);
    setShowRejectModal(false);
    setSelectedComplaint(null);
    fetchDashboardData();
    setTimeout(() => setActionSuccess(''), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading Officer Command Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Officer Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Municipal Field Officer Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome back, {stats?.officerName || user?.name}
              </h1>
              <p className="text-slate-300 text-sm flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-400" />
                  <strong>{stats?.departmentName || 'Department'}</strong> ({stats?.corporation || 'BMC/TMC'})
                </span>
                <span>•</span>
                <span className="text-slate-400">{user?.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold flex items-center gap-2 border border-white/10 transition"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>

              <Link
                to="/officer/complaints"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
              >
                <span>View Full Queue</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Action success notification */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-semibold">{actionSuccess}</p>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-emerald-700 hover:text-emerald-900 font-bold text-sm">
              ✕
            </button>
          </div>
        )}

        {/* Officer KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Assigned"
            value={stats?.totalAssigned || 0}
            icon={FileText}
            variant="blue"
          />
          <StatCard
            title="Pending Review"
            value={stats?.pendingComplaints || 0}
            icon={Clock}
            variant="amber"
          />
          <StatCard
            title="In Progress"
            value={stats?.inProgressComplaints || 0}
            icon={PlayCircle}
            variant="indigo"
          />
          <StatCard
            title="Resolved"
            value={stats?.resolvedComplaints || 0}
            icon={CheckCircle2}
            variant="emerald"
          />
          <StatCard
            title="Rejected"
            value={stats?.rejectedComplaints || 0}
            icon={XCircle}
            variant="rose"
          />
          <StatCard
            title="Urgent Priority"
            value={stats?.urgentComplaints || 0}
            icon={ShieldAlert}
            variant="purple"
          />
        </div>

        {/* Assigned Complaints Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Active Assigned Complaints</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complaints currently routed to your desk and department squad.
              </p>
            </div>

            <Link
              to="/officer/complaints"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Explore All ({stats?.totalAssigned || 0})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {!stats?.recentComplaints || stats.recentComplaints.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Assigned Queue is Clear!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                There are no open complaints pending action assigned to your officer account right now.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-4 sm:px-6">Complaint #</th>
                    <th className="py-3.5 px-4">Subject & Location</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4">Citizen</th>
                    <th className="py-3.5 px-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {stats.recentComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-xs text-blue-700 whitespace-nowrap">
                        <Link to={`/admin/complaints/${c.id}`} className="hover:underline">
                          {c.complaintNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <Link to={`/admin/complaints/${c.id}`} className="font-semibold text-slate-900 hover:text-blue-600 line-clamp-1">
                          {c.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{c.location}, {c.area}</p>
                      </td>
                      <td className="py-4 px-4">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        <p className="font-medium text-slate-800">{c.citizenName}</p>
                        <p className="text-slate-400">{c.citizenPhone}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {c.status === 'ASSIGNED' && (
                            <button
                              onClick={() => handleStartProgress(c.id)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition"
                            >
                              Start Progress
                            </button>
                          )}

                          {(c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED') && (
                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setShowResolveModal(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-emerald-600/20 transition"
                            >
                              Resolve
                            </button>
                          )}

                          {c.status !== 'RESOLVED' && c.status !== 'CLOSED' && c.status !== 'REJECTED' && (
                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setShowRejectModal(true);
                              }}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition"
                            >
                              Reject
                            </button>
                          )}

                          <Link
                            to={`/admin/complaints/${c.id}`}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      <ResolveModal
        isOpen={showResolveModal}
        onClose={() => {
          setShowResolveModal(false);
          setSelectedComplaint(null);
        }}
        onConfirm={handleConfirmResolve}
        complaintNumber={selectedComplaint?.complaintNumber}
        title={selectedComplaint?.title}
      />

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedComplaint(null);
        }}
        onConfirm={handleConfirmReject}
        complaintNumber={selectedComplaint?.complaintNumber}
        title={selectedComplaint?.title}
      />
    </div>
  );
}
