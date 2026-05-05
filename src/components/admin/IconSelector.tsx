"use client";

import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check } from "lucide-react";

// Filter out non-icon exports from Lucide
const ICON_NAMES = Array.from(new Set(Object.keys(LucideIcons).filter(
  (key) => typeof (LucideIcons as any)[key] === "function" || typeof (LucideIcons as any)[key] === "object"
))).sort();

export default function IconSelector({ 
  value, 
  onChange, 
  label = "Select Icon" 
}: { 
  value: string; 
  onChange: (val: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    if (!search) return ICON_NAMES.slice(0, 100); // Limit initial view for performance
    return ICON_NAMES.filter(name => 
      name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 100);
  }, [search]);

  const SelectedIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle;

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{label}</label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-primary/50 transition-all text-left shadow-sm group"
        >
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <SelectedIcon className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-sm font-medium text-slate-700 flex-1">{value || "Choose an icon..."}</span>
          <LucideIcons.ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-[60]" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[70] overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search icons (e.g. Shield, Star, Heart...)"
                      className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2 grid grid-cols-4 gap-2 custom-scrollbar">
                  {filteredIcons.map((name) => {
                    const IconComp = (LucideIcons as any)[name];
                    const isSelected = value === name;
                    
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          onChange(name);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all gap-2 group ${
                          isSelected 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "hover:bg-slate-50 text-slate-600 hover:text-primary"
                        }`}
                        title={name}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[8px] font-bold truncate w-full text-center uppercase tracking-tighter">
                          {name}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                  
                  {filteredIcons.length === 0 && (
                    <div className="col-span-4 py-10 text-center">
                      <p className="text-sm text-slate-400 font-medium">No icons found for "{search}"</p>
                    </div>
                  )}
                </div>
                
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Showing {filteredIcons.length} of {ICON_NAMES.length} icons
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
