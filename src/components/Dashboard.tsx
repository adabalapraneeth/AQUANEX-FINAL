import React from 'react';
import { 
  Activity, 
  Recycle, 
  Award, 
  AlertOctagon, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Droplets, 
  MapPin, 
  Radio, 
  Sliders, 
  CheckCircle2, 
  Clock,
  Sun,
  Building2,
  Users
} from 'lucide-react';
import { AssessmentResult, Certificate, EcoEvent, ACWaterBatch, UserProfile } from '../types';
import { NavTab } from './Navbar';

interface DashboardProps {
  currentAssessment: AssessmentResult;
  history: AssessmentResult[];
  acBatches: ACWaterBatch[];
  events: EcoEvent[];
  certificates: Certificate[];
  user: UserProfile;
  onNavigate: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentAssessment,
  history,
  acBatches,
  events,
  certificates,
  user,
  onNavigate
}) => {
  const totalACReclaimed = acBatches.reduce((acc, b) => acc + b.quantityLiters, 0);
  const criticalCount = history.filter((h) => h.isCriticalAlert || h.grade === 'D').length;
  const averageScore = Math.round(history.reduce((acc, h) => acc + h.score, 0) / Math.max(1, history.length));

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Operator Banner */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/25 rounded-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Telemetry Center · Active Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            {user.role} · {user.organization}
          </p>
        </div>

        {/* Quick Launch Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('pollution')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs font-mono rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>Assess Discharge Outlet</span>
          </button>
          
          <button
            onClick={() => onNavigate('solar')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Solar Treatment (200k+ m³)</span>
          </button>

          <button
            onClick={() => onNavigate('org-portal')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Org Portal</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Discharge Quality Index */}
        <div 
          onClick={() => onNavigate('pollution')}
          className="p-5 bg-slate-900/80 border border-cyan-500/25 rounded-xl backdrop-blur-md cursor-pointer hover:border-cyan-400 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Discharge Index</span>
            <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {currentAssessment.score}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 100</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              currentAssessment.grade === 'A' ? 'bg-emerald-950 text-emerald-400' :
              currentAssessment.grade === 'B' ? 'bg-amber-950 text-amber-400' :
              currentAssessment.grade === 'C' ? 'bg-orange-950 text-orange-400' : 'bg-red-950 text-red-400'
            }`}>
              Grade {currentAssessment.grade}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 truncate">
            {currentAssessment.outletId} ({currentAssessment.severity})
          </div>
        </div>

        {/* 2. Solar Treatment Output (Demonstration) */}
        <div 
          onClick={() => onNavigate('solar')}
          className="p-5 bg-slate-900/80 border border-amber-500/25 rounded-xl backdrop-blur-md cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Solar Treated Water</span>
            <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white">
              200k+
            </span>
            <span className="text-xs font-mono text-amber-300">m³/day</span>
          </div>
          <div className="text-[11px] text-amber-400/90 mt-2">
            100+ Villages Supported (Demo)
          </div>
        </div>

        {/* 3. AC Condensate Reclaimed */}
        <div 
          onClick={() => onNavigate('ac-reuse')}
          className="p-5 bg-slate-900/80 border border-cyan-500/25 rounded-xl backdrop-blur-md cursor-pointer hover:border-teal-400 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>AC Water Reclaimed</span>
            <Recycle className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white">
              {totalACReclaimed.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-teal-300">Liters</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {acBatches.length} HVAC Batches Recovered
          </div>
        </div>

        {/* 4. Critical Discharge Violations */}
        <div 
          onClick={() => onNavigate('pollution')}
          className="p-5 bg-slate-900/80 border border-cyan-500/25 rounded-xl backdrop-blur-md cursor-pointer hover:border-red-400 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Critical Pollution Incidents</span>
            <AlertOctagon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono ${criticalCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {criticalCount}
            </span>
            <span className="text-xs font-mono text-slate-400">Flagged</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {criticalCount > 0 ? 'Action Protocol Engaged' : 'All Outfalls in Compliance'}
          </div>
        </div>

        {/* 5. Verified Stewardship Certificates */}
        <div 
          onClick={() => onNavigate('events')}
          className="p-5 bg-slate-900/80 border border-cyan-500/25 rounded-xl backdrop-blur-md cursor-pointer hover:border-cyan-400 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Accredited Certificates</span>
            <Award className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {certificates.length}
            </span>
            <span className="text-xs font-mono text-slate-400">Credentials</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {events.filter(e => e.userJoined).length} Stewardship Events Active
          </div>
        </div>

      </div>

      {/* RECENT OUTLET ASSESSMENTS TICKER & QUICK INSPECT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Recent Discharge Audits */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-cyan-500/25 rounded-xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Recent Industrial Discharge Stream Audits
              </h3>
            </div>
            <button
              onClick={() => onNavigate('pollution')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Assessment Tool</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {history.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{item.outletId}</strong>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.grade === 'A' ? 'bg-emerald-950 text-emerald-400' :
                      item.grade === 'B' ? 'bg-amber-950 text-amber-400' :
                      item.grade === 'C' ? 'bg-orange-950 text-orange-400' : 'bg-red-950 text-red-400'
                    }`}>
                      Grade {item.grade}
                    </span>
                    <span className="text-slate-500 text-[10px]">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] truncate max-w-md">
                    {item.location}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">{item.score} / 100</div>
                    <div className="text-[10px] text-slate-400 uppercase">{item.severity}</div>
                  </div>
                  <button
                    onClick={() => onNavigate('pollution')}
                    className="px-2.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded text-[11px]"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Solar & AC Condensate Recovery Snapshot */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-cyan-500/25 rounded-xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Clean Hydro Impact
              </h3>
            </div>
            <button
              onClick={() => onNavigate('solar')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Solar Treatment Capacity</div>
              <div className="text-white font-bold">200,000+ m³ / day treated</div>
              <div className="text-amber-300 text-[11px] font-mono">1.2M m³/day projected by 2035</div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-mono">AC Condensate Reclaim</div>
              <div className="text-white font-bold">{totalACReclaimed.toLocaleString()} L reclaimed</div>
              <div className="text-teal-400 text-[11px] font-mono">{(totalACReclaimed * 0.0003).toFixed(2)} kg CO₂e offset</div>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-center">
              <span className="text-[11px] font-mono text-cyan-300 block mb-2">Switch to Organization Oversight?</span>
              <button
                onClick={() => onNavigate('org-portal')}
                className="w-full py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 rounded text-xs font-mono font-bold"
              >
                Open Organization Dashboard
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
