import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, X, ShieldCheck, Loader } from 'lucide-react';

export default function ResolveModal({ isOpen, onClose, onConfirm, complaintNumber, title }) {
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!remark.trim() || remark.trim().length < 5) {
      setError('Please provide a detailed resolution remark (minimum 5 characters).');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onConfirm(remark.trim());
      setRemark('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to resolve complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/30 rounded-lg backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Mark as Resolved</h3>
              <p className="text-xs text-emerald-100 font-mono mt-0.5">{complaintNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {title && (
            <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3.5">
              <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">Complaint</p>
              <p className="text-sm font-medium text-slate-800 line-clamp-2 mt-0.5">{title}</p>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Resolution Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value);
                if (error) setError('');
              }}
              placeholder="Detail the work carried out, materials used, squad details, or field inspection summary..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              This remark will be visible to the citizen and recorded in the audit trail.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !remark.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Resolving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Resolution</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
