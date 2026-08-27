import { useState } from 'react';
import { ArrowLeft, Loader2, AlertCircle, Ticket, CheckCircle2, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from '@/lib/router';

export default function JoinEvent() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [eventInfo, setEventInfo] = useState<{ id: string; name: string; date: string } | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be signed in to join an event.');
      setLoading(false);
      return;
    }

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, name, event_date')
      .eq('invite_code', code.toUpperCase())
      .maybeSingle();

    if (eventError || !event) {
      setError('Invalid invitation code. Please check and try again.');
      setLoading(false);
      return;
    }

    const { error: joinError } = await supabase
      .from('participants')
      .upsert({ event_id: event.id, user_id: user.id, status: 'approved' });

    if (joinError) {
      if (joinError.code === '23505') {
        setError("You've already joined this event.");
      } else {
        setError(joinError.message);
      }
      setLoading(false);
      return;
    }

    setEventInfo({ id: event.id, name: event.name, date: event.event_date });
    setSuccess(true);
    setLoading(false);
  };

  if (success && eventInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] flex items-center justify-center pt-20 px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#d4a017]/5 border border-[#43aa8b]/30 text-center">
          <div className="w-16 h-16 rounded-full bg-[#43aa8b]/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#43aa8b]" />
          </div>
          <h1 className="text-2xl font-bold text-[#3d2a0e] mb-2">You're In!</h1>
          <p className="text-[#3d2a0e]/70 mb-2">You've successfully joined</p>
          <p className="text-lg font-semibold text-[#d4a017] mb-6">{eventInfo.name}</p>
          <button
            onClick={() => navigate(`/events/${eventInfo.id}`)}
            className="w-full py-3 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go to Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#3d2a0e]/60 hover:text-[#d4a017] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-8 text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#d4a017]/15 items-center justify-center mb-4">
            <Ticket className="w-7 h-7 text-[#d4a017]" />
          </div>
          <h1 className="text-2xl font-bold text-[#3d2a0e] mb-2">Join an Event</h1>
          <p className="text-[#3d2a0e]/60">Enter the invitation code shared by your event organizer</p>
        </div>

        <form onSubmit={handleJoin} className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#3d2a0e]/70 mb-1.5 flex items-center gap-2">
              <Users className="w-4 h-4" /> Invitation Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., ABCD1234"
              className="w-full px-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 transition-colors text-center text-lg font-mono tracking-widest uppercase"
              maxLength={10}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
