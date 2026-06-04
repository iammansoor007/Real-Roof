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
    { id: 'shingle', label: 'Architectural Shingle', basePrice: 4.5, icon: 'Home' },
    { id: 'metal', label: 'Standing Seam Metal', basePrice: 12.0, icon: 'ShieldCheck' },
    { id: 'tpo', label: 'Commercial TPO', basePrice: 8.5, icon: 'Building2' },
    { id: 'flat', label: 'Modified Bitumen / Flat', basePrice: 7.0, icon: 'Building' }
  ];

  const services = [
    { id: 'commercial', label: 'Commercial Roofing', multiplier: 1.2, icon: 'Building2' },
    { id: 'multi-family', label: 'Multi-Family Roofing', multiplier: 1.1, icon: 'UserGroupIcon' },
    { id: 'storm', label: 'Storm Restoration & Claims', multiplier: 1.3, icon: 'CloudRain' },
    { id: 'installation', label: 'Installation Partnerships', multiplier: 0.9, icon: 'Wrench' }
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
      <div className="absolute -top-48 -left-48 w-[550px] h-[550px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
      {/* Large primary blob — bottom right */}
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[90px] pointer-events-none" />
      {/* Center soft wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(30,93,154,0.07)_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />
      
      {/* Interactive mouse follow radial spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(30, 93, 154, 0.08), transparent 80%)`
        }}
      />

      {/* Diagonal lines grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diag-lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="#1E5D9A" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag-lines)" />
      </svg>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Instant Estimator
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Request an <span className="text-primary">Estimate</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Provide a few details below to receive an instant, data-driven cost bracket for your roofing project.
          </p>
        </div>

        {/* Card */}
        <div className="relative bg-white border border-slate-100 rounded-3xl shadow-[0_32px_64px_-20px_rgba(30,93,154,0.15)] overflow-hidden">

          {/* Card inner top gradient line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Card decorative blobs inside */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          {/* Progress Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {step === 4 ? 'Complete' : `Step ${step} of 3`}
              </span>
              <span className="text-xs font-bold text-primary">{progressPct}%</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary/70 via-primary to-primary/80 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${progressPct}%` }}
              >
                {/* Animated shimmer on bar */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite] rounded-full" />
              </div>
            </div>
            {/* Step indicators */}
            <div className="flex gap-0 mt-5">
              {['Property Info', 'Parameters', 'Your Details'].map((label, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    step > i + 1
                      ? 'bg-primary border-primary text-white shadow-[0_0_12px_rgba(30,93,154,0.4)]'
                      : step === i + 1
                        ? 'bg-white border-primary text-primary shadow-[0_0_8px_rgba(30,93,154,0.2)]'
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide hidden sm:block text-center ${
                    step >= i + 1 ? 'text-primary' : 'text-slate-400'
                  }`}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent mx-8" />

          {/* Form Steps */}
          <div className="p-8 md:p-10">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900">Property Information</h3>

                <div className="space-y-2">
                  <label htmlFor="sqft" className="block text-sm font-semibold text-slate-700">
                    Approximate Square Footage <span className="text-primary">*</span>
                  </label>
                  <div className="relative group/input">
                    <input
                      id="sqft"
                      type="number"
                      placeholder="e.g. 2500"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 bg-slate-50/50 hover:border-primary/40"
                      value={formData.sqft}
                      onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                    />
                    {/* Focus glow line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                  </div>
                  <p className="text-sm text-slate-400">Enter the total size of the roof (minimum 100 sq ft).</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!formData.sqft || parseInt(formData.sqft) < 100}
                    className="relative overflow-hidden bg-primary text-white font-bold px-8 py-3.5 rounded-xl disabled:opacity-40 hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(30,93,154,0.5)] hover:shadow-[0_12px_32px_-6px_rgba(30,93,154,0.6)] hover:-translate-y-0.5 group/btn"
                  >
                    <span className="relative z-10 flex items-center gap-2">Continue <Icon name="ChevronRight" className="w-4 h-4" /></span>
                    {/* Button shimmer */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900">Project Parameters</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Service Required <span className="text-primary">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setFormData({ ...formData, service: s.id })}
                          className={`px-4 py-3.5 rounded-xl border text-sm font-semibold text-left transition-all duration-300 flex items-center justify-between group/opt ${
                            formData.service === s.id
                              ? 'border-primary bg-primary/8 text-primary shadow-[0_0_0_3px_rgba(30,93,154,0.12)] -translate-y-0.5'
                              : 'border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-primary/4 hover:text-primary bg-slate-50/50'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon name={s.icon} className={`w-5 h-5 transition-colors ${
                              formData.service === s.id ? 'text-primary' : 'text-slate-400 group-hover/opt:text-primary'
                            }`} />
                            <span>{s.label}</span>
                          </span>
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-300 ${
                            formData.service === s.id ? 'bg-primary border-primary text-white' : 'border-slate-300 group-hover/opt:border-primary/50'
                          }`}>
                            {formData.service === s.id && '✓'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Material Grade <span className="text-primary">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roofTypes.map(r => (
                        <button
                          key={r.id}
                          onClick={() => setFormData({ ...formData, roofType: r.id })}
                          className={`px-4 py-3.5 rounded-xl border text-sm font-semibold text-left transition-all duration-300 flex items-center justify-between group/opt ${
                            formData.roofType === r.id
                              ? 'border-primary bg-primary/8 text-primary shadow-[0_0_0_3px_rgba(30,93,154,0.12)] -translate-y-0.5'
                              : 'border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-primary/4 hover:text-primary bg-slate-50/50'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon name={r.icon} className={`w-5 h-5 transition-colors ${
                              formData.roofType === r.id ? 'text-primary' : 'text-slate-400 group-hover/opt:text-primary'
                            }`} />
                            <span>{r.label}</span>
                          </span>
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-300 ${
                            formData.roofType === r.id ? 'bg-primary border-primary text-white' : 'border-slate-300 group-hover/opt:border-primary/50'
                          }`}>
                            {formData.roofType === r.id && '✓'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button onClick={handleBack} className="text-slate-600 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                    ← Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!formData.service || !formData.roofType}
                    className="relative overflow-hidden bg-primary text-white font-bold px-8 py-3.5 rounded-xl disabled:opacity-40 hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(30,93,154,0.5)] hover:shadow-[0_12px_32px_-6px_rgba(30,93,154,0.6)] hover:-translate-y-0.5 group/btn"
                  >
                    <span className="relative z-10 flex items-center gap-2">Continue <Icon name="ChevronRight" className="w-4 h-4" /></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <form onSubmit={handleCalculate} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Contact Details</h3>
                  <p className="text-slate-500 text-sm mt-1">Where should we deliver your estimate?</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'name', label: 'Full Name', type: 'text', key: 'name' as const },
                    { id: 'email', label: 'Email Address', type: 'email', key: 'email' as const },
                    { id: 'phone', label: 'Phone Number', type: 'tel', key: 'phone' as const },
                  ].map(field => (
                    <div key={field.id} className="space-y-1.5">
                      <label htmlFor={field.id} className="block text-sm font-semibold text-slate-700">
                        {field.label} <span className="text-primary">*</span>
                      </label>
                      <div className="relative group/input">
                        <input
                          id={field.id}
                          type={field.type}
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 bg-slate-50/50 hover:border-primary/40"
                          value={formData[field.key]}
                          onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between">
                  <button type="button" onClick={handleBack} className="text-slate-600 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="relative overflow-hidden bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(30,93,154,0.5)] hover:shadow-[0_12px_32px_-6px_rgba(30,93,154,0.6)] hover:-translate-y-0.5 group/btn"
                  >
                    <span className="relative z-10 flex items-center gap-2">Generate Estimate <Icon name="Zap" className="w-4 h-4 text-white" /></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 4 (RESULTS) ── */}
            {step === 4 && estimate && (
              <div className="text-center py-4 animate-in fade-in duration-500">
                <div className="mx-auto w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-[0_12px_32px_-8px_rgba(30,93,154,0.5)] text-xl">
                  <Icon name="Check" className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">Estimate Complete</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Based on the details provided, here is the projected cost bracket for your project.</p>

                {/* Result card */}
                <div className="relative bg-gradient-to-br from-primary/5 via-white to-primary/8 border border-primary/20 rounded-2xl p-8 mb-8 inline-block min-w-[300px] overflow-hidden">
                  {/* decorative corner blob */}
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -left-8 -bottom-8 w-20 h-20 bg-primary/8 rounded-full blur-xl pointer-events-none" />
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-[0.2em] mb-3 relative z-10">Projected Range</p>
                  <div className="text-5xl font-extrabold text-primary tracking-tight relative z-10">
                    ${(estimate.min / 1000).toFixed(1)}k – ${(estimate.max / 1000).toFixed(1)}k
                  </div>
                  <div className="mt-5 pt-5 border-t border-primary/10 text-sm text-slate-600 text-left space-y-2 relative z-10">
                    <p><span className="font-bold text-slate-900">Size:</span> {formData.sqft} sq.ft.</p>
                    <p><span className="font-bold text-slate-900">Material:</span> {roofTypes.find(r => r.id === formData.roofType)?.label}</p>
                    <p><span className="font-bold text-slate-900">Service:</span> {services.find(s => s.id === formData.service)?.label}</p>
                  </div>
                </div>

                <div className="space-y-3 max-w-sm mx-auto">
                  <a
                    href="#contact"
                    className="relative overflow-hidden block w-full bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(30,93,154,0.5)] hover:-translate-y-0.5 group/btn"
                  >
                    <span className="relative z-10">Schedule Formal Inspection</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </a>
                  <button
                    onClick={() => { setStep(1); setFormData({ ...formData, sqft: '', roofType: '', service: '' }); setEstimate(null); }}
                    className="block w-full text-primary font-semibold px-6 py-3.5 rounded-xl border border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  >
                    Start New Estimate
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
          {[
            { iconName: 'Lock', text: 'SSL Secured' },
            { iconName: 'Zap', text: 'Instant Results' },
            { iconName: 'Phone', text: 'No Obligation' },
            { iconName: 'Award', text: 'Licensed & Insured' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <Icon name={b.iconName} className="w-4 h-4 text-primary" />
              <span>{b.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
