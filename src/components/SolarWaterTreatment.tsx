import React, { useState } from 'react';
import { 
  Sun, 
  Droplets, 
  Wheat, 
  Home, 
  TrendingUp, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Info, 
  ArrowRight,
  Filter,
  Eye,
  Building2,
  Users
} from 'lucide-react';
import { SolarPlantLocation } from '../types';

const SAMPLE_PLANTS: SolarPlantLocation[] = [
  {
    id: 'SOLAR-RJ-01',
    name: 'Thar Solar Desalination & Brackish Purifier',
    state: 'Rajasthan',
    coordinates: { xPercent: 24, yPercent: 32 },
    dailyCapacityM3: 45000,
    technology: 'Solar PV Electrodialysis Reversal (EDR)',
    villagesCovered: 24,
    status: 'Operational Demo'
  },
  {
    id: 'SOLAR-GJ-02',
    name: 'Kutch Solar Coastal Ultrafiltration Array',
    state: 'Gujarat',
    coordinates: { xPercent: 18, yPercent: 44 },
    dailyCapacityM3: 50000,
    technology: 'Solar Hybrid Nanofiltration & UV-C',
    villagesCovered: 28,
    status: 'Operational Demo'
  },
  {
    id: 'SOLAR-MH-03',
    name: 'Marathwada Solar Drought-Resilience Plant',
    state: 'Maharashtra',
    coordinates: { xPercent: 34, yPercent: 55 },
    dailyCapacityM3: 35000,
    technology: 'Solar Powered Multi-Stage RO & Remineralization',
    villagesCovered: 19,
    status: 'Pilot Stage'
  },
  {
    id: 'SOLAR-AP-04',
    name: 'Rayalaseema Solar Aquifer Treatment Bank',
    state: 'Andhra Pradesh',
    coordinates: { xPercent: 44, yPercent: 70 },
    dailyCapacityM3: 28000,
    technology: 'Solar Gravity-Fed Ceramic Membrane System',
    villagesCovered: 15,
    status: 'Operational Demo'
  },
  {
    id: 'SOLAR-TN-05',
    name: 'Ramanathapuram Solar Fluoride Mitigation Center',
    state: 'Tamil Nadu',
    coordinates: { xPercent: 40, yPercent: 86 },
    dailyCapacityM3: 32000,
    technology: 'Solar Activated Alumina Defluoridation',
    villagesCovered: 17,
    status: 'Operational Demo'
  },
  {
    id: 'SOLAR-UP-06',
    name: 'Bundelkhand Solar Community Water Sanctum',
    state: 'Uttar Pradesh',
    coordinates: { xPercent: 48, yPercent: 34 },
    dailyCapacityM3: 25000,
    technology: 'Solar Direct-Drive Multi-Barrier Filter',
    villagesCovered: 14,
    status: 'Pilot Stage'
  }
];

// Capacity Growth Points: 2020: 150,000 m³/day to 2035: 1.2 million m³/day
const CAPACITY_GROWTH_DATA = [
  { year: '2020', capacityM3: 150000, label: '150,000 m³/d (Baseline)' },
  { year: '2023', capacityM3: 200000, label: '200,000 m³/d (Demonstrated)' },
  { year: '2026', capacityM3: 380000, label: '380,000 m³/d (Expansion)' },
  { year: '2029', capacityM3: 620000, label: '620,000 m³/d (Regional Scale)' },
  { year: '2032', capacityM3: 910000, label: '910,000 m³/d (Grid Integration)' },
  { year: '2035', capacityM3: 1200000, label: '1.2M m³/d (Projected Target)' }
];

