import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/StatCard';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flame,
  Building2,
  Layers,
  ArrowRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminAPI.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading municipal analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-xs text-rose-600">
        {error}
      </div>
    );
  }

  // Prepare Chart Data
  // 1. Complaints by Category
  const categoryLabels = Object.keys(stats?.complaintsByCategory || {});
  const categoryValues = Object.values(stats?.complaintsByCategory || {});
  const categoryChartData = {
    labels: categoryLabels.length > 0 ? categoryLabels : ['No Data'],
    datasets: [
      {
        label: 'Number of Complaints',
        data: categoryValues.length > 0 ? categoryValues : [0],
        backgroundColor: [
          '#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#06b6d4',
          '#8b5cf6', '#14b8a6', '#f97316', '#84cc16', '#64748b', '#a855f7'
        ],
        borderRadius: 8,
      },
    ],
  };

  // 2. Complaints by Status
  const statusLabels = Object.keys(stats?.complaintsByStatus || {});
  const statusValues = Object.values(stats?.complaintsByStatus || {});
  const statusChartData = {
    labels: statusLabels.map((s) => s.replace('_', ' ')),
    datasets: [
      {
        data: statusValues,
        backgroundColor: ['#3b82f6', '#f59e0b', '#6366f1', '#f97316', '#10b981', '#ef4444', '#64748b'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // 3. Corporation Comparison (BMC vs TMC)
  const corpChartData = {
    labels: ['Brihanmumbai (BMC)', 'Thane (TMC)'],
    datasets: [
      {
        data: [stats?.bmcComplaints || 0, stats?.tmcComplaints || 0],
        backgroundColor: ['#0f2942', '#0d7c7c'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // 4. Department Workload
  const deptLabels = Object.keys(stats?.complaintsByDepartment || {});
  const deptValues = Object.values(stats?.complaintsByDepartment || {});
  const deptChartData = {
    labels: deptLabels.length > 0 ? deptLabels : ['Unassigned'],
    datasets: [
      {
        label: 'Active Grievances',
        data: deptValues.length > 0 ? deptValues : [0],
        backgroundColor: '#026bc9',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <BarChart2 className="w-3.5 h-3.5" /> Municipal Analytics & Operations Command
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">BMC / TMC Officers Dashboard</h1>
          <p className="text-xs text-slate-300">
            Real-time monitoring, grievance distribution, and department workload tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/complaints"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Manage All Complaints
          </Link>
        </div>
      </div>

      {/* 6 Key KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Filed" value={stats?.totalComplaints} icon={FileText} color="blue" />
        <StatCard title="Submitted" value={stats?.submittedComplaints} icon={Clock} color="indigo" />
        <StatCard title="Under Review" value={stats?.underReviewComplaints} icon={Clock} color="amber" />
        <StatCard title="In Progress" value={stats?.inProgressComplaints} icon={AlertTriangle} color="orange" />
        <StatCard title="Resolved" value={stats?.resolvedComplaints} icon={CheckCircle2} color="green" />
        <StatCard title="Urgent Priority" value={stats?.urgentComplaints} icon={Flame} color="red" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Categories Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
              <p className="text-[11px] text-slate-500">Distribution of civic complaints across municipal domains</p>
            </div>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="h-72 flex items-center justify-center">
            <Bar
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } },
                  x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45, font: { size: 9 } } }
                }
              }}
            />
          </div>
        </div>

        {/* Chart 2: Status Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaints by Status</h3>
              <p className="text-[11px] text-slate-500">Current workflow and resolution stage breakdown</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="h-72 flex items-center justify-center">
            <Doughnut
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } } }
              }}
            />
          </div>
        </div>

        {/* Chart 3: BMC vs TMC Comparison */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Corporation Distribution</h3>
              <p className="text-[11px] text-slate-500">Grievance volume comparison: Mumbai (BMC) vs Thane (TMC)</p>
            </div>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="h-72 flex items-center justify-center">
            <Pie
              data={corpChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } } }
              }}
            />
          </div>
        </div>

        {/* Chart 4: Department Workload */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaints by Assigned Department</h3>
              <p className="text-[11px] text-slate-500">Workload across engineering, roads, and solid waste wings</p>
            </div>
            <BarChart2 className="w-4 h-4 text-orange-600" />
          </div>
          <div className="h-72 flex items-center justify-center">
            <Bar
              data={deptChartData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { beginAtZero: true, ticks: { precision: 0 } },
                  y: { ticks: { font: { size: 10 } } }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
