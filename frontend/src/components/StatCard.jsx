import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      text: 'text-blue-950',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-500 text-white',
      text: 'text-amber-950',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-500 text-white',
      text: 'text-orange-950',
    },
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      text: 'text-emerald-950',
    },
    red: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      iconBg: 'bg-rose-600 text-white',
      text: 'text-rose-950',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-600 text-white',
      text: 'text-indigo-950',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-5 rounded-2xl bg-white border ${scheme.border} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className={`text-2xl font-bold ${scheme.text}`}>{value ?? 0}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.iconBg} shadow-sm`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
