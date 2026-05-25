
import React, { useState } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import clsx from 'clsx';
import type { ResilienceData } from '../../types';
import { RESILIENCE_DATA } from '../../data/mockData';

const VULN_COLOR: Record<string, string> = {
  low: 'bg-forest-400 border-forest-600',
  medium: 'bg-earth-400 border-earth-600',
  high: 'bg-red-400 border-red-600',
};

const VULN_LABEL: Record<string, string> = {
  low: 'Low Vulnerability',
  medium: 'Medium Vulnerability',
  high: 'High Vulnerability',
};

// Approximate Ghana bounding box: lat 4.5–11.2, lng -3.3–1.2
function projectPoint(lat: number, lng: number, width: number, height: number) {
  const minLat = 4.5, maxLat = 11.2, minLng = -3.3, maxLng = 1.2;
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - lat) / (maxLat - minLat)) * height;
  return { x, y };
}

export default function GISMap() {
  const [selected, setSelected] = useState<ResilienceData | null>(null);
  const [zoom, setZoom] = useState(1);
  const W = 480, H = 320;

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-forest-500" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">GIS Environmental Map — Ghana</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Zoom in">
            <ZoomIn size={14} className="text-gray-500" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Zoom out">
            <ZoomOut size={14} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-forest-50 dark:from-gray-900 dark:to-gray-800 border border-white/30 dark:border-white/10" style={{ height: H }}>
        {/* SVG base map */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 w-full h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
        >
          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map(f => (
            <React.Fragment key={f}>
              <line x1={W * f} y1={0} x2={W * f} y2={H} stroke="rgba(46,125,50,0.08)" strokeWidth="1" />
              <line x1={0} y1={H * f} x2={W} y2={H * f} stroke="rgba(46,125,50,0.08)" strokeWidth="1" />
            </React.Fragment>
          ))}

          {/* Decorative region shapes */}
          <ellipse cx={240} cy={160} rx={180} ry={130} fill="rgba(46,125,50,0.06)" stroke="rgba(46,125,50,0.15)" strokeWidth="1" />
          <ellipse cx={240} cy={160} rx={120} ry={85} fill="rgba(0,137,123,0.05)" />

          {/* Community pins */}
          {RESILIENCE_DATA.map(d => {
            const { x, y } = projectPoint(d.lat, d.lng, W, H);
            const isSelected = selected?.community === d.community;
            return (
              <g key={d.community} onClick={() => setSelected(isSelected ? null : d)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={x} cy={y} r={isSelected ? 14 : 10}
                  fill={d.vulnerability === 'low' ? '#4fa04f' : d.vulnerability === 'medium' ? '#d4882e' : '#ef4444'}
                  fillOpacity={0.85}
                  stroke="white"
                  strokeWidth={isSelected ? 3 : 2}
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">
                  {d.score}
                </text>
                {isSelected && (
                  <circle cx={x} cy={y} r={20} fill="none" stroke={d.vulnerability === 'low' ? '#4fa04f' : d.vulnerability === 'medium' ? '#d4882e' : '#ef4444'} strokeWidth="1.5" strokeDasharray="4 2" opacity={0.6} />
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {selected && (
          <div className="absolute top-3 right-3 glass-card rounded-xl p-3 text-xs max-w-[160px] z-10 animate-fade-in">
            <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">{selected.community}</div>
            <div className="text-gray-600 dark:text-gray-300">Resilience: <span className="font-semibold text-forest-600 dark:text-forest-300">{selected.score}%</span></div>
            <div className="text-gray-600 dark:text-gray-300">Population: {selected.population.toLocaleString()}</div>
            <div className={clsx('mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full inline-block',
              selected.vulnerability === 'low' ? 'bg-forest-100 text-forest-700' :
              selected.vulnerability === 'medium' ? 'bg-earth-100 text-earth-700' :
              'bg-red-100 text-red-700'
            )}>
              {VULN_LABEL[selected.vulnerability]}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(['low', 'medium', 'high'] as const).map(v => (
          <div key={v} className="flex items-center gap-1.5">
            <div className={clsx('w-3 h-3 rounded-full border', VULN_COLOR[v])} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{VULN_LABEL[v]}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={10} />
          <span>{RESILIENCE_DATA.length} communities monitored</span>
        </div>
      </div>
    </div>
  );
}
