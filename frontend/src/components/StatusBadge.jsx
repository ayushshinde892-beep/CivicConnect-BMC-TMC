import React from 'react';

const statusConfig = {
  SUBMITTED: {
    label: 'Submitted',
    bg: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bg: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  ASSIGNED: {
    label: 'Assigned',
    bg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-orange-100 text-orange-800 border-orange-200',
    dot: 'bg-orange-500',
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-100 text-rose-800 border-rose-200',
    dot: 'bg-rose-500',
  },
  CLOSED: {
    label: 'Closed',
    bg: 'bg-slate-100 text-slate-800 border-slate-200',
    dot: 'bg-slate-500',
  },
};

export default function StatusBadge({ status, className = '' }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-800 border-slate-200',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
      {config.label}
    </span>
  );
}
