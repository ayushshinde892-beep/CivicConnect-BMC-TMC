import React, { useState, useEffect } from 'react';
import { officerAPI, departmentAPI } from '../../services/api';
import {
  Users,
  PlusCircle,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  X
} from 'lucide-react';

export default function ManageOfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deptId, setDeptId] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchOfficersAndDepts = async () => {
    try {
      const [offRes, deptRes] = await Promise.all([
        officerAPI.getAll(),
        departmentAPI.getAll(),
      ]);

      if (offRes.success && offRes.data) setOfficers(offRes.data);
      if (deptRes.success && deptRes.data) setDepartments(deptRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load officers or departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficersAndDepts();
  }, []);

  const openCreateModal = () => {
    setEditingOfficer(null);
    setName('');
    setEmail('');
    setPhone('');
    setDeptId(departments[0]?.id ? String(departments[0].id) : '');
    setModalOpen(true);
  };

  const openEditModal = (off) => {
    setEditingOfficer(off);
    setName(off.name);
    setEmail(off.email);
    setPhone(off.phone);
    setDeptId(String(off.departmentId));
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editingOfficer) {
        await officerAPI.update(editingOfficer.id, {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          departmentId: parseInt(deptId, 10),
        });
      } else {
        await officerAPI.create({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          departmentId: parseInt(deptId, 10),
        });
      }
      setModalOpen(false);
      fetchOfficersAndDepts();
    } catch (err) {
      alert(err.message || 'Failed to save officer');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this officer?')) return;
    try {
      await officerAPI.delete(id);
      fetchOfficersAndDepts();
    } catch (err) {
      alert(err.message || 'Failed to delete officer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Officers</h1>
          <p className="text-xs text-slate-500">
            Manage assigned field officers and departmental engineers for BMC & TMC
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add Officer
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading officers...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs text-rose-600 font-medium">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {officers.map((off) => (
            <div
              key={off.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {off.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{off.name}</h3>
                    <span className="text-[11px] font-semibold text-blue-600 block">
                      {off.departmentName || 'General'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(off)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Officer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(off.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Officer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{off.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{off.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingOfficer ? 'Edit Officer Details' : 'Register Municipal Officer'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Officer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sneha Kulkarni"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sneha.kulkarni@bmc.gov.in"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9820192838"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  required
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.municipalCorporation || 'BMC/TMC'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow"
                >
                  {modalLoading ? 'Saving...' : editingOfficer ? 'Save Changes' : 'Add Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
