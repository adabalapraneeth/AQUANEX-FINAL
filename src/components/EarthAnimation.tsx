import React, { useEffect, useRef, useState } from 'react';
import { Globe, MapPin, Radio, ShieldCheck, AlertTriangle } from 'lucide-react';

interface OutfallBeacon {
  id: string;
  name: string;
  location: string;
  lat: number; // -90 to 90
  lon: number; // -180 to 180
  score: number;
  status: 'Safe' | 'Caution' | 'High Risk' | 'Critical';
}

const GLOBAL_STATIONS: OutfallBeacon[] = [
  { id: 'IND-704', name: 'Apex PetroChem SV-4', location: 'North Estuary Canal', lat: 28.6, lon: 77.2, score: 82, status: 'Caution' },
  { id: 'IND-302', name: 'Pacific Bio-Wetland', location: 'South River Delta', lat: 34.0, lon: -118.2, score: 94, status: 'Safe' },
  { id: 'IND-992', name: 'Dock 7 Chemical Outfall', location: 'Industrial Harbor Bay', lat: 51.5, lon: -0.1, score: 36, status: 'Critical' },
  { id: 'IND-518', name: 'Rhine Industrial Sluice', location: 'Continental Waterway', lat: 48.8, lon: 2.3, score: 61, status: 'High Risk' },
  { id: 'IND-114', name: 'Marina Reclaim Terminal', location: 'Singapore Estuary', lat: 1.35, lon: 103.8, score: 91, status: 'Safe' }
];

