"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BookingCalendar() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    serviceType: 'Free Roof Inspection',
    notes: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to book');
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', date: '', time: '', serviceType: 'Free Roof Inspection', notes: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  // Generate next 14 days for date selection
  const getUpcomingDays = () => {
    const days = [];
    for(let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      // Skip weekends if desired, but keeping simple
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  return (
    <section id="booking" className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
          
          {/* Left Side: Info */}
          <div className="lg:w-2/5 bg-slate-900 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Schedule Online</span>
              <h3 className="text-3xl font-bold mb-6">Book Your Inspection</h3>
              <p className="text-white/70 mb-8 leading-relaxed">
                Choose a time that works for you. Our commercial and residential specialists will arrive on time to provide a comprehensive evaluation and estimate.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Detailed Condition Report
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Insurance Claim Guidance
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  No-Obligation Estimate
                </li>
              </ul>
            </div>

            <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-white/50">Need immediate emergency tarping?</p>
              <p className="text-xl font-bold mt-1">(555) 123-4567</p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-3/5 p-10 md:p-14">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Inspection Requested!</h4>
                <p className="text-slate-600 mb-8">We have received your request and will contact you shortly to confirm the appointment.</p>
                <button onClick={() => setStatus('idle')} className="text-primary font-bold hover:underline">Book another appointment</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50 focus:bg-white" 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50 focus:bg-white" 
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50 focus:bg-white" 
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Service Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})}>
                      <option>Commercial Roofing</option>
                      <option>Multi-Family Roofing</option>
                      <option>Storm Restoration & Claims</option>
                      <option>Installation Partnerships</option>
                      <option>Free Roof Inspection (General)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                  <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}>
                      <option value="">Choose a date...</option>
                      {getUpcomingDays().map(d => (
                        <option key={d} value={d}>{new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})}</option>
                      ))}
                  </select>
                </div>

                {formData.date && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Time</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({...formData, time})}
                          className={`py-2 rounded-lg text-sm font-medium transition-all border ${
                            formData.time === time 
                            ? 'bg-primary border-primary text-slate-900' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-primary'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes (Optional)</label>
                  <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50 focus:bg-white resize-none" 
                      value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting' || !formData.date || !formData.time}
                  className="w-full bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition-all text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? 'Scheduling...' : 'Confirm Booking'}
                </button>
                
                {status === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
