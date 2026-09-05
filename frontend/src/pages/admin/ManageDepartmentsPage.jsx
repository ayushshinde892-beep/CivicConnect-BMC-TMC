import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../../services/api';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  Building2,
  Users,
  FileText,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ManageDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [name, setName] = useState('');
  const [corp, setCorp] = useState('BMC');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDepts = async () => {
    try {
      const res = await departmentAPI.getAll();
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setName('');
    setCorp('BMC');
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setName(dept.name);
    setCorp(dept.municipalCorporation || 'BMC');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setModalLoading(true);
    try {
      if (editingDept) {
        await departmentAPI.update(editingDept.id, {
          name: name.trim(),
          municipalCorporation: corp,
        });
      } else {
        await departmentAPI.create({
          name: name.trim(),
          municipalCorporation: corp,
        });
      }
      setModalOpen(false);
      fetchDepts();
    } catch (err) {
      alert(err.message || 'Failed to save department');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      await departmentAPI.delete(id);
      fetchDepts();
    } catch (err) {
      alert(err.message || 'Failed to delete department');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Departments</h1>
          <p className="text-xs text-slate-500">
            Configure engineering, sanitation, water, and road divisions for BMC & TMC
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add Department
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading departments...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs text-rose-600 font-medium">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                    <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-0.5">
                      {dept.municipalCorporation || 'BMC/TMC'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(dept)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Department"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Department"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-semibold block">Officers</span>
                  <span className="font-bold text-slate-800">{dept.officerCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-semibold block">Complaints</span>
                  <span className="font-bold text-slate-800">{dept.complaintCount}</span>
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
                {editingDept ? 'Edit Department' : 'Create New Department'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electrical Department"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Municipal Corporation</label>
                <select
                  value={corp}
                  onChange={(e) => setCorp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BMC">BMC – Brihanmumbai</option>
                  <option value="TMC">TMC – Thane</option>
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
                  {modalLoading ? 'Saving...' : editingDept ? 'Save Changes' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
