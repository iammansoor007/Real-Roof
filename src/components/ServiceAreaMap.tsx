"use client";
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Icon } from '../config/icons';

// Custom Map Markers
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hqIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const locations = [
  { name: "Greenville, SC (HQ)", position: [34.8526, -82.3940] as [number, number], coordsStr: "34.85° N, 82.39° W", status: "Active Headquarters", details: "Main Logistics, Estimating & Project Management HQ", iconType: hqIcon },
  { name: "Columbia, SC", position: [34.0007, -81.0348] as [number, number], coordsStr: "34.00° N, 81.03° W", status: "Dispatch Center", details: "Regional Crew Coordination & Storm Deployment Hub", iconType: customIcon },
  { name: "Charlotte, NC", position: [35.2271, -80.8431] as [number, number], coordsStr: "35.22° N, 80.84° W", status: "Regional Hub", details: "Residential Partnerships & Commercial Project Office", iconType: customIcon },
  { name: "Atlanta, GA", position: [33.7490, -84.3880] as [number, number], coordsStr: "33.74° N, 84.38° W", status: "Regional Hub", details: "Large-Scale Flat Roof & Commercial Fleet Logistics", iconType: customIcon },
  { name: "Knoxville, TN", position: [35.9606, -83.9207] as [number, number], coordsStr: "35.96° N, 83.92° W", status: "Dispatch Center", details: "East TN Residential Services & Installation Support", iconType: customIcon }
];

