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
  { name: "Greenville, SC (HQ)", position: [34.8526, -82.3940] as [number, number], status: "Active Headquarters", details: "Main Logistics, Estimating & Project Management HQ", iconType: hqIcon },
  { name: "Columbia, SC", position: [34.0007, -81.0348] as [number, number], status: "Dispatch Center", details: "Regional Crew Coordination & Storm Deployment Hub", iconType: customIcon },
  { name: "Charlotte, NC", position: [35.2271, -80.8431] as [number, number], status: "Regional Hub", details: "Residential Partnerships & Commercial Project Office", iconType: customIcon },
  { name: "Atlanta, GA", position: [33.7490, -84.3880] as [number, number], status: "Regional Hub", details: "Large-Scale Flat Roof & Commercial Fleet Logistics", iconType: customIcon },
  { name: "Knoxville, TN", position: [35.9606, -83.9207] as [number, number], status: "Dispatch Center", details: "East TN Residential Services & Installation Support", iconType: customIcon }
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
              <span style="color: #64748b; font-size: 12px; font-weight: 500;">${loc.status}</span>
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
      className="py-24 lg:py-32 bg-white relative border-b border-slate-100 group"
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`
      } as React.CSSProperties}
    >
      {/* ── Background Decors matching Estimator ── */}
      {/* Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(30,93,154,0.07)_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />
      
      {/* Interactive mouse follow radial spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(30, 93, 154, 0.08), transparent 80%)`
        }}
      />
      
      {/* Glow Orbs */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16">
          
          {/* Left Content Area */}
          <div className="lg:w-[45%] flex flex-col justify-between py-2">
            
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-[0.2em] px-5 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                Live Network & Logistics
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Southeast Coverage <br />
                <span className="text-primary">Without Limits</span>
              </h2>
              <p className="text-slate-500 leading-relaxed max-w-lg font-medium text-base">
                With operating hubs and dispatch centers across four major states, we deploy massive crews and manage complex commercial installations simultaneously. Click on a region below to locate our operations.
              </p>
            </div>

            {/* Location selector buttons */}
            <div className="mt-8 space-y-3">
              {locations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLocationClick(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group/item relative overflow-hidden ${
                    activeLocIndex === idx
                      ? 'border-primary bg-primary/5 shadow-[0_4px_20px_-6px_rgba(30,93,154,0.12)]'
                      : 'border-slate-100 hover:border-primary/30 hover:bg-slate-50/50 bg-white/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeLocIndex === idx ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 group-hover/item:bg-primary/10 group-hover/item:text-primary'
                  }`}>
                    <Icon name={idx === 0 ? "Building2" : "MapPin"} className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{loc.name}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        activeLocIndex === idx ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {loc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed max-w-sm">{loc.details}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Performance Stats Counters to fill blank space */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
              {[
                { val: "2hr", desc: "Dispatch Time" },
                { val: "120+", desc: "Local Roofers" },
                { val: "15M+", desc: "Sq.Ft. Installed" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 transition-all">
                  <div className="text-2xl font-black text-primary tracking-tight">{stat.val}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.desc}</div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Map Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-[55%] w-full h-[500px] lg:h-auto min-h-[500px] relative rounded-[2rem] shadow-[0_32px_64px_-20px_rgba(30,93,154,0.15)] border border-slate-100 overflow-hidden z-0 bg-slate-50 group/map"
          >
            <div className="absolute inset-0 bg-slate-50 animate-pulse pointer-events-none" />
            <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-white" />
            
            {/* Elegant Map Vignette & Border overlay */}
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.06)] pointer-events-none border border-slate-100 rounded-[2rem]" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
