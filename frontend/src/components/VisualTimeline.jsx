import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, User, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

const allStages = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

export default function VisualTimeline({ currentStatus, history = [] }) {
  const isRejected = currentStatus === 'REJECTED';
  const isClosed = currentStatus === 'CLOSED';

  // Determine stage progress index
  const stageIndex = allStages.indexOf(currentStatus);
  const activeIdx = stageIndex !== -1 ? stageIndex : (isClosed ? 4 : (isRejected ? 1 : 0));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center justify-between">
        <span>Status Timeline & Lifecycle</span>
        <StatusBadge status={currentStatus} />
      </h3>

      {/* Visual Step Tracker */}
      <div className="relative mb-8">
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 transition-all duration-500 ${
              isRejected ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{
              width: `${(activeIdx / (allStages.length - 1)) * 100}%`,
            }}
          />

          {allStages.map((stage, index) => {
            const isCompleted = index <= activeIdx && !isRejected;
            const isCurrent = index === activeIdx && !isRejected;
            const stageLabels = {
              SUBMITTED: 'Submitted',
              UNDER_REVIEW: 'Under Review',
              ASSIGNED: 'Assigned',
              IN_PROGRESS: 'In Progress',
              RESOLVED: 'Resolved',
            };

            return (
              <div key={stage} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-semibold ${
                    isCompleted || isCurrent ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {stageLabels[stage]}
                </span>
              </div>
            );
          })}
        </div>

        {/* If rejected notice */}
        {isRejected && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>This complaint was marked as rejected upon municipal review.</span>
          </div>
        )}
      </div>

      {/* Detailed Action History Log */}
      <div className="space-y-4 border-t border-slate-100 pt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity History Log</h4>
        {history.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={item.id || idx} className="flex items-start gap-3 text-sm p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="mt-0.5 p-1.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-slate-900 text-xs">
                      {item.oldStatus ? `${item.oldStatus} ➔ ${item.newStatus}` : `Status: ${item.newStatus}`}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recently'}
                    </span>
                  </div>
                  {item.comment && (
                    <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60 mt-1">
                      {item.comment}
                    </p>
                  )}
                  {item.updatedBy && (
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" /> Updated by: <span className="font-medium text-slate-700">{item.updatedBy}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
