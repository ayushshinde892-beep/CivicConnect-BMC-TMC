import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { complaintAPI } from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  Search,
  Eye
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintAPI.getMyComplaints();
        if (res.success && res.data) {
          setComplaints(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const total = complaints.length;
  const submitted = complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const rejected = complaints.filter((c) => c.status === 'REJECTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-wider text-blue-300">Citizen Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome, {user?.name}!</h1>
          <p className="text-xs text-slate-300">Track and manage your civic grievances for BMC and TMC.</p>
        </div>
        <Link
          to="/citizen/submit"
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-5 h-5" /> Report New Issue
        </Link>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Filed" value={total} icon={FileText} color="blue" />
        <StatCard title="Under Review" value={submitted} icon={Clock} color="amber" />
        <StatCard title="In Progress" value={inProgress} icon={AlertTriangle} color="orange" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle2} color="green" />
        <StatCard title="Rejected" value={rejected} icon={XCircle} color="red" />
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Complaints</h2>
            <p className="text-xs text-slate-500">List of your latest registered grievances</p>
          </div>
          <Link
            to="/citizen/complaints"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All ({complaints.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading complaints from database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600 font-medium">{error}</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No complaints registered yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              If you have noticed garbage overflow, potholes, water issues, or streetlight failure, report it immediately!
            </p>
            <Link
              to="/citizen/submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow hover:bg-blue-700 transition"
            >
              <PlusCircle className="w-4 h-4" /> Submit Complaint
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Corporation</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{c.complaintNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">{c.title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.categoryDisplayName || c.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[10px]">
                        {c.municipalCorporation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/citizen/complaints/${c.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
