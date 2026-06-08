"use client";
import { useState } from 'react';
import { Icon } from '../config/icons';

export default function InteractiveQuoteTool() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sqft: '',
    roofType: '',
    service: '',
    name: '',
    email: '',
    phone: ''
  });
  const [estimate, setEstimate] = useState<{ min: number, max: number } | null>(null);

  const roofTypes = [
    { id: 'shingle', label: 'Architectural Shingle', basePrice: 4.5, icon: 'Home', desc: 'Highly popular, cost-effective, classic shingle aesthetics.' },
    { id: 'metal', label: 'Standing Seam Metal', basePrice: 12.0, icon: 'ShieldCheck', desc: 'Premium architectural metal panels with ultimate storm defense.' },
    { id: 'tpo', label: 'Commercial TPO', basePrice: 8.5, icon: 'Sun', desc: 'Energy-efficient, reflective single-ply membrane flat roof.' },
    { id: 'flat', label: 'Modified Bitumen / Flat', basePrice: 7.0, icon: 'Layers', desc: 'Heavy-duty multi-ply built-up system for commercial structures.' }
  ];

  const services = [
    { id: 'commercial', label: 'Commercial Roofing', multiplier: 1.2, icon: 'Building2', desc: 'Full-scale logistics, crane operations, and commercial safety.' },
    { id: 'multi-family', label: 'Multi-Family Roofing', multiplier: 1.1, icon: 'Users', desc: 'Tenant-conscious scheduling for apartments, HOAs, and condos.' },
    { id: 'storm', label: 'Storm Restoration', multiplier: 1.3, icon: 'CloudLightning', desc: 'Insurance claims assistance, storm damage appraisal & repair.' },
    { id: 'installation', label: 'Installation Partnerships', multiplier: 0.9, icon: 'Handshake', desc: 'Subcontracted structural assistance and builder collaborations.' }
  ];

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const sqftNum = parseInt(formData.sqft.replace(/,/g, ''));
    if (!sqftNum || sqftNum < 100) return;

    const roof = roofTypes.find(r => r.id === formData.roofType);
    const service = services.find(s => s.id === formData.service);
    if (!roof || !service) return;

    const baseCost = sqftNum * roof.basePrice * service.multiplier;
    const min = Math.floor(baseCost * 0.85);
    const max = Math.ceil(baseCost * 1.15);
    setEstimate({ min, max });

    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, email: formData.email, phone: formData.phone,
          type: 'Quote Request',
          subject: `New Quote Request - ${formData.sqft} SQFT`,
          message: `Generated a quote estimate for a ${formData.sqft} sqft ${roof.label} roof (${service.label}). Estimated cost: $${min} - $${max}.`,
          sqft: formData.sqft, roofType: roof.label, service: service.label,
          minEstimate: min, maxEstimate: max
        })
      });
    } catch (err) {
      console.error('Failed to save quote submission:', err);
    }
    setStep(4);
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  // Mouse coords for interactive dot grid glow
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const progressPct = step === 4 ? 100 : Math.round(((step - 1) / 3) * 100);

  const presets = [
    { label: 'Standard Home', size: '1800' },
    { label: 'Large Home', size: '2800' },
    { label: 'Estate Scale', size: '3800' },
    { label: 'Commercial Area', size: '5500' }
  ];

  return (
    <section
      id="quote"
      onMouseMove={handleMouseMove}
      className="relative py-16 md:py-24 lg:py-28 overflow-hidden bg-white group"
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`
      } as React.CSSProperties}
    >

      {/* ── Decorative Background Layer ── */}
      {/* Large primary blob — top left */}
      <div className="absolute -top-48 -left-48 w-[550px] h-[550px] bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
      {/* Large primary blob — bottom right */}
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[90px] pointer-events-none" />
      {/* Center soft wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(30,93,154,0.06)_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

      {/* Interactive mouse follow radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(30, 93, 154, 0.06), transparent 80%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">

        {/* Dynamic Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Left Column: High-End Informational Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-8">
            <div className="space-y-3 lg:space-y-4">
              <div className="inline-flex items-center gap-2.5 bg-primary/8 border border-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-[0.25em] px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Vetted Estimates
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight font-heading">
                Instant Roof <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent relative inline-block">
                  Estimator
                  <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-primary/20 rounded-full" />
                </span>
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium text-sm sm:text-base max-w-md">
                Get an immediate data-driven cost bracket for your project. Our system cross-references material specifications with local Southeast labor logs.
              </p>
            </div>

            {/* Premium Configuration Pipeline */}
            <div className="space-y-4">

              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.18em] flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                    <Icon name="ClipboardCheck" className="w-2.5 h-2.5 text-primary" />
                  </span>
                  Configuration Pipeline
                </h4>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              {/* Step Cards */}
              <div className="relative">
                {/* Connector line */}
                <div className="absolute left-5 top-12 bottom-12 w-px bg-slate-100" />

                <div className="space-y-2.5">
                  {[
                    { num: "01", t: "Dimensions",       d: "Set your roof square footage.",           icon: "Layout",     stepNum: 1 },
                    { num: "02", t: "Material & Class",  d: "Pick material grade and service type.",   icon: "Layers",     stepNum: 2 },
                    { num: "03", t: "Instant Estimate",  d: "Receive a live cost bracket instantly.",  icon: "TrendingUp", stepNum: 3 },
                  ].map((si, i) => {
                    const isActive    = step === si.stepNum;
                    const isCompleted = step > si.stepNum;
                    return (
                      <div
                        key={i}
                        className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-400 ${
                          isActive
                            ? "bg-primary/[0.04] border-primary/25 shadow-[0_4px_20px_rgba(30,93,154,0.10)]"
                            : isCompleted
                            ? "bg-slate-50 border-slate-150"
                            : "bg-white border-slate-200/80"
                        }`}
                      >
                        {/* Number / Check circle */}
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-400 ${
                          isActive
                            ? "bg-primary text-white shadow-[0_6px_16px_rgba(30,93,154,0.35)]"
                            : isCompleted
                            ? "bg-primary/10 text-primary"
                            : "bg-primary/6 text-primary/50 border border-dashed border-primary/20"
                        }`}>
                          {isCompleted
                            ? <Icon name="Check" className="w-4 h-4 stroke-[2.5px]" />
                            : <span className="text-[11px] font-black">{si.num}</span>
                          }
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h5 className={`text-sm font-extrabold tracking-tight leading-none mb-0.5 ${
                            isActive ? "text-slate-900" : isCompleted ? "text-slate-700" : "text-slate-700"
                          }`}>{si.t}</h5>
                          <p className={`text-[11px] font-medium leading-relaxed ${
                            isActive ? "text-slate-500" : isCompleted ? "text-slate-400" : "text-slate-400"
                          }`}>{si.d}</p>
                        </div>

                        {/* Right badge */}
                        {isActive && (
                          <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                        {isCompleted && (
                          <span className="shrink-0 text-[9px] font-extrabold text-primary bg-primary/8 px-2 py-0.5 rounded-full">Done</span>
                        )}
                        {!isActive && !isCompleted && (
                          <span className="shrink-0 text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Next</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>


            {/* Vetted Trust Indicators */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl group/trust hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover/trust:scale-110 transition-transform duration-300">
                  <Icon name="Lock" className="w-4 h-4 text-primary" />
                </div>
                <h5 className="font-extrabold text-slate-900 text-[10px] sm:text-xs uppercase tracking-wider group-hover/trust:text-primary transition-colors">Secured</h5>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-medium leading-normal">Encryption protocol active</p>
              </div>

              <div className="p-3.5 sm:p-4 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl group/trust hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover/trust:scale-110 transition-transform duration-300">
                  <Icon name="Award" className="w-4 h-4 text-primary" />
                </div>
                <h5 className="font-extrabold text-slate-900 text-[10px] sm:text-xs uppercase tracking-wider group-hover/trust:text-primary transition-colors">Licensed</h5>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-medium leading-normal">Vetted across 4 states</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Estimator Form Card (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative bg-slate-50/50 p-1 sm:p-1.5 rounded-3xl sm:rounded-[2.5rem] border border-slate-100/80 shadow-[0_32px_64px_-24px_rgba(30,93,154,0.18)]">

              {/* Main Card */}
              <div className="relative bg-white border border-slate-100 rounded-2xl sm:rounded-[2.2rem] overflow-hidden">

                {/* Elegant Header Progress Stripe */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

                <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                {/* Header Stage Tracker */}
                <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">
                      {step === 4 ? 'Analysis Complete' : `Configuration Step ${step} of 3`}
                    </span>
                    <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-extrabold">
                      <Icon name="Zap" className="w-3.5 h-3.5" />
                      <span>{progressPct}% Done</span>
                    </div>
                  </div>

                  {/* Advanced Step Visual Pills */}
                  <div className="flex gap-2">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-slate-200/60 relative">
                        <div
                          className={`absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ${step >= s ? 'w-full' : 'w-0'
                            }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Panel Wrapper with dynamic height to prevent overflow on mobile while maintaining limits */}
                <div className="p-4 sm:p-6 md:p-8 relative h-auto min-h-[500px] sm:h-[640px] lg:h-[600px] flex flex-col justify-between overflow-y-auto sm:overflow-y-visible pb-6">

                  {/* ── STEP 1 ── */}
                  {step === 1 && (
                    <div className="animate-in fade-in duration-500 flex-1 flex flex-col justify-center space-y-8 py-2">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Property Dimensions</h3>
                          <p className="text-slate-400 text-xs sm:text-sm mt-1">Select a common configuration or input your exact square footage.</p>
                        </div>

                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">Estimate Size</span>
                          <div className="flex items-baseline justify-center mt-2 gap-1.5">
                            <span className="text-4xl sm:text-5xl md:text-6xl font-black text-primary tracking-tighter">
                              {parseInt(formData.sqft || '2500').toLocaleString()}
                            </span>
                            <span className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">SQFT</span>
                          </div>
                        </div>

                        {/* Sliding Tape Measure Rule */}
                        <div className="space-y-4">
                          <div className="relative pt-4">
                            <input
                              type="range"
                              min="500"
                              max="8000"
                              step="100"
                              value={formData.sqft || '2500'}
                              onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-ew-resize accent-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              style={{
                                background: `linear-gradient(to right, #1E5D9A 0%, #1E5D9A ${((parseInt(formData.sqft || '2500') - 500) / 7500) * 100}%, #f1f5f9 ${((parseInt(formData.sqft || '2500') - 500) / 7500) * 100}%, #f1f5f9 100%)`
                              }}
                            />
                            {/* Visual Ruler Ticks */}
                            <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-300 font-extrabold px-1 mt-2.5 select-none">
                              <span>500</span>
                              <span>2k</span>
                              <span>3.5k</span>
                              <span>5k</span>
                              <span>6.5k</span>
                              <span>8k+</span>
                            </div>
                          </div>

                          {/* Presets Cards */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                            {presets.map((preset, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setFormData({ ...formData, sqft: preset.size })}
                                className={`py-2 px-1 rounded-xl border text-center transition-all duration-300 ${formData.sqft === preset.size
                                  ? 'border-primary bg-primary/5 text-primary font-bold'
                                  : 'border-slate-100 text-slate-500 hover:border-slate-200 bg-slate-50/40 text-xs'
                                  }`}
                              >
                                <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">{preset.label}</div>
                                <div className="text-xs font-black mt-0.5">{preset.size}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={handleNext}
                          disabled={!formData.sqft || parseInt(formData.sqft) < 100}
                          className="relative overflow-hidden w-full sm:w-auto bg-primary text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl disabled:opacity-40 hover:bg-primary/95 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,93,154,0.4)] hover:-translate-y-0.5 group/btn"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">Continue <Icon name="ArrowRight" className="w-4 h-4 text-white" /></span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2 ── */}
                  {step === 2 && (
                    <div className="animate-in fade-in duration-500 flex-1 flex flex-col justify-center space-y-8 py-2">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Material & Division</h3>
                          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Vetting service scale and product grade multipliers.</p>
                        </div>

                        <div className="space-y-3.5">
                          {/* Services Required */}
                          <div>
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                              <span className="w-1 h-1 bg-primary rounded-full" />
                              Service Class Selection <span className="text-primary">*</span>
                            </label>
                            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 gap-2.5">
                              {services.map(s => (
                                <button
                                  key={s.id}
                                  onClick={() => setFormData({ ...formData, service: s.id })}
                                  className={`p-2.5 rounded-xl border text-left transition-all duration-300 flex items-center gap-2.5 group/opt relative overflow-hidden ${formData.service === s.id
                                    ? 'border-primary bg-gradient-to-br from-primary/5 to-transparent shadow-[0_8px_20px_-6px_rgba(30,93,154,0.12)] -translate-y-0.5'
                                    : 'border-slate-100 text-slate-700 hover:border-slate-200 hover:bg-slate-50/80 bg-slate-50/50 hover:-translate-y-0.5 hover:shadow-sm'
                                    }`}
                                >
                                  {/* Left accent bar on hover/active */}
                                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${formData.service === s.id ? 'bg-primary' : 'bg-transparent group-hover/opt:bg-slate-200'
                                    }`} />

                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${formData.service === s.id
                                    ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-md shadow-primary/20 scale-105'
                                    : 'bg-white text-slate-400 border border-slate-100 shadow-sm group-hover/opt:text-primary group-hover/opt:border-primary/25'
                                    }`}>
                                    <Icon name={s.icon} className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0 flex items-center justify-between pl-1">
                                    <h4 className={`font-extrabold text-xs sm:text-sm tracking-tight truncate pr-2 transition-colors duration-300 ${formData.service === s.id ? 'text-slate-900' : 'text-slate-700 group-hover/opt:text-slate-900'
                                      }`}>{s.label}</h4>

                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${formData.service === s.id
                                      ? 'bg-primary border-primary shadow-sm scale-110'
                                      : 'border-slate-200 bg-white group-hover/opt:border-slate-300'
                                      }`}>
                                      {formData.service === s.id ? (
                                        <Icon name="Check" className="w-2.5 h-2.5 text-white stroke-[3px]" />
                                      ) : (
                                        <div className="w-1 h-1 rounded-full bg-transparent group-hover/opt:bg-slate-100" />
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Material Grades */}
                          <div>
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                              <span className="w-1 h-1 bg-primary rounded-full" />
                              Material System Specification <span className="text-primary">*</span>
                            </label>
                            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 gap-2.5">
                              {roofTypes.map(r => (
                                <button
                                  key={r.id}
                                  onClick={() => setFormData({ ...formData, roofType: r.id })}
                                  className={`p-2.5 rounded-xl border text-left transition-all duration-300 flex items-center gap-2.5 group/opt relative overflow-hidden ${formData.roofType === r.id
                                    ? 'border-primary bg-gradient-to-br from-primary/5 to-transparent shadow-[0_8px_20px_-6px_rgba(30,93,154,0.12)] -translate-y-0.5'
                                    : 'border-slate-100 text-slate-700 hover:border-slate-200 hover:bg-slate-50/80 bg-slate-50/50 hover:-translate-y-0.5 hover:shadow-sm'
                                    }`}
                                >
                                  {/* Left accent bar on hover/active */}
                                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${formData.roofType === r.id ? 'bg-primary' : 'bg-transparent group-hover/opt:bg-slate-200'
                                    }`} />

                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${formData.roofType === r.id
                                    ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-md shadow-primary/20 scale-105'
                                    : 'bg-white text-slate-400 border border-slate-100 shadow-sm group-hover/opt:text-primary group-hover/opt:border-primary/25'
                                    }`}>
                                    <Icon name={r.icon} className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0 flex items-center justify-between pl-1">
                                    <h4 className={`font-extrabold text-xs sm:text-sm tracking-tight truncate pr-2 transition-colors duration-300 ${formData.roofType === r.id ? 'text-slate-900' : 'text-slate-700 group-hover/opt:text-slate-900'
                                      }`}>{r.label}</h4>

                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${formData.roofType === r.id
                                      ? 'bg-primary border-primary shadow-sm scale-110'
                                      : 'border-slate-200 bg-white group-hover/opt:border-slate-300'
                                      }`}>
                                      {formData.roofType === r.id ? (
                                        <Icon name="Check" className="w-2.5 h-2.5 text-white stroke-[3px]" />
                                      ) : (
                                        <div className="w-1 h-1 rounded-full bg-transparent group-hover/opt:bg-slate-100" />
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-between gap-3">
                        <button onClick={handleBack} className="w-full sm:w-auto text-slate-500 font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                          ← Back
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!formData.service || !formData.roofType}
                          className="relative overflow-hidden w-full sm:w-auto bg-primary text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl disabled:opacity-40 hover:bg-primary/95 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,93,154,0.4)] hover:-translate-y-0.5 group/btn"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">Continue <Icon name="ArrowRight" className="w-4 h-4 text-white" /></span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 3 ── */}
                  {step === 3 && (
                    <form onSubmit={handleCalculate} className="animate-in fade-in duration-500 flex-1 flex flex-col justify-center space-y-8 py-2">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Contact Information</h3>
                          <p className="text-slate-400 text-xs sm:text-sm mt-1">Specify destination coordinates for your estimate schedule.</p>
                        </div>

                        <div className="space-y-4">
                          {[
                            { id: 'name', label: 'Full Name', type: 'text', icon: 'User', key: 'name' as const },
                            { id: 'email', label: 'Email Address', type: 'email', icon: 'Mail', key: 'email' as const },
                            { id: 'phone', label: 'Phone Number', type: 'tel', icon: 'Phone', key: 'phone' as const },
                          ].map(field => (
                            <div key={field.id} className="space-y-1.5">
                              <label htmlFor={field.id} className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                                {field.label} <span className="text-primary">*</span>
                              </label>
                              <div className="relative group/input flex items-center">
                                <div className="absolute left-4 text-slate-400">
                                  <Icon name={field.icon} className="w-4 h-4" />
                                </div>
                                <input
                                  id={field.id}
                                  type={field.type}
                                  required
                                  className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 sm:py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-slate-50/50 hover:border-slate-300"
                                  value={formData[field.key]}
                                  onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-between gap-3">
                        <button type="button" onClick={handleBack} className="w-full sm:w-auto text-slate-500 font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                          ← Back
                        </button>
                        <button
                          type="submit"
                          className="relative overflow-hidden w-full sm:w-auto bg-primary text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-primary/95 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,93,154,0.4)] hover:-translate-y-0.5 group/btn"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">Generate Quote <Icon name="Zap" className="w-4 h-4 text-white" /></span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ── STEP 4 (RESULTS) ── */}
                  {step === 4 && estimate && (
                    <div className="animate-in fade-in duration-500 flex-1 flex flex-col justify-center space-y-8 py-2">
                      <div className="space-y-4">
                        {/* Compact Success Indicator */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                            <Icon name="Check" className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight text-left">Estimate Generated</h3>
                            <p className="text-slate-400 text-xs text-left">Data cross-referenced with Southeast labor logs</p>
                          </div>
                        </div>

                        {/* High-End Compact Quote Ticket */}
                        <div className="relative bg-gradient-to-br from-primary/5 via-white to-primary/[0.08] border border-primary/20 rounded-2xl p-5 my-4 max-w-md mx-auto overflow-hidden shadow-sm">
                          {/* decorative overlay grid */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(30,93,154,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                          <div className="relative z-10">
                            <p className="text-[9px] font-extrabold text-primary/60 uppercase tracking-[0.2em] mb-1">Projected Budget Bracket</p>

                            <div className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                              ${(estimate.min / 1000).toFixed(1)}k <span className="text-lg font-bold text-slate-400 tracking-normal mx-0.5">/</span> ${(estimate.max / 1000).toFixed(1)}k
                            </div>

                            {/* Detailed parameter checklist */}
                            <div className="mt-4 pt-4 border-t border-primary/10 text-xs text-slate-600 text-left space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[8px]">Project Scope:</span>
                                <span className="font-bold text-slate-900 text-xs">{formData.sqft} Sq.Ft.</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[8px]">Material Grade:</span>
                                <span className="font-bold text-slate-900 text-xs">{roofTypes.find(r => r.id === formData.roofType)?.label}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[8px]">Service Division:</span>
                                <span className="font-bold text-slate-900 text-xs">{services.find(s => s.id === formData.service)?.label}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Side-by-side action buttons */}
                      <div className="pt-4 border-t border-slate-100 w-full">
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
                          <a
                            href="#contact"
                            className="relative overflow-hidden flex-1 bg-primary text-white font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-primary/95 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,93,154,0.4)] hover:-translate-y-0.5 group/btn text-center flex items-center justify-center"
                          >
                            <span className="relative z-10">Schedule Inspection</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                          </a>

                          <button
                            onClick={() => { setStep(1); setFormData({ ...formData, sqft: '', roofType: '', service: '' }); setEstimate(null); }}
                            className="flex-1 text-primary font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-primary/30 hover:bg-primary/5 transition-all duration-300"
                          >
                            New Estimate
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
