import { useEffect, useState } from 'react';
import { Calendar, Users, Gift, Plus, Clock, MapPin, Sparkles, Loader2, ArrowRight, TrendingUp } from 'lucide-react';
import { supabase, type Event, type Participant } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Link } from '@/lib/router';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: orgEvents }, { data: parts }] = await Promise.all([
        supabase.from('events').select('*').eq('organizer_id', user.id).order('event_date', { ascending: true }),
        supabase.from('participants').select('event_id, status').eq('user_id', user.id),
      ]);

      setOrganizedEvents(orgEvents || []);

      if (parts && parts.length > 0) {
        const eventIds = parts.map((p) => p.event_id);
        const { data: joined } = await supabase
          .from('events')
          .select('*')
          .in('id', eventIds)
          .neq('organizer_id', user.id)
          .order('event_date', { ascending: true });
        setJoinedEvents(joined || []);
      }

      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-[#d4a017] animate-spin" />
      </div>
    );
  }

  const allEvents = [...organizedEvents, ...joinedEvents];
  const upcomingCount = allEvents.filter((e) => new Date(e.event_date) >= new Date()).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3d2a0e]">
              Welcome back, {profile?.display_name || 'Celebrator'}!
            </h1>
            <p className="text-[#3d2a0e]/60 mt-1">Manage your Onam gift exchanges</p>
          </div>
          <Link
            to="/events/create"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#d4a017]/30 transition-all"
          >
            <Plus className="w-5 h-5" /> Create Event
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Calendar} label="Total Events" value={allEvents.length} color="#d4a017" />
          <StatCard icon={Clock} label="Upcoming" value={upcomingCount} color="#f4a261" />
          <StatCard icon={Users} label="Organized" value={organizedEvents.length} color="#e76f51" />
          <StatCard icon={Gift} label="Participating" value={joinedEvents.length} color="#43aa8b" />
        </div>

        {/* Organized Events */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#3d2a0e]">Events You Organize</h2>
            <Link to="/events/create" className="text-sm text-[#d4a017] hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> New Event
            </Link>
          </div>

          {organizedEvents.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No events yet"
              desc="Create your first Onam gift exchange event and invite your family and friends."
              actionLabel="Create Event"
              actionTo="/events/create"
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {organizedEvents.map((event) => (
                <EventCard key={event.id} event={event} isOrganizer />
              ))}
            </div>
          )}
        </section>

        {/* Joined Events */}
        {joinedEvents.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#3d2a0e] mb-4">Events You've Joined</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {joinedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Join with code */}
        <section className="mt-10">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#d4a017]/10 to-[#e76f51]/10 border border-[#d4a017]/20">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-[#d4a017]" />
              <h3 className="text-lg font-semibold text-[#3d2a0e]">Have an Invitation Code?</h3>
            </div>
            <p className="text-sm text-[#3d2a0e]/60 mb-4">Enter the code shared by your event organizer to join the celebration.</p>
            <Link
              to="/events/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4a017]/10 text-[#3d2a0e] rounded-lg font-medium hover:bg-[#d4a017]/15 transition-colors text-sm"
            >
              Join Event <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Calendar; label: string; value: number; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-[#d4a017]/5 border border-[#d4a017]/15">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#3d2a0e]">{value}</p>
          <p className="text-xs text-[#3d2a0e]/50">{label}</p>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, isOrganizer }: { event: Event; isOrganizer?: boolean }) {
  const eventDate = new Date(event.event_date);
  const daysLeft = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUpcoming = daysLeft >= 0;

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block p-5 rounded-2xl bg-gradient-to-b from-[#d4a017]/5 to-transparent border border-[#d4a017]/15 hover:border-[#d4a017]/40 hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: event.banner_color }}>
          <Gift className="w-6 h-6" />
        </div>
        {isOrganizer && (
          <span className="text-xs px-2 py-1 rounded-full bg-[#d4a017]/20 text-[#d4a017] font-medium">Organizer</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-[#3d2a0e] mb-1 group-hover:text-[#d4a017] transition-colors">{event.name}</h3>
      {event.description && <p className="text-sm text-[#3d2a0e]/60 mb-3 line-clamp-2">{event.description}</p>}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-[#3d2a0e]/50">
          <Calendar className="w-3.5 h-3.5" />
          {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {event.event_time && ` at ${event.event_time}`}
        </div>
        {event.venue && (
          <div className="flex items-center gap-2 text-xs text-[#3d2a0e]/50">
            <MapPin className="w-3.5 h-3.5" /> {event.venue}
          </div>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-[#d4a017]/10 flex items-center justify-between">
        <span className="text-xs text-[#3d2a0e]/50 capitalize">{event.category}</span>
        {isUpcoming ? (
          <span className="text-xs text-[#43aa8b] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {daysLeft === 0 ? 'Today!' : `${daysLeft} days left`}
          </span>
        ) : (
          <span className="text-xs text-[#3d2a0e]/40">Completed</span>
        )}
      </div>
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  title,
  desc,
  actionLabel,
  actionTo,
}: {
  icon: typeof Calendar;
  title: string;
  desc: string;
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <div className="p-10 rounded-2xl bg-[#d4a017]/5 border border-dashed border-white/15 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#d4a017]/5 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-[#3d2a0e]/40" />
      </div>
      <h3 className="text-lg font-semibold text-[#3d2a0e] mb-2">{title}</h3>
      <p className="text-sm text-[#3d2a0e]/60 mb-4 max-w-sm mx-auto">{desc}</p>
      <Link
        to={actionTo}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all"
      >
        <TrendingUp className="w-4 h-4" /> {actionLabel}
      </Link>
    </div>
  );
}
