import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { officerPortalAPI, complaintAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import ResolveModal from '../../components/ResolveModal';
import RejectModal from '../../components/RejectModal';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Clock,
  ArrowUpDown,
  RefreshCw,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function OfficerComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await officerPortalAPI.getAssignedComplaints({
        keyword: searchTerm || undefined,
        status: statusFilter || undefined,
        page,
        size: 10,
      });

      if (res.success && res.data) {
        setComplaints(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to fetch assigned complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchComplaints();
  };

  const handleStartProgress = async (id) => {
    try {
      await complaintAPI.startProgress(id);
      setActionSuccess('Complaint moved to IN_PROGRESS.');
      fetchComplaints();
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
    fetchComplaints();
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleConfirmReject = async (reason) => {
    if (!selectedComplaint) return;
    await complaintAPI.reject(selectedComplaint.id, reason);
    setActionSuccess(`Complaint ${selectedComplaint.complaintNumber} marked as REJECTED.`);
    setShowRejectModal(false);
    setSelectedComplaint(null);
    fetchComplaints();
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const statusTabs = [
    { label: 'All Assigned', value: '' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Departmental Assigned Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Assigned Complaints</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage field complaints, launch on-site work progress, and record resolutions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchComplaints}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
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

        {/* Filters & Search Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setStatusFilter(tab.value);
                    setPage(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    statusFilter === tab.value
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, title, area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Complaints Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-xs font-medium">Fetching complaints from municipal records...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No complaints found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                No matching assigned complaints for the selected filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-4 sm:px-6">Complaint #</th>
                    <th className="py-3.5 px-4">Title & Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Citizen</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {complaints.map((c) => (
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
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{c.location}, {c.area} ({c.pincode})</p>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-700">
                        {c.categoryDisplayName || c.category}
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
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {c.status === 'ASSIGNED' && (
                            <button
                              onClick={() => handleStartProgress(c.id)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition"
                            >
                              Start Work
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
              <div>
                Showing page <strong className="text-slate-800">{page + 1}</strong> of{' '}
                <strong className="text-slate-800">{totalPages}</strong> ({totalElements} complaints)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
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