export const SolarWaterTreatment: React.FC = () => {
  const [selectedPlant, setSelectedPlant] = useState<SolarPlantLocation>(SAMPLE_PLANTS[0]);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Donut chart math (Drinking 40%, Agriculture 45%, Household 15%)
  const distributionData = [
    { id: 'agri', label: 'Agriculture', percent: 45, color: '#14b8a6', glow: 'rgba(20, 184, 166, 0.5)', icon: Wheat, desc: 'Crop irrigation, livestock hydration & micro-drip networks' },
    { id: 'drinking', label: 'Drinking', percent: 40, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)', icon: Droplets, desc: 'WHO-standard potability for homes, rural schools & health clinics' },
    { id: 'household', label: 'Household', percent: 15, color: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.5)', icon: Home, desc: 'Sanitation, washing, community bathing & hygiene stations' }
  ];

  const donutRadius = 70;
  const donutCircumference = 2 * Math.PI * donutRadius;

  // Calculate cumulative stroke dashes
  let accumulatedPercent = 0;
  const donutSlices = distributionData.map((slice) => {
    const strokeDasharray = `${(slice.percent / 100) * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * donutCircumference);
    accumulatedPercent += slice.percent;
    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div className="space-y-10">
      
      {/* 1. SECTION HEADER WITH INTRO TEXT & DISCLAIMER BADGE */}
      <div className="border-b border-cyan-500/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-1">
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Clean Energy Hydro-Infrastructures</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Impact of Solar Water Treatment</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full">
              Solar Hydro-Purification
            </span>
          </h1>
          
          {/* Required Intro Text */}
          <p className="text-sm text-slate-200 max-w-3xl mt-2 leading-relaxed font-sans">
            “Our solar water treatment plants are not just ideas — they deliver measurable results. Every drop purified by sunlight supports communities, farms, and households across India.”
          </p>
        </div>

        {/* Prominent Projected / Demonstration Data Banner */}
        <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-left md:text-right shrink-0">
          <div className="flex items-center md:justify-end gap-1.5 text-[11px] font-mono font-bold text-amber-300">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Projected / Demonstration Data</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-xs">
            Simulation &amp; pilot deployment metrics modeled for off-grid decentralized solar plants across water-stressed regions.
          </div>
        </div>
      </div>

      {/* 2. IMPACT STATISTICS (Animated counters / Infographic cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Key Impact Metrics &amp; Operational Capacity
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 bg-cyan-950/70 border border-cyan-500/30 rounded">
            Projected / Demonstration Data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Stat 1: Daily Water Treated */}
          <div className="relative p-5 bg-slate-900/80 border border-cyan-500/25 hover:border-cyan-400/50 rounded-xl backdrop-blur-md transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Droplets className="w-20 h-20 text-cyan-400" />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-cyan-300 uppercase">Daily Water Treated</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white tracking-tight">
              200,000+ <span className="text-sm font-normal text-cyan-300">m³</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 font-sans">
              Continuous solar-powered filtration output without carbon footprint.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-400">
              ⚡ 100% Sunlight Powered
            </div>
          </div>

          {/* Stat 2: Agriculture Supply */}
          <div className="relative p-5 bg-slate-900/80 border border-teal-500/25 hover:border-teal-400/50 rounded-xl backdrop-blur-md transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wheat className="w-20 h-20 text-teal-400" />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-teal-300 uppercase">Agriculture Supply</span>
              <Wheat className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              30,000–120,000 <span className="text-xs font-normal text-teal-300">L/day</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 font-sans">
              Per solar water pump for precision drip crop irrigation and livestock.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-teal-400">
              🌾 High-Yield Agro Support
            </div>
          </div>

          {/* Stat 3: Communities Served */}
          <div className="relative p-5 bg-slate-900/80 border border-sky-500/25 hover:border-sky-400/50 rounded-xl backdrop-blur-md transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Home className="w-20 h-20 text-sky-400" />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-sky-300 uppercase">Communities Served</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white tracking-tight">
              100+ <span className="text-sm font-normal text-sky-300">villages</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 font-sans">
              Remote habitations provided with reliable, pathogen-free water access.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-sky-400">
              🛡️ Zero Waterborne Illness Goal
            </div>
          </div>

          {/* Stat 4: Future Potential */}
          <div className="relative p-5 bg-slate-900/80 border border-amber-500/25 hover:border-amber-400/50 rounded-xl backdrop-blur-md transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-20 h-20 text-amber-400" />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-amber-300 uppercase">Future Potential</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              1.2 million <span className="text-xs font-normal text-amber-300">m³/day</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 font-sans">
              Scaling milestone roadmap projected by 2035 across Indian watersheds.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-400">
              📈 Target Horizon: 2035
            </div>
          </div>

        </div>
      </div>

      {/* 3. THREE VISUALIZATIONS SECTION: Water Use Distribution, Capacity Growth, India Map */}
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Solar Treatment Analytical Visualizations
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            AQUANEX Clean Energy Intelligence Suite
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* VISUALIZATION A: Water Use Distribution (Pie / Donut Chart) */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-cyan-500/25 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Water Use Distribution
                </h3>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                  Allocation Model
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-sector utilization profile for solar-purified output.
              </p>
            </div>

            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center my-3">
              <svg className="w-48 h-48 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="96"
                  cy="96"
                  r={donutRadius}
                  stroke="#0f172a"
                  strokeWidth="20"
                  fill="transparent"
                />

                {/* Slices */}
                {donutSlices.map((slice) => (
                  <circle
                    key={slice.id}
                    cx="96"
                    cy="96"
                    r={donutRadius}
                    stroke={slice.color}
                    strokeWidth={hoveredSlice === slice.id ? '24' : '20'}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    fill="transparent"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredSlice(slice.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                ))}
              </svg>

              {/* Centered Donut Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-mono text-slate-400 uppercase">100% PURIFIED</span>
                <span className="text-2xl font-black font-mono text-white">200k+</span>
                <span className="text-[10px] font-mono text-cyan-300">m³/day Solar</span>
              </div>
            </div>

            {/* Legend breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              {distributionData.map((item) => {
                const isHovered = hoveredSlice === item.id;
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredSlice(item.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer text-xs ${
                      isHovered
                        ? 'bg-slate-800 border-cyan-400 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-white">{item.label}</span>
                      </div>
                      <span className="font-black text-sm" style={{ color: item.color }}>
                        {item.percent}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-sans">
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] font-mono text-slate-500 text-center">
              *Balanced allocation protocol preventing groundwater over-extraction.
            </div>
          </div>

          {/* VISUALIZATION B: Solar Treatment Capacity Growth Line Graph */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-cyan-500/25 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Solar Water Treatment Capacity Growth
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Decadal scaling projection from 2020 baseline through 2035 target.
                </p>
              </div>

              {/* Required Demonstration Data label */}
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono rounded shrink-0">
                Projected Growth / Demonstration Data
              </span>
            </div>

            {/* Interactive SVG Line Graph */}
            <div className="relative h-64 w-full">
              <svg className="w-full h-full" viewBox="0 0 540 230" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="solarGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[40, 80, 120, 160, 200].map((y, idx) => (
                  <line
                    key={idx}
                    x1="45"
                    y1={y}
                    x2="520"
                    y2={y}
                    stroke="rgba(148, 163, 184, 0.1)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Y-Axis scale labels */}
                <text x="5" y="45" fill="#94a3b8" fontSize="9" fontFamily="monospace">1.2M m³</text>
                <text x="5" y="85" fill="#94a3b8" fontSize="9" fontFamily="monospace">900k m³</text>
                <text x="5" y="125" fill="#94a3b8" fontSize="9" fontFamily="monospace">600k m³</text>
                <text x="5" y="165" fill="#94a3b8" fontSize="9" fontFamily="monospace">300k m³</text>
                <text x="5" y="205" fill="#94a3b8" fontSize="9" fontFamily="monospace">0 m³</text>

                {/* Data Points calculation: 150,000 -> 1,200,000 */}
                {(() => {
                  const maxCap = 1300000;
                  const pts = CAPACITY_GROWTH_DATA.map((pt, i) => {
                    const x = 70 + (i / (CAPACITY_GROWTH_DATA.length - 1)) * 430;
                    const y = 200 - (pt.capacityM3 / maxCap) * 165;
                    return { x, y, ...pt };
                  });

                  const linePath = pts.reduce((acc, p, idx) => {
                    return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
                  }, '');

                  const areaPath = `${linePath} L ${pts[pts.length - 1].x},200 L ${pts[0].x},200 Z`;

                  return (
                    <g>
                      {/* Gradient Area */}
                      <path d={areaPath} fill="url(#solarGrowthGradient)" />
                      {/* Line Curve */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Points */}
                      {pts.map((pt, idx) => (
                        <g key={idx} className="cursor-pointer group">
                          {/* Outer pulse */}
                          {idx === 0 || idx === pts.length - 1 ? (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="8"
                              fill="none"
                              stroke={idx === pts.length - 1 ? '#f59e0b' : '#06b6d4'}
                              strokeWidth="1.5"
                              className="animate-ping opacity-75"
                            />
                          ) : null}

                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="5"
                            fill={idx === pts.length - 1 ? '#f59e0b' : '#06b6d4'}
                            stroke="#040911"
                            strokeWidth="2"
                            className="hover:r-7 transition-all"
                          />

                          {/* Capacity Label */}
                          <text
                            x={pt.x}
                            y={pt.y - 12}
                            textAnchor="middle"
                            fill={idx === pts.length - 1 ? '#fcd34d' : '#ffffff'}
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {pt.capacityM3 >= 1000000 ? `${(pt.capacityM3 / 1000000).toFixed(1)}M` : `${pt.capacityM3 / 1000}k`}
                          </text>

                          {/* Year Label */}
                          <text
                            x={pt.x}
                            y="218"
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="10"
                            fontFamily="monospace"
                          >
                            {pt.year}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Growth Milestone Comparison Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase">2020 Initial Footprint</div>
                <div className="text-white font-bold text-sm mt-0.5">150,000 m³ / day</div>
                <div className="text-cyan-400 text-[10px] mt-1">Initial solar reverse osmosis &amp; filtration arrays</div>
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg">
                <div className="text-cyan-300 text-[10px] uppercase font-bold">2035 Projected Capacity Target</div>
                <div className="text-amber-300 font-extrabold text-sm mt-0.5">1,200,000 m³ / day (1.2M)</div>
                <div className="text-slate-300 text-[10px] mt-1">8x Exponential scale powered by national solar mission</div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 italic">
              Note: Data represents capacity expansion models based on planned regional solar water initiatives. Not verified historical government measurements.
            </div>
          </div>

        </div>
      </div>

      {/* VISUALIZATION C: India Map Visualization with Interactive Plant Markers */}
      <div className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                India Solar Water Treatment Geographical Visualization
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Featuring exemplary high-capacity plants across Rajasthan, Gujarat, Tamil Nadu, Andhra Pradesh, Maharashtra, and Uttar Pradesh.
            </p>
          </div>

          {/* Required Illustrative Plant Locations Label */}
          <span className="px-2.5 py-1 bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold rounded">
            Illustrative Plant Locations
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Tactical Vector Map of India (Schematic high-fidelity layout) */}
          <div className="lg:col-span-7 relative h-96 rounded-xl border border-cyan-500/30 bg-[#050e1b] overflow-hidden p-3 flex items-center justify-center">
            
            {/* Topographic radar lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:18px_18px] opacity-20" />
            
            {/* Schematic SVG of India Subcontinent Boundary */}
            <svg className="w-full h-full max-h-88" viewBox="0 0 400 440">
              <defs>
                <linearGradient id="subcontinentGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#082f49" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#0f172a" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#061b2e" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* India Subcontinent stylized polygon boundary */}
              <path
                d="M 180,30 L 220,50 L 235,90 L 285,115 L 340,120 L 360,145 L 330,165 L 290,165 L 275,190 L 295,240 L 260,285 L 230,340 L 195,410 L 165,340 L 140,285 L 105,240 L 80,185 L 110,135 L 150,85 Z"
                fill="url(#subcontinentGrad)"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="6 3"
                opacity="0.75"
              />

              {/* State boundary approximate accent lines */}
              <path d="M 110,135 Q 160,150 180,190" stroke="rgba(6, 182, 212, 0.25)" fill="none" />
              <path d="M 180,190 Q 220,180 275,190" stroke="rgba(6, 182, 212, 0.25)" fill="none" />
              <path d="M 140,285 Q 190,270 260,285" stroke="rgba(6, 182, 212, 0.25)" fill="none" />

              {/* 6 Named States Callout Labels */}
              <text x="110" y="165" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.6">Rajasthan</text>
              <text x="75" y="220" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.6">Gujarat</text>
              <text x="195" y="155" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.6">Uttar Pradesh</text>
              <text x="140" y="245" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.6">Maharashtra</text>
              <text x="190" y="295" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.6">Andhra Pradesh</text>
              <text x="165" y="375" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.6">Tamil Nadu</text>

              {/* Plant Markers */}
              {SAMPLE_PLANTS.map((plant) => {
                // Map xPercent/yPercent to SVG coordinates
                const cx = (plant.coordinates.xPercent / 100) * 360 + 20;
                const cy = (plant.coordinates.yPercent / 100) * 380 + 20;
                const isSelected = selectedPlant.id === plant.id;

                return (
                  <g
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 14 : 9}
                      fill="none"
                      stroke={isSelected ? '#22d3ee' : '#14b8a6'}
                      strokeWidth="1.2"
                      opacity="0.6"
                      className="animate-pulse"
                    />
                    
                    {/* Center point */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4.5}
                      fill={isSelected ? '#06b6d4' : '#2dd4bf'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    {/* Plant Capacity Pill Badge */}
                    <rect
                      x={cx + 8}
                      y={cy - 12}
                      width={isSelected ? 90 : 70}
                      height="16"
                      rx="4"
                      fill="#040911"
                      stroke={isSelected ? '#06b6d4' : 'rgba(20, 184, 166, 0.4)'}
                      strokeWidth="1"
                    />
                    <text
                      x={cx + 14}
                      y={cy - 1}
                      fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {plant.dailyCapacityM3 / 1000}k m³/d
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tactical overlay badge */}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 rounded backdrop-blur-sm">
              SECTORS MONITORED: 6 KEY STATES
            </div>
          </div>

          {/* Plant Detail Dossier Card for Selected State Plant */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  {selectedPlant.state} State Facility
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded">
                  {selectedPlant.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{selectedPlant.name}</h4>
                <div className="text-xs text-cyan-300 font-mono mt-0.5">Asset ID: {selectedPlant.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[10px]">Daily Capacity</div>
                  <div className="text-white font-bold text-sm mt-0.5">
                    {selectedPlant.dailyCapacityM3.toLocaleString()} m³
                  </div>
                </div>

                <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[10px]">Rural Reach</div>
                  <div className="text-teal-300 font-bold text-sm mt-0.5">
                    {selectedPlant.villagesCovered} Villages
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/20 rounded text-xs space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Purification Technology</div>
                <div className="text-slate-200 font-sans font-medium">{selectedPlant.technology}</div>
              </div>
            </div>

            {/* Quick State Selector Buttons */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-2">Switch Illustrative Plant:</div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {SAMPLE_PLANTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlant(p)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left truncate transition-colors ${
                      selectedPlant.id === p.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.state}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono italic">
              *Illustrative Plant Locations. Does not imply real registered physical ownership unless verified by institutional accreditation.
            </div>
          </div>

        </div>
      </div>

      {/* 4. SOLAR WATER TREATMENT APPLICATIONS (Drinking, Agriculture, Household) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Solar Water Treatment Applications
            </h2>
            <p className="text-xs text-slate-400">
              Multi-tiered purification outputs categorized by potable, agrarian, and domestic criteria.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">3 Core Verticals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* A. Drinking Water */}
          <div className="p-6 bg-slate-900/80 border border-cyan-500/25 hover:border-cyan-400/50 rounded-xl backdrop-blur-md space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                <span>💧 Drinking Water</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Mineralized safe potability meeting Bureau of Indian Standards (IS 10500) and WHO drinking thresholds.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Homes &amp; Rural Habitations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Primary Schools &amp; Anganwadis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Public Community Dispensing Kiosks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bottled-Water Emergency Supplies</span>
              </div>
            </div>
          </div>

          {/* B. Agriculture */}
          <div className="p-6 bg-slate-900/80 border border-teal-500/25 hover:border-teal-400/50 rounded-xl backdrop-blur-md space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Wheat className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors flex items-center gap-2">
                <span>🌾 Agriculture</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                De-salinated, low-turbidity irrigation supplies preventing soil salinization in drought-prone agro-zones.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Precision Crop Drip Irrigation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Livestock Hydration &amp; Dairy Farms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Horticulture &amp; Greenhouse Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Aquacultural Nursery Water Pools</span>
              </div>
            </div>
          </div>

          {/* C. Household */}
          <div className="p-6 bg-slate-900/80 border border-sky-500/25 hover:border-sky-400/50 rounded-xl backdrop-blur-md space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-2">
                <span>🏠 Household</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Reliable non-potable secondary water supplies for domestic sanitation, laundering, and public health hygiene.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Sanitary Cisterns &amp; Toilet Flushing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Daily Washing &amp; Clothes Laundering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Personal Hygiene Stations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Municipal Road Cleaning &amp; Spray</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. SOLAR WATER TREATMENT PROCESS FLOW */}
      <div className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Solar Water Treatment Lifecycle Flow</span>
            </h3>
            <p className="text-xs text-slate-400">
              Photovoltaic to consumer chain: Seamless conversion of untreated raw sources into high-potability water.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">6 Continuous Stages</span>
        </div>

        {/* Process Flow Cards (Solar Energy → Water Treatment → Purification → Quality Check → Safe/Useful Water → Community & Agriculture) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          
          {/* Step 1: Solar Energy */}
          <div className="p-3.5 bg-slate-950/80 border border-amber-500/40 rounded-lg text-center relative group hover:border-amber-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 mb-2">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Stage 1</div>
            <div className="text-xs font-bold text-white mt-0.5">Solar Energy</div>
            <div className="text-[10px] text-slate-400 mt-1">PV Arrays &amp; Battery Bank</div>
          </div>

          {/* Step 2: Water Treatment */}
          <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
              <Filter className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Stage 2</div>
            <div className="text-xs font-bold text-white mt-0.5">Water Treatment</div>
            <div className="text-[10px] text-slate-400 mt-1">Intake &amp; Pre-Sedimentation</div>
          </div>

          {/* Step 3: Purification */}
          <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Stage 3</div>
            <div className="text-xs font-bold text-white mt-0.5">Purification</div>
            <div className="text-[10px] text-slate-400 mt-1">Membrane &amp; UV-C Sterilization</div>
          </div>

          {/* Step 4: Quality Check */}
          <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-center relative group hover:border-cyan-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-teal-400 uppercase font-bold">Stage 4</div>
            <div className="text-xs font-bold text-white mt-0.5">Quality Check</div>
            <div className="text-[10px] text-slate-400 mt-1">Automated pH, TDS &amp; Bio Sensor</div>
          </div>

          {/* Step 5: Safe/Useful Water */}
          <div className="p-3.5 bg-cyan-950/60 border border-cyan-500/50 rounded-lg text-center relative group hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-2">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-cyan-300 uppercase font-bold">Stage 5</div>
            <div className="text-xs font-bold text-white mt-0.5">Safe/Useful Water</div>
            <div className="text-[10px] text-cyan-200 mt-1">Certified Potable Stream</div>
          </div>

          {/* Step 6: Community & Agriculture */}
          <div className="p-3.5 bg-slate-950/80 border border-teal-500/40 rounded-lg text-center relative group hover:border-teal-400 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-full bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-400 mb-2">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-teal-400 uppercase font-bold">Stage 6</div>
            <div className="text-xs font-bold text-white mt-0.5">Community &amp; Agri</div>
            <div className="text-[10px] text-slate-400 mt-1">Local Distribution Networks</div>
          </div>

        </div>
      </div>

    </div>
  );
};
