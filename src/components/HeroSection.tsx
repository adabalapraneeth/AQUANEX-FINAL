import React from 'react';
import { 
  Activity, 
  Recycle, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Radio, 
  ChevronRight,
  Droplets,
  Sun,
  Building2,
  Users
} from 'lucide-react';
import { EarthAnimation } from './EarthAnimation';
import { NavTab } from './Navbar';
import { AssessmentResult } from '../types';

interface HeroSectionProps {
  onSelectTab: (tab: NavTab) => void;
  currentAssessment: AssessmentResult;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab, currentAssessment }) => {
  return (
    <div className="space-y-16">
      
      {/* HERO SECTION: Text + 3D Earth Globe Canvas */}
      <section className="relative pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading, Value Prop, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/70 border border-cyan-500/30 rounded-full text-xs font-mono text-cyan-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>AQUANEX – Smart Water. Sustainable Future.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Decentralized <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300">
                Water Pollution Intelligence
              </span> <br />
              &amp; Solar-Powered Reclaim.
            </h1>

            {/* Subheading */}
            <p className="text-base text-slate-300 leading-relaxed max-w-xl">
              Empowering factories, environmental regulators, and eco-stewards with real-time 
              industrial discharge water quality scoring, automated critical alerts, solar-powered community purification, and closed-loop AC condensate reclaim.
            </p>

            {/* Live Assessment Ticker Badge */}
            <div className="p-3.5 bg-slate-900/80 border border-cyan-500/30 rounded-xl backdrop-blur-md flex items-center justify-between gap-3 max-w-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  currentAssessment.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  currentAssessment.grade === 'B' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  currentAssessment.grade === 'C' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                  'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Current Industrial Outfall Telemetry</div>
                  <div className="text-xs font-bold text-white">
                    {currentAssessment.outletId}: <span className="font-mono text-cyan-300">{currentAssessment.score}/100</span> (Grade {currentAssessment.grade})
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectTab('pollution')}
                className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold rounded-lg border border-cyan-500/40 transition-colors flex items-center gap-1 shrink-0"
              >
                <span>Inspect</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('pollution')}
                className="px-5 py-3 bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 active:scale-95"
              >
                <Activity className="w-4 h-4" />
                <span>Pollution Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('solar')}
                className="px-5 py-3 bg-gradient-to-r from-amber-500/20 to-teal-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Solar Treatment Impact</span>
              </button>

              <button
                onClick={() => onSelectTab('ac-reuse')}
                className="px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-cyan-500/30 font-semibold font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
              >
                <Recycle className="w-4 h-4 text-teal-400" />
                <span>AC Water Reclaim</span>
              </button>
            </div>

          </div>

          {/* Right Column: Earth Animation Interactive Sphere */}
          <div className="lg:col-span-5 flex justify-center">
            <EarthAnimation 
              onSelectStation={(station) => {
                // When clicking a globe beacon, user can view outfall
              }}
            />
          </div>

        </div>
      </section>

      {/* CORE PLATFORM SOLUTIONS (5 Pillars as requested in Section 19) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
            Integrated Water Management Ecosystem
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Five Core Solutions in One Platform
          </h2>
          <p className="text-xs text-slate-400">
            From early industrial contamination warnings to solar community purification and verifiable eco-stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Solution 1: Smart Water Pollution Assessment */}
          <div 
            onClick={() => onSelectTab('pollution')}
            className="p-6 bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl backdrop-blur-md space-y-4 cursor-pointer group transition-all relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.15)]"
          >
            <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded">
              FEATURE
            </div>

            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                🌊 Smart Pollution Assessment
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Detect abnormal effluent early. Composite 0–100 discharge quality score, circular Grade A–D indicator, parameter cards, time-series graph, and automated critical alerts.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <span>Launch Assessment Suite</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Solution 2: Impact of Solar Water Treatment */}
          <div 
            onClick={() => onSelectTab('solar')}
            className="p-6 bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 rounded-2xl backdrop-blur-md space-y-4 cursor-pointer group transition-all relative overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.15)]"
          >
            <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 bg-gradient-to-r from-amber-500 to-teal-400 text-slate-950 font-bold rounded">
              NEW IMPACT
            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Sun className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                🌞 Solar Water Treatment
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Solar hydro-purification delivering 200,000+ m³ daily water treated. Interactive India map (6 states), water use distribution donut, and 2020–2035 capacity growth graph.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <span>View Solar Impact &amp; Visualizations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Solution 3: AC Condensate Water Reuse */}
          <div 
            onClick={() => onSelectTab('ac-reuse')}
            className="p-6 bg-slate-900/80 border border-teal-500/30 hover:border-teal-400 rounded-2xl backdrop-blur-md space-y-4 cursor-pointer group transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Recycle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                💧 AC Water Reuse
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                “Convert AC water into pure and useful water.” 6-step recovery pipeline with quality analysis (pH, TDS, turbidity) for plant irrigation, cleaning, and flushing.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-teal-400">
              <span>Manage AC Reclaim Batches</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Solution 4: Environmental Events */}
          <div 
            onClick={() => onSelectTab('events')}
            className="p-6 bg-slate-900/80 border border-sky-500/30 hover:border-sky-400 rounded-2xl backdrop-blur-md space-y-4 cursor-pointer group transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                🌱 Environmental Cleanup Events
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Community water drives and industrial effluent audits. Join events, start participation, record telemetry, and submit for organization verification.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-sky-400">
              <span>Browse Active Cleanup Events</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Solution 5: Certificates & Verification */}
          <div 
            onClick={() => onSelectTab('events')}
            className="p-6 bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl backdrop-blur-md space-y-4 cursor-pointer group transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                🏆 Verified Digital Certificates
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cryptographically authenticated credentials awarded upon organizational approval. Full credential dossier, audit hash, and print/download ready.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <span>Inspect Certificate Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bonus Solution: Organization Governance Portal */}
          <div 
            onClick={() => onSelectTab('org-portal')}
            className="p-6 bg-slate-900/80 border border-teal-500/30 hover:border-teal-400 rounded-2xl backdrop-blur-md space-y-4 cursor-pointer group transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                🏢 Organization Dashboard
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authorized regulatory portal to create events, verify participants, approve certificates, review discharge audits, and track authority dispatches.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-teal-400">
              <span>Open Governance Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
