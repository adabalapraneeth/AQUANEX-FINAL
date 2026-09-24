import React, { useState } from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Clock, 
  MapPin, 
  Compass, 
  Layers, 
  Cpu, 
  Database, 
  BarChart3, 
  Award, 
  BellRing, 
  FileText, 
  RefreshCw, 
  Sliders, 
  ChevronRight, 
  Info, 
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';
import { 
  AssessmentResult, 
  GradeLevel, 
  OptionalSensorsState, 
  SeverityLevel, 
  TimeSeriesReading, 
  WaterParameter 
} from '../types';
import { 
  SAMPLE_SCENARIOS, 
  RawAssessmentInput, 
  performFullAssessment 
} from '../utils/waterQuality';

interface PollutionAssessmentProps {
  currentAssessment: AssessmentResult;
  history: AssessmentResult[];
  timeSeries: TimeSeriesReading[];
  onNewAssessment: (result: AssessmentResult, newTimeSeriesPoint?: TimeSeriesReading) => void;
  onUpdateAssessment: (updated: AssessmentResult) => void;
}

export const PollutionAssessment: React.FC<PollutionAssessmentProps> = ({
  currentAssessment,
  history,
  timeSeries,
  onNewAssessment,
  onUpdateAssessment
}) => {
  // Manual Input Form State
  const [outletId, setOutletId] = useState(currentAssessment.outletId || 'IND-OUTLET-704');
  const [location, setLocation] = useState(currentAssessment.location || 'North Estuary Discharge Canal - Sector 4');
  const [ph, setPh] = useState<number>(7.4);
  const [turbidity, setTurbidity] = useState<number>(7.8);
  const [temperature, setTemperature] = useState<number>(24.5);
  const [dissolvedOxygen, setDissolvedOxygen] = useState<number>(6.8);
  const [electricalConductivity, setElectricalConductivity] = useState<number>(1180);

  // Optional sensor toggles
  const [optionalSensors, setOptionalSensors] = useState<OptionalSensorsState>({
    heavyMetals: false,
    chemicalSpectrometry: false,
    emergingContaminants: false
  });

  const [heavyMetalsVal, setHeavyMetalsVal] = useState<number>(0.02);
  const [chemicalVal, setChemicalVal] = useState<number>(6.5);
  const [emergingVal, setEmergingVal] = useState<number>(0.4);

  // UI tabs & filters
  const [historyFilter, setHistoryFilter] = useState<'All' | SeverityLevel>('All');
  const [notificationSuccessModal, setNotificationSuccessModal] = useState<boolean>(false);
  const [ticketDetails, setTicketDetails] = useState<{ ticketId: string; time: string } | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AssessmentResult | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'manual' | 'presets'>('manual');

  // Trigger manual assessment
  const handleAssess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const input: RawAssessmentInput = {
      outletId: outletId.trim() || 'IND-OUTLET-MANUAL',
      location: location.trim() || 'Central Discharge Outfall',
      pH: Number(ph),
      turbidity: Number(turbidity),
      temperature: Number(temperature),
      dissolvedOxygen: Number(dissolvedOxygen),
      electricalConductivity: Number(electricalConductivity),
      optionalSensors,
      heavyMetals: optionalSensors.heavyMetals ? Number(heavyMetalsVal) : undefined,
      chemicalContaminants: optionalSensors.chemicalSpectrometry ? Number(chemicalVal) : undefined,
      emergingContaminants: optionalSensors.emergingContaminants ? Number(emergingVal) : undefined
    };

    const newResult = performFullAssessment(input);

    // Append to time-series with current time
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newPoint: TimeSeriesReading = {
      time: timeStr,
      score: newResult.score,
      outletId: newResult.outletId,
      timestampMs: Date.now()
    };

    onNewAssessment(newResult, newPoint);

    // Scroll smoothly to score dashboard
    const scoreElement = document.getElementById('score-dashboard-view');
    if (scoreElement) {
      scoreElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load a preset scenario
  const handleLoadPreset = (scenario: typeof SAMPLE_SCENARIOS[0]) => {
    setOutletId(scenario.input.outletId);
    setLocation(scenario.input.location);
    setPh(scenario.input.pH);
    setTurbidity(scenario.input.turbidity);
    setTemperature(scenario.input.temperature);
    setDissolvedOxygen(scenario.input.dissolvedOxygen);
    setElectricalConductivity(scenario.input.electricalConductivity);
    setOptionalSensors(scenario.input.optionalSensors);
    if (scenario.input.heavyMetals !== undefined) setHeavyMetalsVal(scenario.input.heavyMetals);
    if (scenario.input.chemicalContaminants !== undefined) setChemicalVal(scenario.input.chemicalContaminants);
    if (scenario.input.emergingContaminants !== undefined) setEmergingVal(scenario.input.emergingContaminants);

    const result = performFullAssessment(scenario.input);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    onNewAssessment(result, {
      time: timeStr,
      score: result.score,
      outletId: result.outletId
    });
  };

  // Notify Authorities Simulation
  const handleNotifyAuthorities = () => {
    const randomTicket = `RPCB-OUTLET-${Math.floor(100000 + Math.random() * 900000)}`;
    const timeStr = new Date().toLocaleString();
    const updated: AssessmentResult = {
      ...currentAssessment,
      authorityNotified: true,
      authorityNotificationTimestamp: timeStr,
      authorityTicketId: randomTicket
    };
    onUpdateAssessment(updated);
    setTicketDetails({ ticketId: randomTicket, time: timeStr });
    setNotificationSuccessModal(true);
  };

  // Helpers for Grade & Severity styling
  const getGradeTheme = (grade: GradeLevel) => {
    switch (grade) {
      case 'A':
        return {
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40',
          bgLight: 'bg-emerald-500/10',
          glow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]',
          strokeColor: '#10b981',
          label: 'Safe / Acceptable'
        };
      case 'B':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/40',
          bgLight: 'bg-amber-500/10',
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]',
          strokeColor: '#f59e0b',
          label: 'Caution'
        };
      case 'C':
        return {
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/40',
          bgLight: 'bg-orange-500/10',
          glow: 'shadow-[0_0_30px_rgba(249,115,22,0.35)]',
          strokeColor: '#f97316',
          label: 'High Pollution Risk'
        };
      case 'D':
      default:
        return {
          textColor: 'text-red-400',
          borderColor: 'border-red-500/50',
          bgLight: 'bg-red-500/15',
          glow: 'shadow-[0_0_35px_rgba(239,68,68,0.45)]',
          strokeColor: '#ef4444',
          label: 'Critical Pollution Level'
        };
    }
  };

  const currentTheme = getGradeTheme(currentAssessment.grade);

  // SVG circular score math
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (currentAssessment.score / 100) * circumference;

  // Filter history
  const filteredHistory = history.filter(item => {
    if (historyFilter === 'All') return true;
    return item.severity === historyFilter;
  });

  return (
    <div className="space-y-10">
      
      {/* SECTION HEADER */}
      <div className="border-b border-cyan-500/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Real-Time Industrial Outfall Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Water Pollution Assessment
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl mt-1">
            Evaluate industrial effluent discharge quality through integrated multi-parameter telemetry, 
            weighted composite pollution scoring, automated critical alerts, and regulatory dispatch protocols.
          </p>
        </div>

        {/* Quick actions: jump to manual entry or sample test */}
        <div className="flex items-center gap-2">
          <a
            href="#manual-assessment-form"
            className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-medium rounded-md transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manual Input Form</span>
          </a>
          <button
            onClick={() => handleLoadPreset(SAMPLE_SCENARIOS[0])}
            className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded-md transition-colors"
            title="Load standard 82/100 Caution demo reading"
          >
            Reset to 82/100 Demo
          </button>
        </div>
      </div>

      {/* 1. CRITICAL WATER POLLUTION ALERT (Conditionally rendered when critical threshold crossed) */}
      {currentAssessment.isCriticalAlert && (
        <div className="relative overflow-hidden rounded-xl border-2 border-red-500/70 bg-gradient-to-r from-red-950/90 via-red-900/60 to-slate-950/90 p-6 shadow-[0_0_40px_rgba(239,68,68,0.35)] animate-pulse-slow">
          <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
            <ShieldAlert className="w-44 h-44 text-red-500" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-500/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-600/30 border border-red-500 rounded-lg text-red-400">
                  <AlertOctagon className="w-7 h-7 text-red-400 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-red-600 text-white rounded">
                      VIOLATION DETECTED
                    </span>
                    <span className="text-xs font-mono text-red-300">
                      THRESHOLD EXCEEDED
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide mt-0.5">
                    🚨 CRITICAL WATER POLLUTION ALERT
                  </h2>
                </div>
              </div>

              {/* Status pill */}
              <div className="text-left sm:text-right font-mono">
                <div className="text-xs text-red-300 font-semibold">SEVERITY LEVEL</div>
                <div className="text-sm font-bold text-red-400 uppercase">
                  {currentAssessment.severity} — TIER 1 HAZARD
                </div>
              </div>
            </div>

            {/* Alert Specifics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase">Company / Outlet ID</div>
                <div className="text-white font-bold text-sm mt-0.5">{currentAssessment.outletId}</div>
              </div>

              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase">Monitoring Location</div>
                <div className="text-white font-semibold text-xs mt-0.5 line-clamp-1">{currentAssessment.location}</div>
              </div>

              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase">Incident Timestamp</div>
                <div className="text-white font-semibold text-xs mt-0.5">
                  {new Date(currentAssessment.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase">Pollution Score</div>
                <div className="text-red-400 font-extrabold text-sm mt-0.5">
                  {currentAssessment.score} / 100 (Grade {currentAssessment.grade})
                </div>
              </div>
            </div>

            {/* Abnormal Parameters and Recommended Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 bg-black/40 border border-red-500/30 rounded-lg">
                <div className="text-red-300 font-bold text-xs uppercase mb-1.5 flex items-center gap-1.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Abnormal Parameters Flagged</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentAssessment.abnormalParameters.map((paramStr, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-red-900/60 border border-red-500/50 text-red-200 text-xs font-mono rounded"
                    >
                      {paramStr}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-black/40 border border-red-500/30 rounded-lg">
                <div className="text-amber-300 font-bold text-xs uppercase mb-1.5 flex items-center gap-1.5 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandatory Emergency Action</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentAssessment.recommendedAction}
                </p>
              </div>
            </div>

            {/* Notify Authorities Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-red-500/30">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  {currentAssessment.authorityNotified ? (
                    <span className="text-emerald-400 font-mono font-medium">
                      ✓ Dispatched to State Pollution Control Board (#{currentAssessment.authorityTicketId})
                    </span>
                  ) : (
                    <span>Automated protocol mandates dispatch within 15 minutes of grade failure.</span>
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNotifyAuthorities}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Notify Authorities</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. POLLUTION DASHBOARD & COMBINED WATER QUALITY SCORE */}
      <section id="score-dashboard-view" className="space-y-6">
        
        {/* Score & Summary Banner Card */}
        <div className={`relative overflow-hidden rounded-xl border ${currentTheme.borderColor} bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl ${currentTheme.glow}`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Large Circular Progress / Grade Indicator */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="112"
                    cy="112"
                    r={circleRadius}
                    className="stroke-slate-800"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  {/* Dynamic Colored Progress */}
                  <circle
                    cx="112"
                    cy="112"
                    r={circleRadius}
                    stroke={currentTheme.strokeColor}
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Score & Grade Inside Circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400">
                    Discharge Score
                  </span>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-white">
                      {currentAssessment.score}
                    </span>
                    <span className="text-base font-mono text-slate-400">/100</span>
                  </div>
                  <div className={`text-base font-extrabold font-mono tracking-wider px-3 py-0.5 rounded-full ${currentTheme.bgLight} ${currentTheme.textColor} border ${currentTheme.borderColor}`}>
                    Grade {currentAssessment.grade}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <span className={`text-sm font-bold font-mono ${currentTheme.textColor}`}>
                  {currentAssessment.grade === 'A' && '🟢 A – Safe / Acceptable'}
                  {currentAssessment.grade === 'B' && '🟡 B – Caution'}
                  {currentAssessment.grade === 'C' && '🟠 C – High Pollution Risk'}
                  {currentAssessment.grade === 'D' && '🔴 D – Critical Pollution Level'}
                </span>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Last Assessment: {new Date(currentAssessment.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Right: Explanation, Abnormal Parameters & Recommended Action */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
                  Water Discharge Assessment Summary
                </div>
                <div className="text-lg font-bold text-white">
                  Water Quality Score: <span className="text-cyan-300 font-mono">{currentAssessment.score}/100</span>
                  <span className="text-slate-400 mx-2">|</span>
                  <span className={currentTheme.textColor}>Grade: {currentAssessment.grade} – {currentTheme.label}</span>
                </div>
              </div>

              {/* Explanation box */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Analytical Explanation</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  "{currentAssessment.explanation}"
                </p>
              </div>

              {/* Abnormal Parameters badge row */}
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-1.5">
                  Detected Parameter Anomalies:
                </div>
                {currentAssessment.abnormalParameters.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentAssessment.abnormalParameters.map((paramStr, idx) => (
                      <span 
                        key={idx}
                        className={`text-xs font-mono px-2.5 py-1 rounded border ${
                          currentAssessment.grade === 'D' ? 'bg-red-950/60 border-red-500/50 text-red-300' :
                          currentAssessment.grade === 'C' ? 'bg-orange-950/60 border-orange-500/50 text-orange-300' :
                          'bg-amber-950/60 border-amber-500/50 text-amber-300'
                        }`}
                      >
                        ⚠️ {paramStr}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded w-fit">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Zero abnormal parameters detected. Discharge stream fully compliant.</span>
                  </div>
                )}
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
                <div className="text-xs font-mono text-cyan-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recommended Action</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAssessment.recommendedAction}
                </p>
              </div>

              {/* Location & Outlet Quick Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Outlet: <strong className="text-slate-200">{currentAssessment.outletId}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate max-w-xs">{currentAssessment.location}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3. PARAMETER CARDS (Using existing AQUANEX card design) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Monitored Parameter Breakdown</h2>
              <p className="text-xs text-slate-400">
                Individual sensor measurements evaluated against national industrial effluent standards.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {currentAssessment.parameters.length} Active Sensors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {currentAssessment.parameters.map((param) => {
              const isOk = param.isNormal;
              return (
                <div
                  key={param.id}
                  className={`relative p-4 rounded-xl border backdrop-blur-md transition-all ${
                    isOk
                      ? 'bg-slate-900/70 border-cyan-500/25 hover:border-cyan-400/50'
                      : 'bg-red-950/20 border-red-500/50 hover:border-red-400'
                  }`}
                >
                  {/* Top Bar: Name & Status indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      {param.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isOk ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-red-400 shadow-[0_0_8px_#ef4444] animate-pulse'}`} />
                      <span className={`text-[10px] font-mono font-bold uppercase ${isOk ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isOk ? 'NORMAL' : 'ABNORMAL'}
                      </span>
                    </div>
                  </div>

                  {/* Value & Unit */}
                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black font-mono text-white">
                        {param.id === 'conductivity' ? param.value.toFixed(0) : param.value.toFixed(1)}
                      </span>
                      <span className="text-xs font-mono text-cyan-400">
                        {param.unit}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {param.statusText}
                    </div>
                  </div>

                  {/* Threshold Guide */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between items-center">
                    <span>Safe Range:</span>
                    <span className="text-cyan-300 font-medium">
                      {param.safeMin} – {param.safeMax} {param.unit}
                    </span>
                  </div>

                  {/* Sensor flag if optional */}
                  {param.isOptionalSensor && (
                    <div className="mt-2 text-[9px] font-mono text-teal-400 bg-teal-950/60 border border-teal-500/30 px-1.5 py-0.5 rounded text-center">
                      Verified Sensor Probe
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 4. POLLUTION GRAPH & MONITORING LOCATION (Side by side on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Pollution Level Over Time Graph */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-cyan-500/25 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Pollution Level Over Time
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Continuous telemetry trajectory (Higher score = Clean / Compliant discharge)
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                &gt;85 Safe
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                70-84 Caution
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                &lt;50 Critical
              </span>
            </div>
          </div>

          {/* SVG Interactive Time Series Chart */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#0891b2" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[40, 80, 120, 160].map((y, idx) => (
                <line
                  key={idx}
                  x1="40"
                  y1={y}
                  x2="480"
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.12)"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Critical Alert Threshold Line at score 50 (y ~ 140) */}
              <line
                x1="40"
                y1="135"
                x2="480"
                y2="135"
                stroke="rgba(239, 68, 68, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text x="44" y="130" fill="#f87171" fontSize="9" fontFamily="monospace">
                Critical Threshold (50)
              </text>

              {/* Safe Threshold Line at score 85 (y ~ 65) */}
              <line
                x1="40"
                y1="65"
                x2="480"
                y2="65"
                stroke="rgba(16, 185, 129, 0.35)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text x="44" y="60" fill="#34d399" fontSize="9" fontFamily="monospace">
                Safe Threshold (85)
              </text>

              {/* Data curve */}
              {(() => {
                const count = timeSeries.length;
                if (count === 0) return null;
                const minScore = 0;
                const maxScore = 100;

                const points = timeSeries.map((item, idx) => {
                  const x = 50 + (idx / Math.max(1, count - 1)) * 420;
                  // y inversion: score 100 => y=30, score 0 => y=190
                  const y = 190 - (item.score / maxScore) * 160;
                  return { x, y, ...item };
                });

                const linePath = points.reduce((acc, pt, idx) => {
                  return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
                }, '');

                const firstPt = points[0];
                const lastPt = points[points.length - 1];
                const areaPath = `${linePath} L ${lastPt.x},190 L ${firstPt.x},190 Z`;

                return (
                  <g>
                    {/* Area fill */}
                    <path d={areaPath} fill="url(#scoreAreaGradient)" />
                    {/* Curve line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {points.map((pt, idx) => {
                      const isCritical = pt.score < 50;
                      const isCaution = pt.score >= 50 && pt.score < 85;
                      const dotColor = isCritical ? '#ef4444' : isCaution ? '#f59e0b' : '#10b981';

                      return (
                        <g key={idx} className="cursor-pointer group">
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="5"
                            fill={dotColor}
                            stroke="#040911"
                            strokeWidth="2"
                            className="transition-all hover:r-7"
                          />
                          {/* Score label above point */}
                          <text
                            x={pt.x}
                            y={pt.y - 10}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {pt.score}
                          </text>
                          {/* Time label below x axis */}
                          <text
                            x={pt.x}
                            y="205"
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            {pt.time}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Prompt sample sequence reference readout */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
            <span>Historical Feed Readings:</span>
            <div className="flex items-center gap-2 text-cyan-300">
              {timeSeries.slice(-5).map((pt, idx) => (
                <span key={idx} className="bg-slate-950/80 px-2 py-0.5 border border-cyan-500/20 rounded">
                  {pt.time} → <strong className={pt.score < 50 ? 'text-red-400' : pt.score < 85 ? 'text-amber-400' : 'text-emerald-400'}>{pt.score}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Monitoring Location Section with Tactical Map Placeholder */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-cyan-500/25 rounded-xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Monitoring Location
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
              GPS LOCK: ACTIVE
            </span>
          </div>

          {/* Location Details Spec */}
          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded">
              <span className="text-slate-400 text-[11px]">Industrial Outlet ID:</span>
              <span className="text-cyan-300 font-bold">{currentAssessment.outletId}</span>
            </div>

            <div className="flex flex-col p-2.5 bg-slate-950/80 border border-slate-800 rounded gap-1">
              <span className="text-slate-400 text-[11px]">Monitoring Location:</span>
              <span className="text-white font-semibold truncate">{currentAssessment.location}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded">
              <span className="text-slate-400 text-[11px]">Last Updated:</span>
              <span className="text-slate-200">{new Date(currentAssessment.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Visually Attractive Tactical Map Placeholder */}
          <div className="relative h-44 rounded-lg overflow-hidden border border-cyan-500/30 bg-[#06101c]">
            {/* Topographic and sonar radar grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
            
            {/* River estuary representation */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160">
              {/* River water path */}
              <path
                d="M 0,80 Q 90,60 160,85 T 300,75 L 300,160 L 0,160 Z"
                fill="rgba(6, 182, 212, 0.12)"
              />
              <path
                d="M 0,80 Q 90,60 160,85 T 300,75"
                fill="none"
                stroke="rgba(6, 182, 212, 0.35)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Outlet discharge canal */}
              <line x1="160" y1="10" x2="160" y2="85" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
              
              {/* Radar sweep line */}
              <line x1="160" y1="85" x2="220" y2="40" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="1" className="origin-[160px_85px] animate-radar" />

              {/* Outlet Discharge Node Marker */}
              <circle cx="160" cy="85" r="14" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.6" className="animate-ping" />
              <circle cx="160" cy="85" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Radar Coordinates Overlay */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 border border-cyan-500/30 rounded text-[9px] font-mono text-cyan-300 backdrop-blur-sm">
              SECTOR 4 · 18°31'14" N, 73°51'24" E
            </div>

            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 border border-slate-700 rounded text-[9px] font-mono text-slate-300">
              Basin Flow: 4.8 m³/s
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-500/40 text-[9px] font-mono text-cyan-200 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>OUTLET PIN #704</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-sans italic text-center">
            *Tactical geospatial sensor array view. Real-time satellite telemetry mapping.
          </div>
        </div>

      </div>

      {/* 5. PROCESS FLOW SECTION */}
      <div className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>AQUANEX Pollution Assessment Architecture &amp; Workflow</span>
            </h3>
            <p className="text-xs text-slate-400">
              End-to-end telemetry pipeline from physical probes to regulatory dispatch.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">7 Stage Systematic Protocol</span>
        </div>

        {/* Process Flow Cards with Flow Connectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          
          {/* Step 1: Sensors */}
          <div className="p-3 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 1</div>
            <div className="text-xs font-bold text-white mt-0.5">Sensors</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">pH, DO, EC, Turbidity</div>
          </div>

          {/* Step 2: Data Collection */}
          <div className="p-3 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 2</div>
            <div className="text-xs font-bold text-white mt-0.5">Data Collection</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">IoT Edge Telemetry</div>
          </div>

          {/* Step 3: Parameter Analysis */}
          <div className="p-3 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 3</div>
            <div className="text-xs font-bold text-white mt-0.5">Parameter Analysis</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">Threshold Verification</div>
          </div>

          {/* Step 4: Combined Score */}
          <div className="p-3 bg-cyan-950/60 border border-cyan-500/50 rounded-lg text-center relative group hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-300 uppercase font-bold">Step 4</div>
            <div className="text-xs font-bold text-white mt-0.5">Combined Score</div>
            <div className="text-[10px] text-cyan-200 mt-1 line-clamp-2">0 - 100 Index</div>
          </div>

          {/* Step 5: Grade */}
          <div className="p-3 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 5</div>
            <div className="text-xs font-bold text-white mt-0.5">Grade</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">🟢 A / 🟡 B / 🟠 C / 🔴 D</div>
          </div>

          {/* Step 6: Pollution Alert */}
          <div className="p-3 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-2">
              <BellRing className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-red-400 uppercase font-bold">Step 6</div>
            <div className="text-xs font-bold text-white mt-0.5">Pollution Alert</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">Critical Trigger</div>
          </div>

          {/* Step 7: Authority Notification */}
          <div className="p-3 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
              <Send className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 7</div>
            <div className="text-xs font-bold text-white mt-0.5">Authority Dispatch</div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">State Board Report</div>
          </div>

        </div>
      </div>

      {/* 6. MANUAL DATA INPUT FORM & PRESET BENCHMARKS */}
      <section id="manual-assessment-form" className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">
                Manual Water Quality Data Entry
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              For testing and software prototype calibration when physical hardware sensors are not directly wired.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveFormTab('manual')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeFormTab === 'manual'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom Input
            </button>
            <button
              type="button"
              onClick={() => setActiveFormTab('presets')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeFormTab === 'presets'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Demo Presets ({SAMPLE_SCENARIOS.length})
            </button>
          </div>
        </div>

        {/* Demo Presets Grid if tab is presets */}
        {activeFormTab === 'presets' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_SCENARIOS.map((sc, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{sc.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{sc.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset(sc)}
                    className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold rounded transition-colors shrink-0"
                  >
                    Load &amp; Assess
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                  <div>pH: <strong className="text-white">{sc.input.pH}</strong></div>
                  <div>Turbidity: <strong className="text-white">{sc.input.turbidity} NTU</strong></div>
                  <div>Temp: <strong className="text-white">{sc.input.temperature} °C</strong></div>
                  <div>DO: <strong className="text-white">{sc.input.dissolvedOxygen} mg/L</strong></div>
                  <div>EC: <strong className="text-white">{sc.input.electricalConductivity} µS</strong></div>
                  <div>Sensors: <strong className="text-cyan-300">{sc.input.optionalSensors.heavyMetals ? 'HM Probe On' : 'Standard'}</strong></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleAssess} className="space-y-6">
            
            {/* Top Row: Outlet ID and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Industrial Outlet ID <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={outletId}
                  onChange={(e) => setOutletId(e.target.value)}
                  placeholder="e.g. IND-OUTLET-704"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-sm text-white font-mono outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Monitoring Location <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. North Estuary Discharge Canal - Sector 4"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-sm text-white outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Core 5 Parameters Grid */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
                <span>Standard Baseline Water Quality Parameters</span>
                <span className="text-slate-400 text-[11px]">Normal ranges enforced</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* pH */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-200">pH Level</span>
                    <span className="text-[10px] font-mono text-cyan-400">6.5 - 8.5 Safe</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={ph}
                    onChange={(e) => setPh(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm font-mono text-white"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Scale 0-14 (7.0 Neutral)</div>
                </div>

                {/* Turbidity */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-200">Turbidity (NTU)</span>
                    <span className="text-[10px] font-mono text-cyan-400">&lt; 5.0 NTU</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={turbidity}
                    onChange={(e) => setTurbidity(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm font-mono text-white"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Nephelometric Turbidity</div>
                </div>

                {/* Temperature */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-200">Temperature (°C)</span>
                    <span className="text-[10px] font-mono text-cyan-400">15 - 30 °C</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="70"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm font-mono text-white"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Thermal discharge index</div>
                </div>

                {/* Dissolved Oxygen */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-200">Dissolved O₂ (DO)</span>
                    <span className="text-[10px] font-mono text-cyan-400">&gt; 5.0 mg/L</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={dissolvedOxygen}
                    onChange={(e) => setDissolvedOxygen(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm font-mono text-white"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Aquatic respiration health</div>
                </div>

                {/* Electrical Conductivity */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-200">Conductivity (EC)</span>
                    <span className="text-[10px] font-mono text-cyan-400">100 - 1000 µS</span>
                  </div>
                  <input
                    type="number"
                    step="10"
                    min="0"
                    max="8000"
                    value={electricalConductivity}
                    onChange={(e) => setElectricalConductivity(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm font-mono text-white"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">µS/cm dissolved ions</div>
                </div>

              </div>
            </div>

            {/* Optional Sensor-Based Parameters (Adhering to strict prompt constraint) */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-mono font-bold uppercase text-white">
                      Specialized Hardware Sensor Probes (Optional)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    IMPORTANT: Only enable chemical or contaminant parameters when the physical sensor hardware is installed.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-teal-300 bg-teal-950/80 border border-teal-500/30 px-2 py-1 rounded">
                  Strict Sensor Verification Policy
                </div>
              </div>

              {/* Toggles & Optional Parameter Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Heavy Metals Sensor */}
                <div className={`p-3 rounded-lg border transition-colors ${
                  optionalSensors.heavyMetals ? 'bg-slate-900 border-teal-500/50' : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}>
                  <label className="flex items-center justify-between cursor-pointer mb-2">
                    <span className="text-xs font-semibold text-slate-200">Heavy Metal Probe</span>
                    <input
                      type="checkbox"
                      checked={optionalSensors.heavyMetals}
                      onChange={(e) => setOptionalSensors({ ...optionalSensors, heavyMetals: e.target.checked })}
                      className="accent-teal-400 w-4 h-4"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mb-2">ISE probe detecting Lead, Cadmium, Chromium.</p>
                  {optionalSensors.heavyMetals ? (
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Concentration (ppm)</span>
                        <span className="text-teal-400">&lt; 0.05 Safe</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={heavyMetalsVal}
                        onChange={(e) => setHeavyMetalsVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white"
                      />
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-slate-400 italic">
                      Hardware Sensor Offline / Not Installed
                    </div>
                  )}
                </div>

                {/* 2. Chemical Spectrometry Sensor */}
                <div className={`p-3 rounded-lg border transition-colors ${
                  optionalSensors.chemicalSpectrometry ? 'bg-slate-900 border-teal-500/50' : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}>
                  <label className="flex items-center justify-between cursor-pointer mb-2">
                    <span className="text-xs font-semibold text-slate-200">UV-Vis Spectrometer</span>
                    <input
                      type="checkbox"
                      checked={optionalSensors.chemicalSpectrometry}
                      onChange={(e) => setOptionalSensors({ ...optionalSensors, chemicalSpectrometry: e.target.checked })}
                      className="accent-teal-400 w-4 h-4"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mb-2">Analyzes industrial COD, Phenols &amp; Hydrocarbons.</p>
                  {optionalSensors.chemicalSpectrometry ? (
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Chemical COD (mg/L)</span>
                        <span className="text-teal-400">&lt; 15.0 Safe</span>
                      </div>
                      <input
                        type="number"
                        step="0.5"
                        value={chemicalVal}
                        onChange={(e) => setChemicalVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white"
                      />
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-slate-400 italic">
                      Hardware Sensor Offline / Not Installed
                    </div>
                  )}
                </div>

                {/* 3. Emerging Contaminants Sensor */}
                <div className={`p-3 rounded-lg border transition-colors ${
                  optionalSensors.emergingContaminants ? 'bg-slate-900 border-teal-500/50' : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}>
                  <label className="flex items-center justify-between cursor-pointer mb-2">
                    <span className="text-xs font-semibold text-slate-200">Fluorometric Sensor</span>
                    <input
                      type="checkbox"
                      checked={optionalSensors.emergingContaminants}
                      onChange={(e) => setOptionalSensors({ ...optionalSensors, emergingContaminants: e.target.checked })}
                      className="accent-teal-400 w-4 h-4"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mb-2">Laser fluorometer detecting Surfactants &amp; PFAS.</p>
                  {optionalSensors.emergingContaminants ? (
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Surfactants / PFAS (µg/L)</span>
                        <span className="text-teal-400">&lt; 1.0 Safe</span>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        value={emergingVal}
                        onChange={(e) => setEmergingVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white"
                      />
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-slate-400 italic">
                      Hardware Sensor Offline / Not Installed
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Submit Assess Water Quality Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold font-mono text-sm tracking-wider uppercase rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Assess Water Quality</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}
      </section>

      {/* 7. ALERT HISTORY SECTION */}
      <section className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">
                Alert History &amp; Discharge Log
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Historical repository of all industrial water discharge evaluations and regulatory notifications.
            </p>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg text-xs font-mono overflow-x-auto">
            {(['All', 'Safe', 'Caution', 'High Risk', 'Critical'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setHistoryFilter(sev)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  historyFilter === sev
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev === 'Safe' && '🟢 '}
                {sev === 'Caution' && '🟡 '}
                {sev === 'High Risk' && '🟠 '}
                {sev === 'Critical' && '🔴 '}
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* History Table / Cards */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-mono">
            No discharge logs found matching severity filter "{historyFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Date &amp; Time</th>
                  <th className="py-3 px-3">Outlet ID</th>
                  <th className="py-3 px-3">Score &amp; Grade</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Abnormal Parameters</th>
                  <th className="py-3 px-3">Regulatory Status</th>
                  <th className="py-3 px-3 text-right">Audit Sheet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredHistory.map((item) => {
                  const isCrit = item.severity === 'Critical';
                  const isHigh = item.severity === 'High Risk';
                  const isCaut = item.severity === 'Caution';
                  const isSafe = item.severity === 'Safe';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-white font-bold whitespace-nowrap">
                        {item.outletId}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-white text-sm">{item.score}</span>
                        <span className="text-slate-400 text-[10px]">/100</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.grade === 'A' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                          item.grade === 'B' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                          item.grade === 'C' ? 'bg-orange-950 text-orange-400 border border-orange-500/30' :
                          'bg-red-950 text-red-400 border border-red-500/40'
                        }`}>
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          isSafe ? 'text-emerald-400' :
                          isCaut ? 'text-amber-400' :
                          isHigh ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {isSafe && '🟢 Safe'}
                          {isCaut && '🟡 Caution'}
                          {isHigh && '🟠 High Risk'}
                          {isCrit && '🔴 Critical'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {item.abnormalParameters.length > 0 ? (
                          <span className="text-slate-300 truncate max-w-xs block" title={item.abnormalParameters.join(', ')}>
                            {item.abnormalParameters.join(', ')}
                          </span>
                        ) : (
                          <span className="text-emerald-400/80">None (Compliant)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {item.authorityNotified ? (
                          <span className="text-[10px] text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded">
                            Dispatched #{item.authorityTicketId?.slice(-6)}
                          </span>
                        ) : isCrit ? (
                          <span className="text-[10px] text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded animate-pulse">
                            Action Pending
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Logged Normal</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedAuditLog(item)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded transition-colors text-[11px]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* AUTHORITY NOTIFICATION SUCCESS MODAL */}
      {notificationSuccessModal && ticketDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-2 border-emerald-500/70 rounded-xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Authority Dispatch Successful</h3>
                <div className="text-xs text-emerald-400 font-mono">Discharge Alert Forwarded</div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
              <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                “Pollution report successfully submitted to the concerned authority.”
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatch Ticket ID:</span>
                <span className="text-cyan-300 font-bold">{ticketDetails.ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Agency:</span>
                <span className="text-white">State Pollution Control Board (SPCB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Submission Timestamp:</span>
                <span className="text-white">{ticketDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Outlet Code:</span>
                <span className="text-white">{currentAssessment.outletId}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              *Prototype simulation: In production deployment, this triggers an encrypted webhook to the government environmental compliance API.
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setNotificationSuccessModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono rounded-lg transition-colors"
              >
                Close Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOG DETAILS MODAL */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">OUTLET AUDIT RECORD</span>
                <h3 className="text-lg font-bold text-white">{selectedAuditLog.outletId}</h3>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>Location: <span className="text-white">{selectedAuditLog.location}</span></div>
              <div>Timestamp: <span className="text-white">{new Date(selectedAuditLog.timestamp).toLocaleString()}</span></div>
              <div>Combined Score: <strong className="text-cyan-300">{selectedAuditLog.score}/100</strong></div>
              <div>Grade: <strong className="text-amber-300">{selectedAuditLog.grade} ({selectedAuditLog.severity})</strong></div>
            </div>

            <div>
              <div className="text-xs font-mono uppercase text-slate-400 mb-2">Evaluated Parameters:</div>
              <div className="space-y-1.5">
                {selectedAuditLog.parameters.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-950/70 border border-slate-800/80 rounded">
                    <span className="text-slate-300 font-semibold">{p.name} ({p.symbol})</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white">{p.value} {p.unit}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${p.isNormal ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                        {p.isNormal ? 'OK' : 'ABNORMAL'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs">
              <div className="text-slate-400 font-mono uppercase mb-1">Recommended Remediation:</div>
              <div className="text-slate-200">{selectedAuditLog.recommendedAction}</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono rounded"
              >
                Dismiss Audit View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
