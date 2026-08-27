import { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Palette, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from '@/lib/router';

const CATEGORIES = [
  { value: 'family', label: 'Family' },
  { value: 'friends', label: 'Friends' },
  { value: 'office', label: 'Office' },
  { value: 'school', label: 'School' },
  { value: 'college', label: 'College' },
  { value: 'community', label: 'Community' },
];

const BANNER_COLORS = ['#d4a017', '#e76f51', '#43aa8b', '#f4a261', '#e63946', '#90be6d'];

export default function CreateEvent() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    venue: '',
    category: 'family',
    visibility: 'private',
    min_budget: '10',
    max_budget: '50',
    currency: 'INR',
    banner_color: '#d4a017',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be signed in to create an event.');
      setLoading(false);
      return;
    }

    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const { data, error } = await supabase
      .from('events')
      .insert({
        organizer_id: user.id,
        name: form.name,
        description: form.description || null,
        event_date: form.event_date,
        event_time: form.event_time || null,
        venue: form.venue || null,
        category: form.category,
        visibility: form.visibility,
        min_budget: parseFloat(form.min_budget) || 0,
        max_budget: parseFloat(form.max_budget) || 100,
        currency: form.currency,
        banner_color: form.banner_color,
        invite_code: inviteCode,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data) {
      navigate(`/events/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#3d2a0e]/60 hover:text-[#d4a017] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a017]/15 text-[#d4a017] text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" /> New Celebration
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3d2a0e] mb-2">Create Gift Exchange Event</h1>
          <p className="text-[#3d2a0e]/60">Set up your Onam gift exchange with all the details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 space-y-5">
            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Event Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Family Onam Gift Exchange 2026"
                className="w-full px-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell participants about your event..."
                className="w-full px-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 transition-colors resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Event Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3d2a0e]/40" />
                  <input
                    type="date"
                    required
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Time</label>
                <input
                  type="time"
                  value={form.event_time}
                  onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                  className="w-full px-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Venue / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3d2a0e]/40" />
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  placeholder="e.g., Home, Office, or Online"
                  className="w-full pl-10 pr-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Category & Visibility */}
          <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 space-y-5">
            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Event Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.value })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.category === cat.value
                        ? 'bg-[#d4a017] text-white'
                        : 'bg-[#d4a017]/5 text-[#3d2a0e]/60 hover:bg-[#d4a017]/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-2">Visibility</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, visibility: 'private' })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    form.visibility === 'private'
                      ? 'bg-[#d4a017] text-white'
                      : 'bg-[#d4a017]/5 text-[#3d2a0e]/60 hover:bg-[#d4a017]/10'
                  }`}
                >
                  Private (Invite Only)
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, visibility: 'public' })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    form.visibility === 'public'
                      ? 'bg-[#d4a017] text-white'
                      : 'bg-[#d4a017]/5 text-[#3d2a0e]/60 hover:bg-[#d4a017]/10'
                  }`}
                >
                  Public (Anyone can find)
                </button>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 space-y-5">
            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Budget Range
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-[#3d2a0e]/50 mb-1">Min</label>
                  <input
                    type="number"
                    min="0"
                    value={form.min_budget}
                    onChange={(e) => setForm({ ...form, min_budget: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-lg text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#3d2a0e]/50 mb-1">Max</label>
                  <input
                    type="number"
                    min="0"
                    value={form.max_budget}
                    onChange={(e) => setForm({ ...form, max_budget: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-lg text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#3d2a0e]/50 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-lg text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
                  >
                    <option value="INR" className="bg-[#fef9ef]">INR (₹)</option>
                    <option value="USD" className="bg-[#fef9ef]">USD ($)</option>
                    <option value="EUR" className="bg-[#fef9ef]">EUR (€)</option>
                    <option value="GBP" className="bg-[#fef9ef]">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Color */}
          <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15">
            <label className="block text-sm text-[#3d2a0e]/70 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Event Banner Color
            </label>
            <div className="flex gap-3 flex-wrap">
              {BANNER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, banner_color: color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    form.banner_color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#fef9ef] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#d4a017]/30 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
