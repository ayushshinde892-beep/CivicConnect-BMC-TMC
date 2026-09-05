import React from 'react';
import { Building2, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Portal Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CivicConnect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified Civic Grievance Redressal and Municipal Complaint Management Platform for Brihanmumbai Municipal Corporation (BMC) & Thane Municipal Corporation (TMC).
            </p>
            <div className="text-[11px] text-slate-500">
              A Full Stack Java Programming (FSJP) Mini Project.
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home Portal</Link></li>
              <li><Link to="/track" className="hover:text-blue-400 transition-colors">Track Complaint Status</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Citizen Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register Citizen Account</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Municipal Officer Login</Link></li>
            </ul>
          </div>

          {/* Col 3: Municipal Corporations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Municipal Bodies</h4>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <p className="font-semibold text-white">BMC - Brihanmumbai Municipal Corp</p>
                <p className="text-[11px] text-slate-400">HQ: Mahapalika Marg, Fort, Mumbai 400001</p>
                <p className="text-[11px] text-blue-400 mt-1">Disaster Helpline: 1916</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <p className="font-semibold text-white">TMC - Thane Municipal Corporation</p>
                <p className="text-[11px] text-slate-400">HQ: Mahapalika Bhavan, Chandanwadi, Thane 400602</p>
                <p className="text-[11px] text-teal-400 mt-1">Toll Free: 1800-222-108</p>
              </div>
            </div>
          </div>

          {/* Col 4: Key Municipal Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Top Redressal Categories</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Potholes & Roads</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Garbage & Waste</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Water Supply</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Drainage & Sewage</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Streetlights</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Sanitation</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CivicConnect. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Spring Boot 3, React & MySQL for College Engineering Project
          </p>
        </div>
      </div>
    </footer>
  );
}
