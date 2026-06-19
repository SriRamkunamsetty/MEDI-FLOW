import React, { useState } from "react";
import { MapPin, Truck, ShieldAlert, Heart, Building, Phone } from "lucide-react";

interface MapMarker {
  id: string;
  name: string;
  type: "hospital" | "bank" | "donor" | "ambulance";
  lat: number;
  lng: number;
  status?: string;
  details?: string;
  bloodGroup?: string;
}

interface EmergencyMapProps {
  markers: MapMarker[];
  activeRoute?: [number, number][]; // coordinates list
  onSelectMarker?: (marker: MapMarker) => void;
}

export default function EmergencyMap({ markers, activeRoute, onSelectMarker }: EmergencyMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);

  // Map limits based on NYC seed coordinates from sever.ts
  // Lat: 40.65 to 40.85
  // Lng: -74.01 to -73.91
  const minLat = 40.64;
  const maxLat = 40.85;
  const minLng = -74.02;
  const maxLng = -73.90;

  // Convert GPS coordinates to SVG viewBox percentages (width=800, height=550)
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    // Note: latitude increases upwards, but SVG Y goes downwards
    const y = 550 - ((lat - minLat) / (maxLat - minLat)) * 550;
    return { x, y };
  };

  // Convert route coords to drawing path
  let pathD = "";
  if (activeRoute && activeRoute.length > 1) {
    activeRoute.forEach((pt, i) => {
      const { x, y } = getCoordinates(pt[0], pt[1]);
      if (i === 0) pathD += `M ${x} ${y}`;
      else pathD += ` L ${x} ${y}`;
    });
  }

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[550px] w-full" id="emergency-map-container">
      {/* Dynamic Grid Background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
      
      {/* Simulated Waterway (Hudson and East River curves for professional GIS feel) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {/* Hudson River on left */}
        <path d="M 50,-50 Q 80,180 30,350 T 10,600" fill="none" stroke="#38bdf8" strokeWidth="60" strokeLinecap="round" />
        {/* East River on Right */}
        <path d="M 520,-50 Q 480,120 400,240 T 280,480 T 180,600" fill="none" stroke="#38bdf8" strokeWidth="48" strokeLinecap="round" />
      </svg>

      {/* Map Header details */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-lg text-xs flex flex-col gap-1">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE TRANSIT GRID (NEW YORK REGION)
        </div>
        <div className="text-slate-400 font-mono text-[10px]">
          Haversine-optimized Dispatch Active
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 shadow-md text-[10px] flex gap-3 text-slate-300">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span>Hospital</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>Blood Bank</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>Active Donor</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>Ambulance</span>
      </div>

      {/* Interactive SVG Renderer */}
      <svg className="w-full h-full absolute inset-0 select-none" viewBox="0 0 800 550">
        {/* Render Route paths */}
        {pathD && (
          <>
            <path
              d={pathD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="animate-[dash_20s_linear_infinite]"
              id="active-route-path"
            />
            {/* Pulsing route target */}
            {(() => {
              const lastPt = activeRoute ? activeRoute[activeRoute.length - 1] : null;
              if (lastPt) {
                const { x, y } = getCoordinates(lastPt[0], lastPt[1]);
                return (
                  <g className="animate-ping" key="destination-ping">
                    <circle cx={x} cy={y} r="12" fill="#f59e0b" className="opacity-35" />
                  </g>
                );
              }
              return null;
            })()}
          </>
        )}

        {/* Markers rendering */}
        {markers.map((marker) => {
          const { x, y } = getCoordinates(marker.lat, marker.lng);
          const isHovered = hoveredMarker?.id === marker.id;

          let color = "#3b82f6"; // default blue
          if (marker.type === "hospital") color = "#ef4444"; // red
          if (marker.type === "donor") color = "#10b981"; // green/emerald
          if (marker.type === "ambulance") color = "#f59e0b"; // orange/amber

          return (
            <g
              key={marker.id}
              className="cursor-pointer transition-transform duration-200"
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => setHoveredMarker(marker)}
              onMouseLeave={() => setHoveredMarker(null)}
              onClick={() => onSelectMarker?.(marker)}
              id={`marker-g-${marker.id}`}
            >
              {/* Highlight Circle on hover or match */}
              <circle
                cx="0"
                cy="0"
                r={isHovered ? "14" : "8"}
                fill={color}
                className="opacity-20 animate-pulse transition-all duration-350"
              />
              {/* Solid center locator */}
              <circle
                cx="0"
                cy="0"
                r="5"
                fill={color}
                stroke="#0f172a"
                strokeWidth="1.5"
              />

              {/* Mini Label */}
              <text
                x="8"
                y="3"
                className="text-[10px] fill-slate-300 font-medium font-sans filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                {marker.bloodGroup ? `${marker.bloodGroup}` : ""}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip information overlay */}
      {hoveredMarker && (
        <div 
          className="absolute z-25 bg-slate-900 border border-slate-800 text-slate-100 p-3 rounded-lg shadow-xl text-xs w-60 flex flex-col gap-1 pointer-events-none"
          style={{
            left: `${Math.min(550, getCoordinates(hoveredMarker.lat, hoveredMarker.lng).x + 15)}px`,
            top: `${Math.min(420, getCoordinates(hoveredMarker.lat, hoveredMarker.lng).y - 40)}px`
          }}
          id={`map-tooltip-${hoveredMarker.id}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 truncate">{hoveredMarker.name}</span>
            <span className={`px-1.5 py-0.5 text-[9px] uppercase font-semibold rounded ${
              hoveredMarker.type === 'hospital' ? 'bg-red-950 text-red-400 border border-red-900' :
              hoveredMarker.type === 'bank' ? 'bg-blue-950 text-blue-400 border border-blue-900' :
              hoveredMarker.type === 'donor' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
              'bg-amber-950 text-amber-400 border border-amber-900'
            }`}>
              {hoveredMarker.type}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 mt-1">
            {hoveredMarker.details || `Position: ${hoveredMarker.lat.toFixed(5)}, ${hoveredMarker.lng.toFixed(5)}`}
          </div>

          {hoveredMarker.status && (
            <div className="flex items-center gap-1.5 text-[10px] mt-1.5 text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Status: <span className="font-semibold text-slate-100">{hoveredMarker.status}</span>
            </div>
          )}

          {hoveredMarker.bloodGroup && (
            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold font-mono">
              ★ Blood Type: {hoveredMarker.bloodGroup}
            </div>
          )}
        </div>
      )}

      {/* Manual zoom/navigation placeholder for Apple-map-like sleek look */}
      <div className="absolute right-4 top-4 flex flex-col gap-1">
        <button className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 font-bold hover:bg-slate-800 hover:text-slate-100 transition flex items-center justify-center text-sm shadow-md" aria-label="Zoom in">+</button>
        <button className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 font-bold hover:bg-slate-800 hover:text-slate-100 transition flex items-center justify-center text-sm shadow-md" aria-label="Zoom out">-</button>
      </div>
    </div>
  );
}
