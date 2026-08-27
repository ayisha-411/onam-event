import { useEffect, useState } from 'react';
import { User, Mail, Phone, Globe, Eye, Type, Save, Loader2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Link } from '@/lib/router';

export default function ProfileSettings() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [form, setForm] = useState({
    display_name: '',
    phone: '',
    preferred_language: 'en',
    high_contrast: false,
    font_size: 'medium',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || '',
        phone: profile.phone || '',
        preferred_language: profile.preferred_language || 'en',
        high_contrast: profile.high_contrast || false,
        font_size: profile.font_size || 'medium',
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase
      .from('profiles')
      .update({
        display_name: form.display_name,
        phone: form.phone || null,
        preferred_language: form.preferred_language,
        high_contrast: form.high_contrast,
        font_size: form.font_size,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3d2a0e] mb-2">Profile Settings</h1>
        <p className="text-[#3d2a0e]/60 mb-8">Manage your account and preferences</p>

        {/* Profile card */}
        <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a017] to-[#e76f51] flex items-center justify-center text-white text-2xl font-bold">
              {form.display_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#3d2a0e]">{form.display_name || 'User'}</p>
              <p className="text-sm text-[#3d2a0e]/50">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5 flex items-center gap-2">
                <User className="w-4 h-4" /> Display Name
              </label>
              <input
                type="text"
                required
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e]/50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Preferred Language
              </label>
              <select
                value={form.preferred_language}
                onChange={(e) => setForm({ ...form, preferred_language: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] focus:outline-none focus:border-[#d4a017]/50 transition-colors"
              >
                <option value="en" className="bg-[#fef9ef]">English</option>
                <option value="ml" className="bg-[#fef9ef]">Malayalam</option>
                <option value="ta" className="bg-[#fef9ef]">Tamil</option>
                <option value="hi" className="bg-[#fef9ef]">Hindi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#3d2a0e]/70 mb-1.5 flex items-center gap-2">
                <Type className="w-4 h-4" /> Font Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setForm({ ...form, font_size: size })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      form.font_size === size
                        ? 'bg-[#d4a017] text-white'
                        : 'bg-[#d4a017]/5 text-[#3d2a0e]/60 hover:bg-[#d4a017]/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, high_contrast: !form.high_contrast })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.high_contrast ? 'bg-[#d4a017]' : 'bg-[#d4a017]/10'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.high_contrast ? 'left-5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm text-[#3d2a0e]/70 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> High Contrast Mode
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="p-6 rounded-2xl bg-[#e63946]/5 border border-[#e63946]/20">
          <h3 className="text-lg font-semibold text-[#e63946] mb-2">Sign Out</h3>
          <p className="text-sm text-[#3d2a0e]/60 mb-4">Sign out of your account on this device.</p>
          <button
            onClick={() => signOut()}
            className="px-5 py-2.5 border border-[#e63946]/40 text-[#e63946] rounded-lg font-medium text-sm hover:bg-[#e63946]/10 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-sm text-[#d4a017] hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
