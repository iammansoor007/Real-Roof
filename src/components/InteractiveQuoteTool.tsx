"use client";
import { useState } from 'react';

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
    { id: 'shingle', label: 'Architectural Shingle', basePrice: 4.5 },
    { id: 'metal', label: 'Standing Seam Metal', basePrice: 12.0 },
    { id: 'tpo', label: 'Commercial TPO', basePrice: 8.5 },
    { id: 'flat', label: 'Modified Bitumen / Flat', basePrice: 7.0 }
  ];

  const services = [
    { id: 'commercial', label: 'Commercial Roofing', multiplier: 1.2 },
    { id: 'multi-family', label: 'Multi-Family Roofing', multiplier: 1.1 },
    { id: 'storm', label: 'Storm Restoration & Claims', multiplier: 1.3 },
    { id: 'installation', label: 'Installation Partnerships', multiplier: 0.9 }
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: 'Quote Request',
          subject: `New Quote Request - ${formData.sqft} SQFT`,
          message: `Generated a quote estimate for a ${formData.sqft} sqft ${roof.label} roof (${service.label}). Estimated cost: $${min} - $${max}.`,
          sqft: formData.sqft,
          roofType: roof.label,
          service: service.label,
          minEstimate: min,
          maxEstimate: max
        })
      });
    } catch (err) {
      console.error('Failed to save quote submission:', err);
    }
    
    setStep(4);
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <section id="quote" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Request an Estimate</h2>
          <p className="text-slate-600 text-lg">Provide a few details below to receive an instant, data-driven cost bracket for your roofing project.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              {step === 4 ? "Complete" : `Step ${step} of 3`}
            </span>
            <div className="flex gap-2">
              <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-[#1E5D9A]' : 'bg-slate-300'}`} />
              <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-[#1E5D9A]' : 'bg-slate-300'}`} />
              <div className={`h-2 w-12 rounded-full ${step >= 3 ? 'bg-[#1E5D9A]' : 'bg-slate-300'}`} />
            </div>
          </div>

          <div className="p-8 md:p-10">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900">Property Information</h3>
                
                <div className="space-y-2">
                  <label htmlFor="sqft" className="block text-sm font-semibold text-slate-700">Approximate Square Footage <span className="text-red-500">*</span></label>
                  <input 
                    id="sqft"
                    type="number" 
                    placeholder="e.g. 2500"
                    className="w-full border border-slate-300 rounded-md px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E5D9A] focus:border-[#1E5D9A] transition-shadow"
                    value={formData.sqft}
                    onChange={(e) => setFormData({...formData, sqft: e.target.value})}
                  />
                  <p className="text-sm text-slate-500">Enter the total size of the roof (minimum 100 sq ft).</p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={handleNext}
                    disabled={!formData.sqft || parseInt(formData.sqft) < 100}
                    className="bg-[#1E5D9A] text-white font-semibold px-6 py-3 rounded-md disabled:opacity-50 hover:bg-[#154675] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900">Project Parameters</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Service Required <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setFormData({...formData, service: s.id})}
                          className={`px-4 py-3 rounded-md border text-sm font-medium text-left transition-colors ${
                            formData.service === s.id 
                              ? 'border-[#1E5D9A] bg-[#1E5D9A]/5 text-[#1E5D9A]' 
                              : 'border-slate-300 text-slate-700 hover:border-slate-400 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{s.label}</span>
                            {formData.service === s.id && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Material Grade <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roofTypes.map(r => (
                        <button
                          key={r.id}
                          onClick={() => setFormData({...formData, roofType: r.id})}
                          className={`px-4 py-3 rounded-md border text-sm font-medium text-left transition-colors ${
                            formData.roofType === r.id 
                              ? 'border-[#1E5D9A] bg-[#1E5D9A]/5 text-[#1E5D9A]' 
                              : 'border-slate-300 text-slate-700 hover:border-slate-400 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{r.label}</span>
                            {formData.roofType === r.id && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between">
                  <button 
                    onClick={handleBack}
                    className="text-slate-600 font-semibold px-6 py-3 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={!formData.service || !formData.roofType}
                    className="bg-[#1E5D9A] text-white font-semibold px-6 py-3 rounded-md disabled:opacity-50 hover:bg-[#154675] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form onSubmit={handleCalculate} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900">Contact Details</h3>
                <p className="text-slate-600 text-sm">Where should we deliver your estimate?</p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      id="name"
                      type="text" required 
                      className="w-full border border-slate-300 rounded-md px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E5D9A] focus:border-[#1E5D9A]"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                    <input 
                      id="email"
                      type="email" required 
                      className="w-full border border-slate-300 rounded-md px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E5D9A] focus:border-[#1E5D9A]"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                    <input 
                      id="phone"
                      type="tel" required 
                      className="w-full border border-slate-300 rounded-md px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E5D9A] focus:border-[#1E5D9A]"
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between">
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="text-slate-600 font-semibold px-6 py-3 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#1E5D9A] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#154675] transition-colors"
                  >
                    Generate Estimate
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4 (RESULTS) */}
            {step === 4 && estimate && (
              <div className="text-center py-6 animate-in fade-in duration-500">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Estimate Complete</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">Based on the details provided, here is the projected cost bracket for your project.</p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 inline-block min-w-[300px]">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Projected Range</p>
                  <div className="text-4xl font-bold text-[#1E5D9A]">
                    ${(estimate.min / 1000).toFixed(1)}k - ${(estimate.max / 1000).toFixed(1)}k
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600 text-left space-y-1">
                    <p><strong>Size:</strong> {formData.sqft} sq.ft.</p>
                    <p><strong>Material:</strong> {roofTypes.find(r=>r.id===formData.roofType)?.label}</p>
                    <p><strong>Service:</strong> {services.find(s=>s.id===formData.service)?.label}</p>
                  </div>
                </div>

                <div className="space-y-4 max-w-sm mx-auto">
                  <a href="#contact" className="block w-full bg-[#1E5D9A] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#154675] transition-colors">
                    Schedule Formal Inspection
                  </a>
                  <button onClick={() => {
                    setStep(1);
                    setFormData({...formData, sqft: '', roofType: '', service: ''});
                    setEstimate(null);
                  }} className="block w-full text-slate-600 font-semibold px-6 py-3 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors">
                    Start New Estimate
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
