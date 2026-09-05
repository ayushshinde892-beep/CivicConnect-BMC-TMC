import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complaintAPI, adminAPI, departmentAPI, officerAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import VisualTimeline from '../../components/VisualTimeline';
import ResolveModal from '../../components/ResolveModal';
import RejectModal from '../../components/RejectModal';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  UserCheck,
  Send,
  PlayCircle,
  ShieldCheck,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Status update form
  const [newStatus, setNewStatus] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Assignment form
  const [assignDeptId, setAssignDeptId] = useState('');
  const [assignOfficerId, setAssignOfficerId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignMessage, setAssignMessage] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await complaintAPI.getById(id);
      if (res.success && res.data) {
        setComplaint(res.data);
        setNewStatus(res.data.status);
        if (res.data.departmentId) {
          setAssignDeptId(String(res.data.departmentId));
          fetchOfficers(res.data.departmentId);
          if (res.data.assignedOfficerId) {
            setAssignOfficerId(String(res.data.assignedOfficerId));
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await departmentAPI.getAll();
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOfficers = async (deptId) => {
    if (!deptId) return;
    try {
      const res = await officerAPI.getAll(deptId);
      if (res.success && res.data) {
        setOfficers(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchDepartments();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setStatusLoading(true);
    setStatusMessage('');
    try {
      const res = await adminAPI.updateStatus(id, {
        status: newStatus,
        remarks: statusRemarks,
      });
      if (res.success) {
        setStatusMessage('Status updated successfully!');
        setStatusRemarks('');
        fetchDetails();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAssignmentUpdate = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    setAssignMessage('');
    try {
      const res = await adminAPI.assignComplaint(id, {
        departmentId: parseInt(assignDeptId, 10),
        officerId: assignOfficerId ? parseInt(assignOfficerId, 10) : null,
        remarks: assignRemarks,
      });
      if (res.success) {
        setAssignMessage('Department & officer assignment saved!');
        setAssignRemarks('');
        fetchDetails();
      }
    } catch (err) {
      alert(err.message || 'Assignment failed');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleConfirmResolve = async (remark) => {
    try {
      const res = await complaintAPI.resolve(id, remark);
      if (res.success) {
        setActionSuccess('Complaint marked as RESOLVED successfully!');
        setShowResolveModal(false);
        fetchDetails();
        setTimeout(() => setActionSuccess(''), 5000);
      }
    } catch (err) {
      alert(err.message || 'Resolution failed');
    }
  };

  const handleConfirmReject = async (reason) => {
    try {
      const res = await complaintAPI.reject(id, reason);
      if (res.success) {
        setActionSuccess('Complaint marked as REJECTED.');
        setShowRejectModal(false);
        fetchDetails();
        setTimeout(() => setActionSuccess(''), 5000);
      }
    } catch (err) {
      alert(err.message || 'Rejection failed');
    }
  };

  const handleStartProgress = async () => {
    try {
      const res = await complaintAPI.startProgress(id);
      if (res.success) {
        setActionSuccess('Complaint status moved to IN_PROGRESS.');
        fetchDetails();
        setTimeout(() => setActionSuccess(''), 5000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading grievance information...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
          {error || 'Complaint not found'}
        </div>
        <Link to="/admin/complaints" className="text-xs font-bold text-blue-600 underline">
          Back to Complaints Management
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Complaints
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaint Details & Citizen Info (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {complaint.complaintNumber}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.municipalCorporation}
                  </span>
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{complaint.title}</h1>
              </div>
              <StatusBadge status={complaint.status} className="text-sm px-3.5 py-1.5" />
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Complaint Description</h3>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* Image Attachment if present */}
            {complaint.imageUrl && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Attached Evidence Photo
                </h3>
                <div className="rounded-2xl border border-slate-200 overflow-hidden max-w-md bg-slate-50">
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint attachment"
                    className="w-full h-auto max-h-72 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
            )}

            {/* Citizen Contact Card */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" /> Citizen Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Full Name</span>
                  <span className="font-bold text-slate-800">{complaint.citizenName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Email</span>
                  <span className="font-bold text-slate-800">{complaint.citizenEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Phone Number</span>
                  <span className="font-bold text-slate-800">{complaint.citizenPhone}</span>
                </div>
              </div>
            </div>

            {/* Location & Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Category</span>
                <span className="font-bold text-slate-800">{complaint.categoryDisplayName || complaint.category}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Location</span>
                <span className="font-bold text-slate-800">{complaint.location}, {complaint.area}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Coordinates</span>
                <span className="font-mono text-slate-700">
                  {complaint.latitude && complaint.longitude ? `${complaint.latitude}, ${complaint.longitude}` : 'Not detected'}
                </span>
              </div>
            </div>

            {/* Resolution Remarks */}
            {complaint.resolutionRemarks && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Official Resolution Record
                </h4>
                <p className="text-xs text-emerald-800 font-medium">{complaint.resolutionRemarks}</p>
                {complaint.resolvedAt && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1.5">
                    Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Rejection Reason */}
            {complaint.rejectionReason && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" /> Official Rejection Reason
                </h4>
                <p className="text-xs text-rose-800 font-medium">{complaint.rejectionReason}</p>
              </div>
            )}

            {/* Citizen Feedback */}
            {complaint.feedback && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Citizen Feedback ({complaint.feedback.rating}/5)
                </h4>
                <p className="text-xs text-amber-800 italic">"{complaint.feedback.comment}"</p>
              </div>
            )}
          </div>

          {/* Visual Timeline */}
          <VisualTimeline currentStatus={complaint.status} history={complaint.history} />
        </div>

        {/* Right Column: Administrative Action Controls (1 Col) */}
        <div className="space-y-6">
          {/* Action 0: Dedicated Quick Resolution / Rejection Actions */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold tracking-tight">Direct Complaint Actions</h3>
            </div>
            <p className="text-xs text-slate-300">
              Trigger dedicated workflow actions with mandatory resolution notes or rejection reasons.
            </p>

            {actionSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-200 font-semibold">
                {actionSuccess}
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              {complaint.status === 'ASSIGNED' && (
                <button
                  type="button"
                  onClick={handleStartProgress}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Work (In Progress)</span>
                </button>
              )}

              {complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && complaint.status !== 'REJECTED' && (
                <button
                  type="button"
                  onClick={() => setShowResolveModal(true)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition shadow-emerald-900/40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>
              )}

              {complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && complaint.status !== 'REJECTED' && (
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="w-full py-2.5 px-4 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Complaint</span>
                </button>
              )}

              {(complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' || complaint.status === 'REJECTED') && (
                <div className="p-3 rounded-xl bg-white/10 text-center text-xs text-slate-300">
                  Complaint is currently in final state: <strong>{complaint.status}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Action 1: Status Transition */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-600" /> Lifecycle Status Transition
            </h3>

            {statusMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleStatusUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Action Remarks</label>
                <textarea
                  rows={3}
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  placeholder="Record work performed or reason for status update..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={statusLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition"
              >
                {statusLoading ? 'Saving...' : 'Apply Status Update'}
              </button>
            </form>
          </div>

          {/* Action 2: Department & Officer Routing */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" /> Route Department & Officer
            </h3>

            {assignMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {assignMessage}
              </div>
            )}

            <form onSubmit={handleAssignmentUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  required
                  value={assignDeptId}
                  onChange={(e) => {
                    setAssignDeptId(e.target.value);
                    setAssignOfficerId('');
                    fetchOfficers(e.target.value);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.municipalCorporation || 'BMC/TMC'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Officer</label>
                <select
                  value={assignOfficerId}
                  onChange={(e) => setAssignOfficerId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Unassigned (Department Pool) --</option>
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Instructions</label>
                <textarea
                  rows={2}
                  value={assignRemarks}
                  onChange={(e) => setAssignRemarks(e.target.value)}
                  placeholder="Instructions for field staff..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={assignLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
              >
                {assignLoading ? 'Saving...' : 'Save Assignment'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <ResolveModal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onConfirm={handleConfirmResolve}
        complaintNumber={complaint.complaintNumber}
        title={complaint.title}
      />

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        complaintNumber={complaint.complaintNumber}
        title={complaint.title}
      />
    </div>
  );
}
