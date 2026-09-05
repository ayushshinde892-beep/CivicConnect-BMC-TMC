import React from 'react';

const priorityConfig = {
  LOW: {
    label: 'Low',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  HIGH: {
    label: 'High',
    bg: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
  },
  URGENT: {
    label: 'Urgent',
    bg: 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse',
  },
};

export default function PriorityBadge({ priority, className = '' }) {
  const config = priorityConfig[priority] || {
    label: priority || 'Medium',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${config.bg} ${className}`}
    >
      {config.label}
    </span>
  );
}