export default function ServiceAreaMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [activeLocIndex, setActiveLocIndex] = useState(0);

  // Mouse coords for interactive dot grid glow
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const container = mapContainerRef.current as any;
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: false
      }).setView([34.8526, -82.3940], 6);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;

      // CartoDB Positron premium light map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);

      // Subtle HQ Coverage Radius (320km)
      L.circle([34.8526, -82.3940], {
        color: '#1E5D9A',
        fillColor: '#1E5D9A',
        fillOpacity: 0.04,
        weight: 1.5,
        dashArray: '6, 6',
        radius: 320000
      }).addTo(map);

      // Add markers & save instances
      markersRef.current = locations.map((loc) => {
        return L.marker(loc.position, { icon: loc.iconType })
          .addTo(map)
          .bindPopup(`
            <div style="padding: 4px; font-family: sans-serif;">
              <strong style="color: #1E5D9A; font-size: 14px;">${loc.name}</strong><br/>
              <span style="color: #64748b; font-size: 11px; font-weight: 500;">${loc.status}</span>
            </div>
          `);
      });

      // Default active marker open
      setTimeout(() => {
        if (markersRef.current[0]) {
          markersRef.current[0].openPopup();
        }
      }, 500);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleLocationClick = (index: number) => {
    setActiveLocIndex(index);
    const loc = locations[index];
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc.position, 8, { duration: 1.2 });
    }
    // Close existing popups first
    markersRef.current.forEach(m => m.closePopup());
    // Open selected popup
    setTimeout(() => {
      if (markersRef.current[index]) {
        markersRef.current[index].openPopup();
      }
    }, 1000);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="py-16 md:py-24 lg:py-28 bg-slate-50/50 relative border-b border-slate-100 group overflow-hidden"
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`
      } as React.CSSProperties}
    >
      {/* ── Background Decors ── */}
      <div className="absolute inset-0 bg-white pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(30,93,154,0.05)_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(30, 93, 154, 0.05), transparent 80%)`
        }}
      />

      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/[0.04] rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">

        {/* Swapped layout container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">

          {/* Left Column: Map visualization (Swapped to Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 w-full h-[350px] sm:h-[450px] lg:h-auto min-h-[350px] sm:min-h-[450px] lg:min-h-[550px] relative rounded-3xl sm:rounded-[2.5rem] shadow-[0_36px_72px_-20px_rgba(30,93,154,0.15)] border border-slate-100 overflow-hidden z-0 bg-slate-50 order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-slate-50 animate-pulse pointer-events-none" />
            <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-white" />

            {/* Elegant Map Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.06)] pointer-events-none border border-slate-100 rounded-3xl sm:rounded-[2.5rem]" />
          </motion.div>

          {/* Right Column: High-End Flight Coordination List Board (Swapped to Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 order-1 lg:order-2 space-y-6 lg:space-y-8">

            <div className="space-y-4 lg:space-y-5">
              <span className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-[0.2em] px-5 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                Live Logistics Command
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight font-heading">
                Southeast Logistics <br />
                <span className="text-primary relative inline-block">Dispatch Network<span className="absolute bottom-1.5 left-0 right-0 h-1.5 bg-primary/10 -rotate-1 rounded-full" /></span>
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium text-xs sm:text-sm">
                With hubs and dispatch centers across four major states, we coordinate materials and deploy crews. Click a regional hub below to focus.
              </p>
            </div>

            {/* Premium Flight-board Selector list */}
            <div className="space-y-3">
              {locations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLocationClick(idx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-350 flex items-center gap-3 sm:gap-4 group/item relative overflow-hidden bg-white/70 backdrop-blur-sm ${activeLocIndex === idx
                    ? 'border-primary bg-primary/5 shadow-[0_12px_28px_-10px_rgba(30,93,154,0.15)] ring-1 ring-primary/10 -translate-y-0.5'
                    : 'border-slate-100/80 hover:border-primary/25 hover:bg-slate-50/50 hover:shadow-sm'
                    }`}
                >
                  {/* Status Indicator Dot */}
                  <span className={`absolute top-3.5 right-4 w-1.5 h-1.5 rounded-full ${activeLocIndex === idx ? 'bg-primary animate-pulse' : 'bg-emerald-400'
                    }`} />

                  {/* Left Icon badge */}
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${activeLocIndex === idx ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                    }`}>
                    <Icon name="MapPin" className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-[11px] sm:text-xs tracking-tight truncate">{loc.name}</h4>
                      <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 font-bold shrink-0 hidden sm:inline-block">{loc.coordsStr}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1 sm:mt-1.5 gap-2">
                      <span className={`text-[7px] sm:text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0 ${activeLocIndex === idx ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                        }`}>
                        {loc.status}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 truncate font-medium flex-1 text-right sm:text-left">{loc.details}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Performance Stats Counters in Light Mode */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 lg:pt-6 border-t border-slate-100">
              {[
                { val: "2hr", desc: "Dispatch Lead" },
                { val: "120+", desc: "Local Builders" },
                { val: "15M+", desc: "Sq.Ft. Installed" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 transition-all shadow-sm">
                  <div className="text-lg sm:text-2xl font-black text-primary tracking-tight">{stat.val}</div>
                  <div className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 leading-tight">{stat.desc}</div>
                </div>
              ))}
            </div>

            {/* Live activity ticker at the bottom */}
            <div className="bg-slate-100/50 border border-slate-200/50 p-3 rounded-2xl flex items-center gap-3 overflow-hidden">
              <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0 animate-pulse relative z-10" />
              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .marquee-container {
                  display: flex;
                  width: max-content;
                  animation: marquee 30s linear infinite;
                }
              `}} />
              <div className="relative w-full overflow-hidden flex items-center h-4">
                <div className="marquee-container text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  <span className="whitespace-nowrap pr-8">
                    Active Deployments: Greenville HQ coordinating 14 crew dispatches today • Columbia dispatch center logging storm restoration appraisals • Atlanta commercial roofing loading 4 heavy transport carriers •
                  </span>
                  <span className="whitespace-nowrap pr-8">
                    Active Deployments: Greenville HQ coordinating 14 crew dispatches today • Columbia dispatch center logging storm restoration appraisals • Atlanta commercial roofing loading 4 heavy transport carriers •
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