export const EarthAnimation: React.FC<{
  onSelectStation?: (beacon: OutfallBeacon) => void;
  selectedStationId?: string;
}> = ({ onSelectStation, selectedStationId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeStation, setActiveStation] = useState<OutfallBeacon>(GLOBAL_STATIONS[0]);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0.4;
    const radius = 145; // Globe radius

    // Simplified polygon landmass coordinates (lat, lon) approximations for smooth vector globe
    const continents = [
      // North America
      [
        { lat: 65, lon: -165 }, { lat: 70, lon: -130 }, { lat: 60, lon: -80 },
        { lat: 45, lon: -60 }, { lat: 25, lon: -80 }, { lat: 15, lon: -90 },
        { lat: 20, lon: -105 }, { lat: 35, lon: -120 }, { lat: 55, lon: -135 }
      ],
      // South America
      [
        { lat: 10, lon: -75 }, { lat: -5, lon: -35 }, { lat: -25, lon: -45 },
        { lat: -55, lon: -65 }, { lat: -45, lon: -75 }, { lat: -15, lon: -75 }
      ],
      // Eurasia & Africa
      [
        { lat: 70, lon: 30 }, { lat: 70, lon: 170 }, { lat: 40, lon: 140 },
        { lat: 20, lon: 110 }, { lat: 10, lon: 80 }, { lat: 30, lon: 60 },
        { lat: 15, lon: 45 }, { lat: -35, lon: 20 }, { lat: 5, lon: -10 },
        { lat: 35, lon: -10 }, { lat: 50, lon: 5 }
      ],
      // Australia
      [
        { lat: -15, lon: 130 }, { lat: -20, lon: 150 }, { lat: -38, lon: 145 },
        { lat: -32, lon: 115 }
      ]
    ];

    let pulse = 0;

    const render = () => {
      pulse += 0.05;
      if (isRotating) {
        rotation += 0.004;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Atmosphere outer glow
      const atmoGlow = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.35);
      atmoGlow.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      atmoGlow.addColorStop(0.5, 'rgba(14, 165, 233, 0.12)');
      atmoGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = atmoGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Earth ocean sphere with 3D gradient
      const oceanGrad = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
      oceanGrad.addColorStop(0, '#0c3558');
      oceanGrad.addColorStop(0.55, '#061c33');
      oceanGrad.addColorStop(0.85, '#041122');
      oceanGrad.addColorStop(1, '#020914');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = oceanGrad;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // 3. Latitude & Longitude grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;

      // Latitude parallels
      [-60, -30, 0, 30, 60].forEach((lat) => {
        const rad = (lat * Math.PI) / 180;
        const y = cy - Math.sin(rad) * radius * 0.9;
        const rParallel = Math.cos(rad) * radius;
        ctx.beginPath();
        ctx.ellipse(cx, y, rParallel, rParallel * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Longitude meridians (rotating)
      for (let lonDeg = 0; lonDeg < 360; lonDeg += 30) {
        const radLon = ((lonDeg * Math.PI) / 180) + rotation;
        const cosLon = Math.cos(radLon);
        if (cosLon > -0.2) { // only front-facing hemisphere
          const xParallel = cx + Math.sin(radLon) * radius;
          ctx.beginPath();
          ctx.ellipse(cx, cy, Math.abs(xParallel - cx), radius, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 4. Continents projected with rotation
      continents.forEach((cont) => {
        ctx.beginPath();
        let first = true;
        let anyVisible = false;

        cont.forEach((pt) => {
          const ptLonRad = ((pt.lon * Math.PI) / 180) + rotation;
          const ptLatRad = (pt.lat * Math.PI) / 180;

          // 3D sphere coordinate math
          const x3D = Math.cos(ptLatRad) * Math.sin(ptLonRad);
          const y3D = -Math.sin(ptLatRad);
          const z3D = Math.cos(ptLatRad) * Math.cos(ptLonRad);

          if (z3D > -0.15) { // visible side
            anyVisible = true;
            const screenX = cx + x3D * radius;
            const screenY = cy + y3D * radius * 0.95;

            if (first) {
              ctx.moveTo(screenX, screenY);
              first = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
        });

        if (anyVisible) {
          ctx.closePath();
          ctx.fillStyle = 'rgba(20, 184, 166, 0.28)';
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.fill();
          ctx.stroke();
        }
      });

      // 5. Water outfall monitoring beacons
      GLOBAL_STATIONS.forEach((station) => {
        const lonRad = ((station.lon * Math.PI) / 180) + rotation;
        const latRad = (station.lat * Math.PI) / 180;

        const x3D = Math.cos(latRad) * Math.sin(lonRad);
        const y3D = -Math.sin(latRad);
        const z3D = Math.cos(latRad) * Math.cos(lonRad);

        if (z3D > 0.05) { // Front hemisphere facing viewer
          const beaconX = cx + x3D * radius;
          const beaconY = cy + y3D * radius * 0.95;
          const isSelected = (selectedStationId === station.id) || (activeStation.id === station.id);

          // Color by status
          let color = '#10b981'; // Safe
          if (station.status === 'Caution') color = '#f59e0b';
          if (station.status === 'High Risk') color = '#f97316';
          if (station.status === 'Critical') color = '#ef4444';

          // Pulsing radar ripple
          const rippleR = 6 + (Math.sin(pulse + station.lat) + 1) * 6;
          ctx.beginPath();
          ctx.arc(beaconX, beaconY, rippleR, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = Math.max(0.1, 1 - rippleR / 18);
          ctx.stroke();
          ctx.globalAlpha = 1.0;

          // Core beacon point
          ctx.beginPath();
          ctx.arc(beaconX, beaconY, isSelected ? 5.5 : 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Outer halo ring for selected beacon
          if (isSelected) {
            ctx.beginPath();
            ctx.arc(beaconX, beaconY, 10, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      });

      // Inner shadow to enhance sphere depth
      const innerShadow = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, radius * 0.5, cx, cy, radius);
      innerShadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
      innerShadow.addColorStop(0.85, 'rgba(4, 11, 24, 0.4)');
      innerShadow.addColorStop(1, 'rgba(2, 6, 15, 0.85)');
      ctx.fillStyle = innerShadow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Restore clip

      // Globe edge rim ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isRotating, activeStation, selectedStationId]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Globe Canvas */}
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="cursor-pointer max-w-full drop-shadow-[0_0_35px_rgba(6,182,212,0.3)]"
          onClick={() => {
            // cycle station on click
            const nextIdx = (GLOBAL_STATIONS.findIndex(s => s.id === activeStation.id) + 1) % GLOBAL_STATIONS.length;
            const nextStation = GLOBAL_STATIONS[nextIdx];
            setActiveStation(nextStation);
            if (onSelectStation) onSelectStation(nextStation);
          }}
          title="Click to cycle monitoring beacons or use station buttons below"
        />

        {/* Orbit indicator text badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-md rounded">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>EARTH TELEMETRY: 5 BASINS LIVE</span>
        </div>

        {/* Rotation toggle button */}
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-md rounded transition-colors"
        >
          {isRotating ? 'Pause Orbit' : 'Resume Orbit'}
        </button>
      </div>

      {/* Selected Station Telemetry Card */}
      <div className="w-full max-w-md mt-4 p-3.5 bg-slate-900/80 border border-cyan-500/25 rounded-lg backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-semibold text-slate-200">{activeStation.name}</div>
              <div className="text-[11px] text-slate-400">{activeStation.location} ({activeStation.id})</div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              {activeStation.status === 'Safe' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertTriangle className={`w-3.5 h-3.5 ${activeStation.status === 'Critical' ? 'text-red-400' : 'text-amber-400'}`} />
              )}
              <span className={`text-xs font-bold font-mono ${
                activeStation.status === 'Safe' ? 'text-emerald-400' :
                activeStation.status === 'Caution' ? 'text-amber-400' :
                activeStation.status === 'High Risk' ? 'text-orange-400' : 'text-red-400'
              }`}>
                {activeStation.score} / 100
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              {activeStation.status}
            </span>
          </div>
        </div>

        {/* Station switcher tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800 overflow-x-auto text-[11px]">
          {GLOBAL_STATIONS.map((station) => (
            <button
              key={station.id}
              onClick={() => {
                setActiveStation(station);
                if (onSelectStation) onSelectStation(station);
              }}
              className={`px-2 py-0.5 rounded text-left whitespace-nowrap transition-colors font-mono ${
                activeStation.id === station.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {station.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
