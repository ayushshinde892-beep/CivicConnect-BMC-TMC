import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI, adminAPI, departmentAPI, officerAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import {
  Search,
  Filter,
  Eye,
  Edit3,
  UserCheck,
  Building2,
  Calendar,
  AlertCircle,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const categories = [
  'GARBAGE_AND_WASTE',
  'POTHOLES_AND_ROADS',
  'STREETLIGHTS',
  'WATER_SUPPLY',
  'DRAINAGE_AND_SEWAGE',
  'SANITATION',
  'PUBLIC_TOILETS',
  'TRAFFIC_AND_PARKING',
  'ILLEGAL_CONSTRUCTION',
  'TREE_AND_GARDEN',
  'PUBLIC_PROPERTY_DAMAGE',
  'OTHER',
];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [corporation, setCorporation] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  // Metadata for modals
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  // Modals state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Status Modal Form
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // Assign Modal Form
  const [assignDeptId, setAssignDeptId] = useState('');
  const [assignOfficerId, setAssignOfficerId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintAPI.getAll({
        keyword: keyword || undefined,
        status: status || undefined,
        category: category || undefined,
        priority: priority || undefined,
        corporation: corporation || undefined,
        departmentId: departmentId || undefined,
        page,
        size: pageSize,
      });

      if (res.success && res.data) {
        setComplaints(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
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

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [page, status, category, priority, corporation, departmentId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchComplaints();
  };

  // Open Status Modal
  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setStatusRemarks('');
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const res = await adminAPI.updateStatus(selectedComplaint.id, {
        status: newStatus,
        remarks: statusRemarks,
      });
      if (res.success) {
        setStatusModalOpen(false);
        fetchComplaints();
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setModalLoading(false);
    }
  };

  // Open Assign Modal
  const openAssignModal = async (complaint) => {
    setSelectedComplaint(complaint);
    setAssignDeptId(complaint.departmentId ? String(complaint.departmentId) : (departments[0]?.id ? String(departments[0].id) : ''));
    setAssignRemarks('');
    setAssignModalOpen(true);

    if (complaint.departmentId) {
      fetchOfficersForDept(complaint.departmentId);
      setAssignOfficerId(complaint.assignedOfficerId ? String(complaint.assignedOfficerId) : '');
    } else if (departments.length > 0) {
      fetchOfficersForDept(departments[0].id);
      setAssignOfficerId('');
    }
  };

  const fetchOfficersForDept = async (deptId) => {
    if (!deptId) {
      setOfficers([]);
      return;
    }
    try {
      const res = await officerAPI.getAll(deptId);
      if (res.success && res.data) {
        setOfficers(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeptSelectChange = (e) => {
    const dId = e.target.value;
    setAssignDeptId(dId);
    setAssignOfficerId('');
    fetchOfficersForDept(dId);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const res = await adminAPI.assignComplaint(selectedComplaint.id, {
        departmentId: parseInt(assignDeptId, 10),
        officerId: assignOfficerId ? parseInt(assignOfficerId, 10) : null,
        remarks: assignRemarks,
      });
      if (res.success) {
        setAssignModalOpen(false);
        fetchComplaints();
      }
    } catch (err) {
      alert(err.message || 'Failed to assign complaint');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Complaints Management</h1>
          <p className="text-xs text-slate-500">
            Review, filter, route to departments, and resolve BMC & TMC complaints ({totalElements} total records)
          </p>
        </div>
      </div>

      {/* Search & Multi-Filters Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Complaint ID (e.g. CMP-2026-0001), citizen name, title, or locality..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Corporation Filter */}
          <select
            value={corporation}
            onChange={(e) => { setCorporation(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Corporations (BMC / TMC)</option>
            <option value="BMC">BMC – Brihanmumbai</option>
            <option value="TMC">TMC – Thane</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={departmentId}
            onChange={(e) => { setDepartmentId(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Fetching municipal complaints...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600 font-medium">{error}</div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            No complaints found matching selected filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="py-3.5 px-4">Complaint ID</th>
                    <th className="py-3.5 px-4">Title & Citizen</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Corporation</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{c.complaintNumber}</td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-slate-900 truncate">{c.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          Citizen: {c.citizenName} ({c.citizenPhone})
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {c.categoryDisplayName || c.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[10px]">
                          {c.municipalCorporation}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-[140px] truncate text-slate-600">
                        {c.area || c.location}
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {c.departmentName ? (
                          <span className="font-semibold text-slate-800">{c.departmentName}</span>
                        ) : (
                          <span className="italic text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/complaints/${c.id}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openAssignModal(c)}
                            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                            title="Assign Department & Officer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openStatusModal(c)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                            title="Update Status"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>
                Page {page + 1} of {Math.max(1, totalPages)} ({totalElements} total complaints)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1 font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  type="button"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1 font-semibold"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal 1: Update Status Modal */}
      {statusModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedComplaint.complaintNumber}</span>
                <h3 className="text-base font-bold text-slate-900">Change Complaint Status</h3>
              </div>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Resolution Status</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Official Remarks / Action Taken</label>
                <textarea
                  rows={3}
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  placeholder="Enter remarks explaining what actions the municipal team performed..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow"
                >
                  {modalLoading ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Department and Officer Modal */}
      {assignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedComplaint.complaintNumber}</span>
                <h3 className="text-base font-bold text-slate-900">Assign Department & Officer</h3>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Department</label>
                <select
                  required
                  value={assignDeptId}
                  onChange={handleDeptSelectChange}
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
                <label className="block font-semibold text-slate-700 mb-1">Select Officer (Optional)</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Routing Notes / Work Order Instructions</label>
                <textarea
                  rows={3}
                  value={assignRemarks}
                  onChange={(e) => setAssignRemarks(e.target.value)}
                  placeholder="e.g. Dispatched for immediate morning inspection..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow"
                >
                  {modalLoading ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
