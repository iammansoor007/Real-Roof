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
    { id: 'tpo', label: 'Commercial TPO', basePrice: 8.5, icon: 'Building2', desc: 'Energy-efficient, reflective single-ply membrane flat roof.' },
    { id: 'flat', label: 'Modified Bitumen / Flat', basePrice: 7.0, icon: 'Building', desc: 'Heavy-duty multi-ply built-up system for commercial structures.' }
  ];

  const services = [
    { id: 'commercial', label: 'Commercial Roofing', multiplier: 1.2, icon: 'Building2', desc: 'Full-scale logistics, crane operations, and commercial safety.' },
    { id: 'multi-family', label: 'Multi-Family Roofing', multiplier: 1.1, icon: 'UserGroupIcon', desc: 'Tenant-conscious scheduling for apartments, HOAs, and condos.' },
    { id: 'storm', label: 'Storm Restoration', multiplier: 1.3, icon: 'CloudRain', desc: 'Insurance claims assistance, storm damage appraisal & repair.' },
    { id: 'installation', label: 'Installation Partnerships', multiplier: 0.9, icon: 'Wrench', desc: 'Subcontracted structural assistance and builder collaborations.' }
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
      className="relative py-24 lg:py-32 overflow-hidden bg-white group"
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

      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        {/* Dynamic Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: High-End Informational Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 bg-primary/8 border border-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-[0.25em] px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Vetted Estimates
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight font-heading">
                Instant Roof <br />
                <span className="text-primary relative inline-block">Estimator<span className="absolute bottom-1.5 left-0 right-0 h-1.5 bg-primary/10 -rotate-1 rounded-full" /></span>
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium text-base max-w-md">
                Get an immediate data-driven cost bracket for your project. Our system cross-references material specifications with local Southeast labor logs.
              </p>
            </div>

            {/* Premium Workflow Steps Checklist */}
            <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/80 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Icon name="ClipboardCheck" className="w-4 h-4 text-primary" />
                Vetting Pipeline
              </h4>
              
              {[
                { s: "01", t: "Specify Deck Dimensions", d: "Select presets or enter your square footage." },
                { s: "02", t: "Choose Material Grade", d: "Tailor shingles, metal, TPO, or flat options." },
                { s: "03", t: "Instant Price Appraisal", d: "Receive an direct local cost bracket." }
              ].map((stepItem, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-xs font-black text-primary/40 pt-0.5">{stepItem.s}</div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm tracking-tight">{stepItem.t}</h5>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium leading-relaxed">{stepItem.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vetted Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon name="Lock" className="w-4.5 h-4.5 text-primary" />
                </div>
                <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Secured</h5>
                <p className="text-[10px] text-slate-400 mt-1 font-medium leading-normal">Encryption protocol active</p>
              </div>

              <div className="p-4 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon name="Award" className="w-4.5 h-4.5 text-primary" />
                </div>
                <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Licensed</h5>
                <p className="text-[10px] text-slate-400 mt-1 font-medium leading-normal">Vetted across 4 states</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Estimator Form Card (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative bg-slate-50/50 p-1.5 rounded-[2.5rem] border border-slate-100/80 shadow-[0_32px_64px_-24px_rgba(30,93,154,0.18)]">
              
              {/* Main Card */}
              <div className="relative bg-white border border-slate-100 rounded-[2.2rem] overflow-hidden">
                
                {/* Elegant Header Progress Stripe */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

                <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                {/* Header Stage Tracker */}
                <div className="px-8 pt-8 pb-6 bg-slate-50/50 border-b border-slate-100">
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
                          className={`absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ${
                            step >= s ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Panel Wrapper */}
                <div className="p-8 md:p-10 relative">

                  {/* ── STEP 1 ── */}
                  {step === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Property Dimensions</h3>
                        <p className="text-slate-400 text-sm mt-1">Select a common configuration or input your exact square footage.</p>
                      </div>

                      {/* Preset Helper Tags */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {presets.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData({ ...formData, sqft: preset.size })}
                            className={`p-3 rounded-xl border text-center transition-all duration-300 ${
                              formData.sqft === preset.size
                                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                                : 'border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50 bg-slate-50/50'
                            }`}
                          >
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{preset.label}</div>
                            <div className="text-xs font-black mt-0.5">{preset.size} SQFT</div>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2.5">
                        <label htmlFor="sqft" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                          Or Enter Custom Square Footage <span className="text-primary">*</span>
                        </label>
                        <div className="relative group/input flex items-center">
                          <div className="absolute left-4 text-slate-400">
                            <Icon name="Square" className="w-5 h-5 text-slate-400" />
                          </div>
                          <input
                            id="sqft"
                            type="number"
                            placeholder="e.g. 2500"
                            className="w-full border border-slate-200 rounded-xl pl-12 pr-16 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-slate-50/50 hover:border-slate-300"
                            value={formData.sqft}
                            onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                          />
                          <span className="absolute right-4 text-xs font-extrabold text-slate-400 uppercase">SQFT</span>
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">Input your overall roof deck size (minimum 100 sq ft).</p>
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={handleNext}
                          disabled={!formData.sqft || parseInt(formData.sqft) < 100}
                          className="relative overflow-hidden bg-primary text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl disabled:opacity-40 hover:bg-primary/95 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,93,154,0.4)] hover:-translate-y-0.5 group/btn"
                        >
                          <span className="relative z-10 flex items-center gap-2">Continue <Icon name="ArrowRight" className="w-4 h-4 text-white" /></span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2 ── */}
                  {step === 2 && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Material & Division</h3>
                        <p className="text-slate-400 text-sm mt-1">Vetting service scale and product grade multipliers.</p>
                      </div>

                      <div className="space-y-6">
                        {/* Services Required */}
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                            Service Class Selection <span className="text-primary">*</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {services.map(s => (
                              <button
                                key={s.id}
                                onClick={() => setFormData({ ...formData, service: s.id })}
                                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex gap-4 group/opt ${
                                  formData.service === s.id
                                    ? 'border-primary bg-primary/5 shadow-[0_4px_16px_rgba(30,93,154,0.08)]'
                                    : 'border-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-50 bg-slate-50/50'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  formData.service === s.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  <Icon name={s.icon} className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{s.label}</h4>
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                      formData.service === s.id ? 'bg-primary border-primary text-white text-[10px]' : 'border-slate-200'
                                    }`}>
                                      {formData.service === s.id && '✓'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">{s.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Material Grades */}
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                            Material System Specification <span className="text-primary">*</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {roofTypes.map(r => (
                              <button
                                key={r.id}
                                onClick={() => setFormData({ ...formData, roofType: r.id })}
                                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex gap-4 group/opt ${
                                  formData.roofType === r.id
                                    ? 'border-primary bg-primary/5 shadow-[0_4px_16px_rgba(30,93,154,0.08)]'
                                    : 'border-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-50 bg-slate-50/50'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  formData.roofType === r.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  <Icon name={r.icon} className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{r.label}</h4>
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                      formData.roofType === r.id ? 'bg-primary border-primary text-white text-[10px]' : 'border-slate-200'
                                    }`}>
                                      {formData.roofType === r.id && '✓'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">{r.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex justify-between">
                        <button onClick={handleBack} className="text-slate-500 font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                          ← Back
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!formData.service || !formData.roofType}
                          className="relative overflow-hidden bg-primary text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl disabled:opacity-40 hover:bg-primary/95 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,93,154,0.4)] hover:-translate-y-0.5 group/btn"
                        >
                          <span className="relative z-10 flex items-center gap-2">Continue <Icon name="ArrowRight" className="w-4 h-4 text-white" /></span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 3 ── */}
                  {step === 3 && (
                    <form onSubmit={handleCalculate} className="space-y-6 animate-in fade-in duration-500">
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contact Information</h3>
                        <p className="text-slate-400 text-sm mt-1">Specify destination coordinates for your estimate schedule.</p>
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
                                <Icon name={field.icon} className="w-4.5 h-4.5 text-slate-400" />
                              </div>
                              <input
                                id={field.id}
                                type={field.type}
                                required
                                className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-slate-50/50 hover:border-slate-300"
                                value={formData[field.key]}
                                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                              />
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex justify-between">
                        <button type="button" onClick={handleBack} className="text-slate-500 font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                          ← Back
                        </button>
                        <button
                          type="submit"
                          className="relative overflow-hidden bg-primary text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-primary/95 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,93,154,0.4)] hover:-translate-y-0.5 group/btn"
                        >
                          <span className="relative z-10 flex items-center gap-2">Generate Quote <Icon name="Zap" className="w-4 h-4 text-white" /></span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ── STEP 4 (RESULTS) ── */}
                  {step === 4 && estimate && (
                    <div className="text-center py-4 animate-in fade-in duration-500">
                      
                      {/* Decorative Success Ring */}
                      <div className="mx-auto w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-75" />
                        <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(30,93,154,0.5)]">
                          <Icon name="Check" className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Estimate Generated</h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                        Based on local regional labor schedules and material logistics, here is your project cost range:
                      </p>

                      {/* High-End Quote Ticket */}
                      <div className="relative bg-gradient-to-br from-primary/5 via-white to-primary/[0.08] border border-primary/20 rounded-[2rem] p-8 my-8 max-w-md mx-auto overflow-hidden shadow-sm">
                        {/* decorative overlay grid */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(30,93,154,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                        
                        <div className="relative z-10">
                          <p className="text-[10px] font-extrabold text-primary/60 uppercase tracking-[0.25em] mb-2">Projected Budget Bracket</p>
                          
                          <div className="text-5xl font-black text-primary tracking-tight">
                            ${(estimate.min / 1000).toFixed(1)}k <span className="text-2xl font-bold text-slate-400 tracking-normal mx-1">/</span> ${(estimate.max / 1000).toFixed(1)}k
                          </div>
                          
                          {/* Detailed parameter checklist */}
                          <div className="mt-6 pt-6 border-t border-primary/10 text-xs text-slate-600 text-left space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-400 uppercase tracking-wide text-[9px]">Project Scope:</span>
                              <span className="font-bold text-slate-900">{formData.sqft} Sq.Ft.</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-400 uppercase tracking-wide text-[9px]">Material Grade:</span>
                              <span className="font-bold text-slate-900">{roofTypes.find(r => r.id === formData.roofType)?.label}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-400 uppercase tracking-wide text-[9px]">Service Division:</span>
                              <span className="font-bold text-slate-900">{services.find(s => s.id === formData.service)?.label}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 max-w-sm mx-auto">
                        <a
                          href="#contact"
                          className="relative overflow-hidden block w-full bg-primary text-white font-extrabold text-sm uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-primary/95 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(30,93,154,0.4)] hover:-translate-y-0.5 group/btn"
                        >
                          <span className="relative z-10">Schedule Formal Inspection</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </a>
                        
                        <button
                          onClick={() => { setStep(1); setFormData({ ...formData, sqft: '', roofType: '', service: '' }); setEstimate(null); }}
                          className="w-full text-primary font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-primary/30 hover:bg-primary/5 transition-all duration-300"
                        >
                          Configure New Estimate
                    </button>
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
