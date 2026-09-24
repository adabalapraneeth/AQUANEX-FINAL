import React, { useState } from 'react';
import { 
  Recycle, 
  Droplet, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  TreePine, 
  Sparkle, 
  Building2, 
  Flower2, 
  Plus, 
  History, 
  Waves,
  ArrowRight,
  ShieldCheck,
  Zap,
  Filter
} from 'lucide-react';
import { ACWaterBatch } from '../types';

interface ACWaterReuseProps {
  batches: ACWaterBatch[];
  onAddBatch: (batch: ACWaterBatch) => void;
}

export const ACWaterReuse: React.FC<ACWaterReuseProps> = ({ batches, onAddBatch }) => {
  // Input form state
  const [quantity, setQuantity] = useState<number>(350);
  const [ph, setPh] = useState<number>(7.1);
  const [tds, setTds] = useState<number>(65);
  const [turbidity, setTurbidity] = useState<number>(0.9);
  const [sourceHvac, setSourceHvac] = useState<string>('Main Data Center Chiller Block A');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [simulatingPurification, setSimulatingPurification] = useState<boolean>(false);

  // Analyze water suitability based on inputs
  const analyzeSuitability = (q: number, phVal: number, tdsVal: number, turbVal: number) => {
    const isPhGood = phVal >= 6.5 && phVal <= 8.0;
    const isTdsLow = tdsVal <= 150;
    const isTurbClear = turbVal <= 2.0;

    const plantIrrigation = isPhGood && isTdsLow && isTurbClear;
    const cleaning = turbVal <= 5.0 && tdsVal <= 350;
    const toiletFlushing = true; // AC condensate is universally prime for flushing
    const landscaping = phVal >= 6.0 && phVal <= 8.5 && tdsVal <= 300;

    let qualityRating: 'Optimal' | 'Good' | 'Needs Treatment' = 'Optimal';
    if (!isPhGood || !isTdsLow || !isTurbClear) {
      qualityRating = (tdsVal > 400 || turbVal > 8) ? 'Needs Treatment' : 'Good';
    }

    return {
      plantIrrigation,
      cleaning,
      toiletFlushing,
      landscaping,
      qualityRating
    };
  };

  const currentAnalysis = analyzeSuitability(quantity, ph, tds, turbidity);

  // Handle Process Batch Submission
  const handleProcessBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulatingPurification(true);

    setTimeout(() => {
      const newBatch: ACWaterBatch = {
        id: `AC-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        quantityLiters: Number(quantity),
        pH: Number(ph),
        tdsPpm: Number(tds),
        turbidityNtu: Number(turbidity),
        purificationStages: [
          'Sedimentation Pre-Filter (5µm)',
          'Activated Carbon Filter Core',
          'UV-C Germicidal Disinfection'
        ],
        reusableFor: {
          plantIrrigation: currentAnalysis.plantIrrigation,
          cleaning: currentAnalysis.cleaning,
          toiletFlushing: currentAnalysis.toiletFlushing,
          landscaping: currentAnalysis.landscaping
        },
        qualityRating: currentAnalysis.qualityRating
      };

      onAddBatch(newBatch);
      setSimulatingPurification(false);
      setActiveStep(6); // Reusable Water
    }, 800);
  };

  // Cumulative metrics
  const totalLitersReclaimed = batches.reduce((sum, b) => sum + b.quantityLiters, 0);
  const totalWaterSavedGallons = Math.round(totalLitersReclaimed * 0.264172);
  const carbonOffsetKg = Math.round(totalLitersReclaimed * 0.0003 * 100) / 100;

  const PIPELINE_STEPS = [
    { num: 1, label: 'AC Water', desc: 'HVAC Condensate Capture', icon: Droplet },
    { num: 2, label: 'Collection', desc: 'Storage Holding Tank', icon: Waves },
    { num: 3, label: 'Quality Analysis', desc: 'pH, TDS & Turbidity', icon: Zap },
    { num: 4, label: 'Purification', desc: 'Multi-Stage Filtration', icon: Filter },
    { num: 5, label: 'Quality Check', desc: 'Pathogen & Ion Verify', icon: ShieldCheck },
    { num: 6, label: 'Reusable Water', desc: 'Beneficial Repurposing', icon: Sparkles }
  ];

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-1">
            <Recycle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Closed-Loop Resource Recovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AC Condensate Water Reuse System
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl mt-1">
            Capture pure condensed atmospheric moisture from commercial and industrial air-conditioning chiller units, 
            run automated quality analysis, and deploy into secondary non-potable closed-loop cycles.
          </p>
        </div>

        {/* Reclaim Ticker */}
        <div className="p-3 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-right">
          <div className="text-[10px] font-mono text-cyan-300 uppercase">Cumulative Reclaimed</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white">
            {totalLitersReclaimed.toLocaleString()} <span className="text-xs font-normal text-cyan-400">Liters</span>
          </div>
        </div>
      </div>

      {/* CORE PIPELINE VISUALIZATION (Specified in prompt: AC Water → Collection → Quality Analysis → Purification → Quality Check → Reusable Water) */}
      <div className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>Architectural Recovery Pipeline</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Zero-Waste HVAC Reclaim Standard
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {PIPELINE_STEPS.map((step) => {
            const IconComponent = step.icon;
            const isCurrent = activeStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`cursor-pointer p-3.5 rounded-lg border transition-all text-center relative ${
                  isCurrent
                    ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200'
                }`}
              >
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  isCurrent ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-cyan-400'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  Step 0{step.num}
                </div>
                <div className="text-xs font-bold text-white mt-0.5">{step.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{step.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INPUT FORM & REAL-TIME REUSE RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Input Form (Quantity, pH, TDS, Turbidity) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <span>Condensate Batch Characterization</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter collected condensate parameters to verify treatment and suitability.
            </p>
          </div>

          <form onSubmit={handleProcessBatch} className="space-y-4">
            
            {/* HVAC Source Label */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                HVAC Condensate Drain Source
              </label>
              <input
                type="text"
                value={sourceHvac}
                onChange={(e) => setSourceHvac(e.target.value)}
                placeholder="e.g. Building A - Rooftop Chiller Bank #3"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-xs text-white outline-none"
              />
            </div>

            {/* Quantity */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Quantity Reclaimed (Liters)</span>
                <span className="text-cyan-300 font-bold">{quantity} L</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="25"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>50 L</span>
                <span>1,250 L</span>
                <span>2,500 L</span>
              </div>
            </div>

            {/* 3 Parameter Inputs: pH, TDS, Turbidity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              
              {/* pH */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>pH Level</span>
                  <span className="text-cyan-300 font-bold">{ph}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="10.0"
                  value={ph}
                  onChange={(e) => setPh(parseFloat(e.target.value) || 7.0)}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-white"
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Ideal: 6.5 - 7.5</span>
              </div>

              {/* TDS */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>TDS (ppm)</span>
                  <span className="text-cyan-300 font-bold">{tds}</span>
                </div>
                <input
                  type="number"
                  step="5"
                  min="5"
                  max="800"
                  value={tds}
                  onChange={(e) => setTds(parseInt(e.target.value) || 50)}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-white"
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Ideal: &lt; 100 ppm</span>
              </div>

              {/* Turbidity */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Turbidity (NTU)</span>
                  <span className="text-cyan-300 font-bold">{turbidity}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="20.0"
                  value={turbidity}
                  onChange={(e) => setTurbidity(parseFloat(e.target.value) || 1.0)}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-white"
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Ideal: &lt; 1.5 NTU</span>
              </div>

            </div>

            {/* Purification Stages Toggle Summary */}
            <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg text-xs space-y-1">
              <span className="text-cyan-300 font-mono text-[10px] uppercase font-bold">Standard Integrated Purification:</span>
              <div className="text-slate-300 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Micro-Sedimentation → Coconut Shell Carbon → UV-C Sterilization</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={simulatingPurification}
              className="w-full py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {simulatingPurification ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Purifying &amp; Reclaiming {quantity} Liters...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Process Batch &amp; Verify Reuse</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Appropriate Reuse Recommendations (Plant irrigation, Cleaning, Toilet flushing, Landscaping) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Target Reuse Recommendations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated suitability index based on pH {ph}, TDS {tds} ppm, and Turbidity {turbidity} NTU.
              </p>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              currentAnalysis.qualityRating === 'Optimal' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
              currentAnalysis.qualityRating === 'Good' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
              'bg-red-950 text-red-400 border border-red-500/30'
            }`}>
              {currentAnalysis.qualityRating} Grade
            </span>
          </div>

          {/* 4 Cards for specific recommendations from prompt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Plant Irrigation */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentAnalysis.plantIrrigation
                ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400">
                    <TreePine className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-white">Plant Irrigation</span>
                </div>
                {currentAnalysis.plantIrrigation ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Ideal for botanical nursery, hydroponic drip, and sensitive plants due to ultra-low mineral salinity.
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-400">
                {currentAnalysis.plantIrrigation ? '✓ Recommended without dilution' : 'Requires TDS stabilization'}
              </div>
            </div>

            {/* 2. Cleaning & Industrial Washing */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentAnalysis.cleaning
                ? 'bg-cyan-950/30 border-cyan-500/40 text-slate-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-400">
                    <Sparkle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-white">Facility Cleaning</span>
                </div>
                {currentAnalysis.cleaning ? (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Floor scrubbers, exterior architectural facade washes, and machinery degreasing cycles.
              </p>
              <div className="mt-2 text-[10px] font-mono text-cyan-300">
                {currentAnalysis.cleaning ? '✓ Zero spotting residue' : 'Needs sediment filtration'}
              </div>
            </div>

            {/* 3. Toilet Flushing */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentAnalysis.toiletFlushing
                ? 'bg-sky-950/30 border-sky-500/40 text-slate-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-sky-500/20 text-sky-400">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-white">Toilet Flushing</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Direct gravity-fed gravity plumb line into commercial sanitary cisterns, offsetting municipal drinking water.
              </p>
              <div className="mt-2 text-[10px] font-mono text-sky-300">
                ✓ 100% Primary Candidate
              </div>
            </div>

            {/* 4. Landscaping & Cooling Make-up */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentAnalysis.landscaping
                ? 'bg-teal-950/30 border-teal-500/40 text-slate-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-teal-500/20 text-teal-400">
                    <Flower2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-white">Landscaping &amp; Grounds</span>
                </div>
                {currentAnalysis.landscaping ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Campus lawn sprinklers, decorative retention ponds, and evaporative cooling tower loop recharge.
              </p>
              <div className="mt-2 text-[10px] font-mono text-teal-300">
                {currentAnalysis.landscaping ? '✓ Optimal ground recharge' : 'Check pH balance'}
              </div>
            </div>

          </div>

          {/* Environmental Savings Summary */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Offset Drinking Water</span>
              <strong className="text-white text-sm">~{totalWaterSavedGallons.toLocaleString()} Gallons</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Treatment Energy Saved</span>
              <strong className="text-teal-400 text-sm">{carbonOffsetKg} kg CO₂e</strong>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT AC CONDENSATE REUSE BATCHES LOG */}
      <div className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Recent AC Water Reclaim Batches
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {batches.length} Batches Processed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">pH</th>
                <th className="py-2.5 px-3">TDS (ppm)</th>
                <th className="py-2.5 px-3">Turbidity</th>
                <th className="py-2.5 px-3">Target Reuse</th>
                <th className="py-2.5 px-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-white font-bold">{batch.id}</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(batch.timestamp).toLocaleDateString()} {new Date(batch.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">{batch.quantityLiters} L</td>
                  <td className="py-2.5 px-3 text-slate-200">{batch.pH}</td>
                  <td className="py-2.5 px-3 text-slate-200">{batch.tdsPpm}</td>
                  <td className="py-2.5 px-3 text-slate-200">{batch.turbidityNtu} NTU</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 border border-slate-800 rounded">
                      {batch.reusableFor.plantIrrigation ? 'Irrigation, ' : ''}
                      {batch.reusableFor.toiletFlushing ? 'Flushing, ' : ''}
                      Cleaning
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {batch.qualityRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
