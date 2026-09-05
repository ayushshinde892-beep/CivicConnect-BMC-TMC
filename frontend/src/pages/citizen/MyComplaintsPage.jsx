import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Calendar,
  Building2,
  AlertCircle
} from 'lucide-react';

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.complaintNumber?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === '' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Registered Complaints</h1>
          <p className="text-xs text-slate-500">Track all your submitted civic grievances and post feedback</p>
        </div>
        <Link
          to="/citizen/submit"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> New Complaint
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by ID, title, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading your complaints...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600 font-medium">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No complaints found</p>
            <p className="text-xs text-slate-500">Try changing your search keywords or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-4">Complaint ID</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Corporation</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 font-mono font-bold text-blue-600">{c.complaintNumber}</td>
                    <td className="py-4 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{c.location}, {c.area}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {c.categoryDisplayName || c.category}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[10px]">
                        {c.municipalCorporation}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/citizen/complaints/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
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
