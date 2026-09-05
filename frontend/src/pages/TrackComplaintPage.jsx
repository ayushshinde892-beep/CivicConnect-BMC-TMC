import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import VisualTimeline from '../components/VisualTimeline';
import {
  Search,
  Building2,
  MapPin,
  Calendar,
  User,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  FileText,
  Star,
  MessageSquare
} from 'lucide-react';

export default function TrackComplaintPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [complaintNumber, setComplaintNumber] = useState(initialId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (numberToSearch) => {
    if (!numberToSearch || !numberToSearch.trim()) return;

    setError('');
    setLoading(true);
    setComplaint(null);

    try {
      const res = await complaintAPI.track(numberToSearch.trim());
      if (res.success && res.data) {
        setComplaint(res.data);
      } else {
        setError(res.message || 'Complaint not found with this ID.');
      }
    } catch (err) {
      setError(err.message || 'No complaint found matching this ID. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchTracking(initialId);
    }
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (complaintNumber.trim()) {
      setSearchParams({ id: complaintNumber.trim() });
      fetchTracking(complaintNumber.trim());
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Search className="w-3.5 h-3.5" /> Public Grievance Tracking Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Track Municipal Complaint Status</h1>
          <p className="text-xs text-slate-300">
            Enter your unique Complaint ID (e.g. <strong>CMP-2026-0001</strong>) to view real-time department routing and progress.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto pt-2">
            <input
              type="text"
              required
              value={complaintNumber}
              onChange={(e) => setComplaintNumber(e.target.value)}
              placeholder="e.g. CMP-2026-0001"
              className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono font-medium shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" /> Track
                </>
              )}
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-300">
            <span>Try sample IDs:</span>
            {['CMP-2026-0001', 'CMP-2026-0002', 'CMP-2026-0003', 'CMP-2026-0005'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setComplaintNumber(id);
                  setSearchParams({ id });
                  fetchTracking(id);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-white text-[11px] transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Complaint Not Found</p>
            <p className="text-[11px]">{error}</p>
          </div>
        </div>
      )}

      {/* Result Card */}
      {complaint && (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {complaint.complaintNumber}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.municipalCorporation}
                  </span>
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{complaint.title}</h2>
              </div>
              <div>
                <StatusBadge status={complaint.status} className="text-sm px-3 py-1.5" />
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Complaint Description</h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* Grid of Key Properties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Category</span>
                <span className="font-bold text-slate-800">{complaint.categoryDisplayName || complaint.category}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Location / Ward</span>
                <span className="font-bold text-slate-800">{complaint.location}, {complaint.area}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Assigned Department</span>
                <span className="font-bold text-slate-800">{complaint.departmentName || 'Under Review / Routing'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Registration Date</span>
                <span className="font-bold text-slate-800">
                  {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Officer & Resolution remarks */}
            {complaint.resolutionRemarks && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Municipal Resolution Remarks
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">{complaint.resolutionRemarks}</p>
                {complaint.resolvedAt && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-2">
                    Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Citizen Feedback if resolved */}
            {complaint.feedback && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Citizen Feedback & Rating ({complaint.feedback.rating} / 5 Stars)
                </h4>
                <p className="text-xs text-amber-800 italic">"{complaint.feedback.comment}"</p>
                <p className="text-[11px] text-amber-700 font-medium mt-1">
                  Submitted by {complaint.feedback.citizenName} on {new Date(complaint.feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Visual Timeline Section */}
          <VisualTimeline currentStatus={complaint.status} history={complaint.history} />
        </div>
      )}
    </div>
  );
}
