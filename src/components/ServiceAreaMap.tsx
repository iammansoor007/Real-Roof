"use client";
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Premium Custom Map Markers
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

export default function ServiceAreaMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const container = mapContainerRef.current as any;
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: false // Disable default zoom to add it in a custom position if needed
      }).setView([34.8526, -82.3940], 6);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;

      // Premium Light Map Style (CartoDB Positron)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);

      // Subtle HQ Coverage Radius
      L.circle([34.8526, -82.3940], {
        color: '#1E5D9A',
        fillColor: '#1E5D9A',
        fillOpacity: 0.05,
        weight: 2,
        dashArray: '5, 5',
        radius: 320000 
      }).addTo(map);

      const locations = [
        { name: "Greenville, SC (HQ)", position: [34.8526, -82.3940] as [number, number], icon: hqIcon },
        { name: "Columbia, SC", position: [34.0007, -81.0348] as [number, number], icon: customIcon },
        { name: "Charlotte, NC", position: [35.2271, -80.8431] as [number, number], icon: customIcon },
        { name: "Atlanta, GA", position: [33.7490, -84.3880] as [number, number], icon: customIcon },
        { name: "Knoxville, TN", position: [35.9606, -83.9207] as [number, number], icon: customIcon }
      ];

      locations.forEach(loc => {
        L.marker(loc.position, { icon: loc.icon })
          .addTo(map)
          .bindPopup(`
            <div style="padding: 4px;">
              <strong style="color: #1E5D9A; font-size: 14px;">${loc.name}</strong><br/>
              <span style="color: #64748b;">Regional Operations Center</span>
            </div>
          `);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa] relative border-b border-slate-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="lg:w-[45%] space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#1E5D9A] text-sm font-bold tracking-widest uppercase mb-6 border border-blue-100">
                Logistics & Coverage
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight font-heading">
                Scale Without <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E5D9A] to-blue-400">Compromise.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mt-6 font-light max-w-md">
                Headquartered in Greenville, SC, our strategic multi-state infrastructure allows us to deploy massive crews and manage complex commercial installations simultaneously across the Southeast.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-[#1E5D9A]/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                   <svg className="w-5 h-5 text-[#1E5D9A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Corporate HQ</h4>
                <p className="text-sm text-slate-500 font-medium">Greenville, South Carolina</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-[#1E5D9A]/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                   <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">4 States</h4>
                <p className="text-sm text-slate-500 font-medium">Regional coverage hubs</p>
              </div>
            </motion.div>
          </div>

          {/* Right Map Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-[55%] w-full h-[500px] lg:h-[700px] relative rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] border-4 border-white overflow-hidden z-0 group"
          >
            <div className="absolute inset-0 bg-slate-100 animate-pulse" /> {/* Loading state */}
            <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-white" />
            
            {/* Elegant Map Overlay Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
