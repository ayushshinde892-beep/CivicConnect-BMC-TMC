import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Waves,
  Sparkles,
  Home,
  Car,
  Trees,
  Hammer,
  HelpCircle,
  PhoneCall,
  Activity
} from 'lucide-react';

const categories = [
  { id: 'GARBAGE_AND_WASTE', title: 'Garbage & Waste', icon: Trash2, color: 'text-amber-600 bg-amber-50' },
  { id: 'POTHOLES_AND_ROADS', title: 'Potholes & Roads', icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
  { id: 'STREETLIGHTS', title: 'Streetlights', icon: Lightbulb, color: 'text-yellow-600 bg-yellow-50' },
  { id: 'WATER_SUPPLY', title: 'Water Supply', icon: Droplets, color: 'text-blue-600 bg-blue-50' },
  { id: 'DRAINAGE_AND_SEWAGE', title: 'Drainage & Sewage', icon: Waves, color: 'text-cyan-600 bg-cyan-50' },
  { id: 'SANITATION', title: 'Sanitation', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'PUBLIC_TOILETS', title: 'Public Toilets', icon: Home, color: 'text-teal-600 bg-teal-50' },
  { id: 'TRAFFIC_AND_PARKING', title: 'Traffic & Parking', icon: Car, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'ILLEGAL_CONSTRUCTION', title: 'Illegal Construction', icon: Hammer, color: 'text-rose-600 bg-rose-50' },
  { id: 'TREE_AND_GARDEN', title: 'Tree & Garden Issues', icon: Trees, color: 'text-green-600 bg-green-50' },
  { id: 'PUBLIC_PROPERTY_DAMAGE', title: 'Public Property Damage', icon: Building2, color: 'text-purple-600 bg-purple-50' },
  { id: 'OTHER', title: 'Other Civic Issues', icon: HelpCircle, color: 'text-slate-600 bg-slate-50' },
];

export default function HomePage() {
  const [trackId, setTrackId] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackId.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Official Grievance Redressal System for Mumbai & Thane
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Report Civic Problems. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">
              Track Progress. Improve Your City.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An integrated complaint management platform for BMC (Brihanmumbai) and TMC (Thane) citizens to lodge, track, and verify municipal civic resolutions.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/citizen/submit"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              Register Complaint
            </Link>

            <Link
              to="/track"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-blue-400" />
              Track Complaint
            </Link>
          </div>

          {/* Inline Quick Tracker Search Bar */}
          <div className="pt-8 max-w-xl mx-auto">
            <form onSubmit={handleTrackSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Enter Complaint ID (e.g. CMP-2026-0001)..."
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                className="w-full pl-5 pr-32 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15 backdrop-blur-md"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Track
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Corporations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BMC Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-md">
                BMC
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Brihanmumbai Municipal Corporation</h3>
                <p className="text-xs text-slate-500">Serving Mumbai City & Suburban Wards</p>
                <p className="text-[11px] text-blue-600 font-medium mt-1">24 Administrative Wards (A to T)</p>
              </div>
            </div>
            <Link
              to="/citizen/submit"
              className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors self-end sm:self-auto"
            >
              Report to BMC <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TMC Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-black text-xl shadow-md">
                TMC
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Thane Municipal Corporation</h3>
                <p className="text-xs text-slate-500">Serving Thane City & Prabhag Samiti Zones</p>
                <p className="text-[11px] text-teal-600 font-medium mt-1">9 Ward Committees</p>
              </div>
            </div>
            <Link
              to="/citizen/submit"
              className="px-4 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold flex items-center gap-1 transition-colors self-end sm:self-auto"
            >
              Report to TMC <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Simplified Workflow</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">How CivicConnect Works</h3>
          <p className="text-sm text-slate-500 mt-2">End-to-end transparent grievance registration and resolution system.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Submit Grievance</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Citizen signs up, selects BMC or TMC, chooses category, enters location, and uploads photo evidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Receive Tracking ID</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              A unique complaint ID (e.g. CMP-2026-0001) is automatically generated for real-time tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center mb-4 text-sm">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Officer Assigned</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Municipal Admin routes the grievance to the respective department (Roads, Waste, Water, Drainage) and officer.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
              4
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Resolved & Feedback</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Field squad resolves the problem, updates remarks, and citizen rates the quality of service.
            </p>
          </div>
        </div>
      </section>

      {/* Complaint Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Redressal Scope</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Supported Civic Categories</h3>
          </div>
          <Link
            to="/citizen/submit"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Report an issue in any category <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 group cursor-pointer"
                onClick={() => navigate('/citizen/submit')}
              >
                <div className={`p-2.5 rounded-lg ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-snug">{cat.title}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Emergency Helpline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">24x7 Municipal Emergency Helpline Numbers</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              For critical natural hazards, waterlogging during monsoon, severe building collapse, or life-threatening civic risks, immediately reach out via emergency hotlines.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-center">
              <p className="text-[10px] text-slate-300 uppercase font-semibold">BMC Disaster Cell</p>
              <p className="text-lg font-black text-amber-400">1916</p>
            </div>

            <div className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-center">
              <p className="text-[10px] text-slate-300 uppercase font-semibold">TMC Toll Free</p>
              <p className="text-lg font-black text-teal-300">1800-222-108</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
