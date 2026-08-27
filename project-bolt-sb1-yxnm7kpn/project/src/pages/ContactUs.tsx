import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Loader2, Check } from 'lucide-react';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 pt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3d2a0e] mb-3">Contact Us</h1>
          <p className="text-[#3d2a0e]/60 max-w-xl mx-auto">Have questions about OnamSwap? We're here to help make your Onam celebration amazing.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#d4a017]/20 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-[#d4a017]" />
            </div>
            <h3 className="text-sm font-semibold text-[#3d2a0e] mb-1">Email</h3>
            <p className="text-sm text-[#3d2a0e]/60">support@onamswap.com</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#43aa8b]/20 flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-[#43aa8b]" />
            </div>
            <h3 className="text-sm font-semibold text-[#3d2a0e] mb-1">Phone</h3>
            <p className="text-sm text-[#3d2a0e]/60">+91 471 234 5678</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#e76f51]/20 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-[#e76f51]" />
            </div>
            <h3 className="text-sm font-semibold text-[#3d2a0e] mb-1">Location</h3>
            <p className="text-sm text-[#3d2a0e]/60">Kochi, Kerala, India</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[#d4a017]" />
            <h2 className="text-lg font-semibold text-[#3d2a0e]">Send a Message</h2>
          </div>

          {sent && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#43aa8b]/10 border border-[#43aa8b]/30 text-[#43aa8b] text-sm">
              <Check className="w-4 h-4" /> Message sent! We'll get back to you soon.
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Your Name</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Email Address</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Subject</label>
            <input
              type="text" required value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Message</label>
            <textarea
              rows={5} required value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors resize-none"
            />
          </div>

          <button
            type="submit" disabled={sending}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
