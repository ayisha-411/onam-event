import { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft, Calendar, MapPin, Clock, Users, Gift, Sparkles, Copy, Check,
  Package, Heart, Trophy, MessageSquare, Settings, Loader2, UserPlus,
  UserCheck, UserX, Shuffle, Eye, EyeOff, TrendingUp, Star, Share2,
} from 'lucide-react';
import { supabase, type Event, type Participant, type Profile, type Wishlist, type Assignment, type GiftTracking, type MemoryPost, type LeaderboardEntry } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from '@/lib/router';

type Tab = 'overview' | 'participants' | 'wishlist' | 'assignment' | 'tracking' | 'memory' | 'leaderboard';

export default function EventDetails({ eventId }: { eventId: string }) {
  const { user, profile } = useAuth();
  const { navigate } = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [{ data: ev }, { data: parts }] = await Promise.all([
      supabase.from('events').select('*').eq('id', eventId).maybeSingle(),
      supabase
        .from('participants')
        .select('*, profile:profiles(*)')
        .eq('event_id', eventId),
    ]);

    if (!ev) {
      navigate('/dashboard');
      return;
    }

    setEvent(ev);
    setParticipants((parts || []) as unknown as Participant[]);
    setIsOrganizer(ev.organizer_id === user.id);
    setIsParticipant((parts || []).some((p) => p.user_id === user.id));
    setLoading(false);
  }, [eventId, user, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const copyInviteCode = () => {
    if (event?.invite_code) {
      navigator.clipboard.writeText(event.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-[#d4a017] animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.event_date);
  const daysLeft = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'wishlist', label: 'Wishlist', icon: Gift },
    { id: 'assignment', label: 'My Assignment', icon: Shuffle },
    { id: 'tracking', label: 'Gift Tracking', icon: Package },
    { id: 'memory', label: 'Memory Wall', icon: Heart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#3d2a0e]/60 hover:text-[#d4a017] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Event Header */}
        <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden mb-6" style={{ background: `linear-gradient(135deg, ${event.banner_color}30, ${event.banner_color}10)` }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ backgroundColor: event.banner_color }}></div>
          <div className="relative">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#d4a017]/10 text-[#3d2a0e] capitalize">{event.category}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#d4a017]/10 text-[#3d2a0e] capitalize">{event.visibility}</span>
                  {isOrganizer && <span className="text-xs px-2 py-1 rounded-full bg-[#d4a017]/20 text-[#d4a017] font-medium">Organizer</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#3d2a0e] mb-2">{event.name}</h1>
                {event.description && <p className="text-[#3d2a0e]/70 max-w-2xl">{event.description}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[#3d2a0e]/60 mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              {event.event_time && (
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {event.event_time}</span>
              )}
              {event.venue && (
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.venue}</span>
              )}
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> {event.currency} {event.min_budget}–{event.max_budget}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isUpcoming(daysLeft) && (
                <div className="px-4 py-2 rounded-xl bg-[#d4a017]/15 border border-[#d4a017]/30">
                  <span className="text-sm font-semibold text-[#d4a017]">
                    {daysLeft === 0 ? 'Happening Today!' : `${daysLeft} days until event`}
                  </span>
                </div>
              )}
              {isOrganizer && event.invite_code && (
                <button
                  onClick={copyInviteCode}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4a017]/10 text-[#3d2a0e] text-sm hover:bg-[#d4a017]/15 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-[#43aa8b]" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : `Invite Code: ${event.invite_code}`}
                </button>
              )}
              <span className="flex items-center gap-2 text-sm text-[#3d2a0e]/60">
                <Users className="w-4 h-4" /> {participants.length} participants
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#d4a017] text-white'
                  : 'bg-[#d4a017]/5 text-[#3d2a0e]/60 hover:bg-[#d4a017]/10'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'overview' && <OverviewTab event={event} participants={participants} isOrganizer={isOrganizer} />}
          {activeTab === 'participants' && (
            <ParticipantsTab event={event} participants={participants} isOrganizer={isOrganizer} onUpdate={loadData} />
          )}
          {activeTab === 'wishlist' && (
            <WishlistTab event={event} isOrganizer={isOrganizer} isParticipant={isParticipant} />
          )}
          {activeTab === 'assignment' && <AssignmentTab event={event} participants={participants} isOrganizer={isOrganizer} />}
          {activeTab === 'tracking' && <TrackingTab event={event} isOrganizer={isOrganizer} />}
          {activeTab === 'memory' && <MemoryWallTab event={event} isParticipant={isParticipant} />}
          {activeTab === 'leaderboard' && <LeaderboardTab event={event} />}
        </div>
      </div>
    </div>
  );
}

function isUpcoming(daysLeft: number) {
  return daysLeft >= 0;
}

// ===== OVERVIEW TAB =====
function OverviewTab({ event, participants, isOrganizer }: { event: Event; participants: Participant[]; isOrganizer: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15">
          <Users className="w-6 h-6 text-[#d4a017] mb-2" />
          <p className="text-2xl font-bold text-[#3d2a0e]">{participants.length}</p>
          <p className="text-sm text-[#3d2a0e]/60">Participants</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15">
          <TrendingUp className="w-6 h-6 text-[#43aa8b] mb-2" />
          <p className="text-2xl font-bold text-[#3d2a0e]">{event.currency} {event.max_budget}</p>
          <p className="text-sm text-[#3d2a0e]/60">Max Budget</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15">
          <Calendar className="w-6 h-6 text-[#e76f51] mb-2" />
          <p className="text-2xl font-bold text-[#3d2a0e]">
            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-sm text-[#3d2a0e]/60">Event Date</p>
        </div>
      </div>

      {isOrganizer && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#d4a017]/10 to-[#e76f51]/10 border border-[#d4a017]/20">
          <h3 className="text-lg font-semibold text-[#3d2a0e] mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4a017]" /> Organizer Tips
          </h3>
          <ul className="space-y-2 text-sm text-[#3d2a0e]/70">
            <li>• Share your invite code ({event.invite_code}) with participants</li>
            <li>• Ask participants to fill in their wishlists before generating assignments</li>
            <li>• Use the "My Assignment" tab to generate secret gift assignments</li>
            <li>• Track gift progress on the Gift Tracking tab</li>
          </ul>
        </div>
      )}

      <div className="p-5 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15">
        <h3 className="text-lg font-semibold text-[#3d2a0e] mb-4">Participants</h3>
        <div className="flex flex-wrap gap-2">
          {participants.slice(0, 10).map((p) => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4a017]/5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4a017] to-[#e76f51] flex items-center justify-center text-xs font-bold text-white">
                {p.profile?.display_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-[#3d2a0e]/80">{p.profile?.display_name || 'Unknown'}</span>
            </div>
          ))}
          {participants.length > 10 && (
            <div className="flex items-center px-3 py-1.5 rounded-full bg-[#d4a017]/5 text-sm text-[#3d2a0e]/60">
              +{participants.length - 10} more
            </div>
          )}
          {participants.length === 0 && (
            <p className="text-sm text-[#3d2a0e]/50">No participants yet. Share your invite code!</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== PARTICIPANTS TAB =====
function ParticipantsTab({
  event, participants, isOrganizer, onUpdate,
}: {
  event: Event; participants: Participant[]; isOrganizer: boolean; onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (participantId: string, status: string) => {
    setLoading(true);
    await supabase.from('participants').update({ status }).eq('id', participantId);
    await onUpdate();
    setLoading(false);
  };

  const removeParticipant = async (participantId: string) => {
    setLoading(true);
    await supabase.from('participants').delete().eq('id', participantId);
    await onUpdate();
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      {participants.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#d4a017]/5 border border-dashed border-white/15 text-center">
          <Users className="w-10 h-10 text-[#3d2a0e]/30 mx-auto mb-3" />
          <p className="text-[#3d2a0e]/60">No participants have joined yet.</p>
          {isOrganizer && (
            <p className="text-sm text-[#d4a017] mt-2">Share invite code: <span className="font-mono font-bold">{event.invite_code}</span></p>
          )}
        </div>
      ) : (
        participants.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-[#d4a017]/5 border border-[#d4a017]/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a017] to-[#e76f51] flex items-center justify-center text-white font-bold">
                {p.profile?.display_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-[#3d2a0e]">{p.profile?.display_name || 'Unknown'}</p>
                <p className="text-xs text-[#3d2a0e]/50">Joined {new Date(p.joined_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {p.status === 'approved' && (
                <span className="text-xs px-2 py-1 rounded-full bg-[#43aa8b]/20 text-[#43aa8b] flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Approved
                </span>
              )}
              {p.status === 'pending' && (
                <span className="text-xs px-2 py-1 rounded-full bg-[#f4a261]/20 text-[#f4a261] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pending
                </span>
              )}

              {isOrganizer && (
                <div className="flex items-center gap-1">
                  {p.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(p.id, 'approved')}
                      disabled={loading}
                      className="p-1.5 rounded-lg bg-[#43aa8b]/20 text-[#43aa8b] hover:bg-[#43aa8b]/30 transition-colors"
                      title="Approve"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeParticipant(p.id)}
                    disabled={loading}
                    className="p-1.5 rounded-lg bg-[#e63946]/20 text-[#e63946] hover:bg-[#e63946]/30 transition-colors"
                    title="Remove"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ===== WISHLIST TAB =====
function WishlistTab({ event, isOrganizer, isParticipant }: { event: Event; isOrganizer: boolean; isParticipant: boolean }) {
  const { user } = useAuth();
  const [myWishlist, setMyWishlist] = useState<Wishlist | null>(null);
  const [receiverWishlist, setReceiverWishlist] = useState<Wishlist | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    favorite_brands: '',
    favorite_colors: '',
    hobbies: '',
    clothing_size: '',
    allergies: '',
    custom_notes: '',
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Get participant record
      const { data: participant } = await supabase
        .from('participants')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (participant) {
        const { data: wl } = await supabase
          .from('wishlists')
          .select('*')
          .eq('participant_id', participant.id)
          .maybeSingle();

        if (wl) {
          setMyWishlist(wl);
          setForm({
            favorite_brands: wl.favorite_brands || '',
            favorite_colors: wl.favorite_colors || '',
            hobbies: wl.hobbies || '',
            clothing_size: wl.clothing_size || '',
            allergies: wl.allergies || '',
            custom_notes: wl.custom_notes || '',
          });
        }
      }

      // Check if user has an assignment (they're a giver)
      const { data: myAssignment } = await supabase
        .from('assignments')
        .select('*, receiver_profile:profiles!receiver_user_id(*)')
        .eq('event_id', event.id)
        .eq('giver_user_id', user.id)
        .maybeSingle();

      if (myAssignment) {
        setAssignment(myAssignment as unknown as Assignment);
        // Get receiver's wishlist
        const { data: rWl } = await supabase
          .from('wishlists')
          .select('*')
          .eq('event_id', event.id)
          .eq('user_id', myAssignment.receiver_user_id)
          .maybeSingle();
        setReceiverWishlist(rWl);
      }

      setLoading(false);
    })();
  }, [user, event.id]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { data: participant } = await supabase
      .from('participants')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!participant) {
      setSaving(false);
      return;
    }

    if (myWishlist) {
      await supabase
        .from('wishlists')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', myWishlist.id);
    } else {
      await supabase.from('wishlists').insert({
        participant_id: participant.id,
        event_id: event.id,
        user_id: user.id,
        ...form,
      });
    }

    setSaving(false);
    // Refresh
    const { data: wl } = await supabase
      .from('wishlists')
      .select('*')
      .eq('participant_id', participant.id)
      .maybeSingle();
    setMyWishlist(wl);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#d4a017] animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* My wishlist */}
      <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15">
        <h3 className="text-lg font-semibold text-[#3d2a0e] mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#d4a017]" /> My Wishlist
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <WishlistInput label="Favorite Brands" value={form.favorite_brands} onChange={(v) => setForm({ ...form, favorite_brands: v })} placeholder="e.g., FabIndia, Tanishq" />
          <WishlistInput label="Favorite Colors" value={form.favorite_colors} onChange={(v) => setForm({ ...form, favorite_colors: v })} placeholder="e.g., Red, Gold, Green" />
          <WishlistInput label="Hobbies & Interests" value={form.hobbies} onChange={(v) => setForm({ ...form, hobbies: v })} placeholder="e.g., Reading, Cooking" />
          <WishlistInput label="Clothing Size" value={form.clothing_size} onChange={(v) => setForm({ ...form, clothing_size: v })} placeholder="e.g., M, L, 32" />
          <WishlistInput label="Allergies & Restrictions" value={form.allergies} onChange={(v) => setForm({ ...form, allergies: v })} placeholder="e.g., Nuts, Lactose" />
          <WishlistInput label="Custom Gift Notes" value={form.custom_notes} onChange={(v) => setForm({ ...form, custom_notes: v })} placeholder="Any specific gift ideas..." />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {myWishlist ? 'Update Wishlist' : 'Save Wishlist'}
        </button>
      </div>

      {/* Receiver's wishlist (if assigned) */}
      {assignment && receiverWishlist && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#43aa8b]/10 to-[#d4a017]/10 border border-[#43aa8b]/20">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-[#43aa8b]" />
            <h3 className="text-lg font-semibold text-[#3d2a0e]">
              Your Secret Recipient's Wishlist
            </h3>
          </div>
          <p className="text-sm text-[#3d2a0e]/60 mb-4">
            You're buying a gift for <span className="font-semibold text-[#43aa8b]">{(assignment as any).receiver_profile?.display_name}</span>. Use their preferences below to choose the perfect gift!
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <WishlistDisplay label="Favorite Brands" value={receiverWishlist.favorite_brands} />
            <WishlistDisplay label="Favorite Colors" value={receiverWishlist.favorite_colors} />
            <WishlistDisplay label="Hobbies" value={receiverWishlist.hobbies} />
            <WishlistDisplay label="Clothing Size" value={receiverWishlist.clothing_size} />
            <WishlistDisplay label="Allergies" value={receiverWishlist.allergies} />
            <WishlistDisplay label="Gift Notes" value={receiverWishlist.custom_notes} />
          </div>
        </div>
      )}

      {assignment && !receiverWishlist && (
        <div className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 text-center">
          <Gift className="w-8 h-8 text-[#3d2a0e]/30 mx-auto mb-2" />
          <p className="text-[#3d2a0e]/60 text-sm">Your recipient hasn't added their wishlist yet. Check back later!</p>
        </div>
      )}
    </div>
  );
}

function WishlistInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-xs text-[#3d2a0e]/60 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-lg text-sm text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 transition-colors"
      />
    </div>
  );
}

function WishlistDisplay({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="p-3 rounded-lg bg-[#d4a017]/5">
      <p className="text-xs text-[#3d2a0e]/50 mb-0.5">{label}</p>
      <p className="text-sm text-[#3d2a0e]">{value || 'Not specified'}</p>
    </div>
  );
}

// ===== ASSIGNMENT TAB =====
function AssignmentTab({ event, participants, isOrganizer }: { event: Event; participants: Participant[]; isOrganizer: boolean }) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [myAssignment, setMyAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const loadAssignments = useCallback(async () => {
    if (!user) return;
    const { data: assigns } = await supabase
      .from('assignments')
      .select('*, receiver_profile:profiles!receiver_user_id(*)')
      .eq('event_id', event.id);

    setAssignments((assigns || []) as unknown as Assignment[]);

    const { data: mine } = await supabase
      .from('assignments')
      .select('*, receiver_profile:profiles!receiver_user_id(*)')
      .eq('event_id', event.id)
      .eq('giver_user_id', user.id)
      .maybeSingle();

    setMyAssignment(mine as unknown as Assignment);
    setLoading(false);
  }, [event.id, user]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const generateAssignments = async () => {
    setGenerating(true);
    // Delete old assignments
    await supabase.from('assignments').delete().eq('event_id', event.id);

    const approved = participants.filter((p) => p.status === 'approved' || p.status === 'pending');
    if (approved.length < 2) {
      setGenerating(false);
      return;
    }

    // Shuffle for random assignment
    const shuffled = [...approved].sort(() => Math.random() - 0.5);
    const newAssignments = shuffled.map((giver, idx) => {
      const receiver = shuffled[(idx + 1) % shuffled.length];
      return {
        event_id: event.id,
        giver_user_id: giver.user_id,
        receiver_user_id: receiver.user_id,
      };
    });

    const { data } = await supabase.from('assignments').insert(newAssignments).select();

    // Also create gift tracking entries
    if (data) {
      const trackingEntries = data.map((a) => ({
        assignment_id: a.id,
        event_id: event.id,
        giver_user_id: a.giver_user_id,
        status: 'not_started',
      }));
      await supabase.from('gift_tracking').insert(trackingEntries);
    }

    await loadAssignments();
    setGenerating(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#d4a017] animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Organizer controls */}
      {isOrganizer && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#d4a017]/10 to-[#e76f51]/10 border border-[#d4a017]/20">
          <h3 className="text-lg font-semibold text-[#3d2a0e] mb-2 flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-[#d4a017]" /> Assignment Generator
          </h3>
          <p className="text-sm text-[#3d2a0e]/70 mb-4">
            {assignments.length > 0
              ? `${assignments.length} assignments generated. Regenerate to shuffle again.`
              : `Generate secret gift assignments for ${participants.length} participants. Each person gets a random recipient (never themselves).`}
          </p>
          <button
            onClick={generateAssignments}
            disabled={generating || participants.length < 2}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
            {assignments.length > 0 ? 'Regenerate Assignments' : 'Generate Assignments'}
          </button>
          {participants.length < 2 && (
            <p className="text-xs text-[#e63946] mt-2">Need at least 2 participants to generate assignments.</p>
          )}
        </div>
      )}

      {/* My assignment */}
      {myAssignment && !isOrganizer && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#43aa8b]/15 to-[#d4a017]/10 border border-[#43aa8b]/20 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a017] to-[#e76f51] flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#3d2a0e] mb-2">Your Secret Recipient</h3>
          {revealed ? (
            <div>
              <p className="text-2xl font-bold text-[#43aa8b] mb-2">
                {(myAssignment as any).receiver_profile?.display_name || 'Unknown'}
              </p>
              <p className="text-sm text-[#3d2a0e]/60 mb-4">Shh... keep it a secret! Check their wishlist for gift ideas.</p>
              <button onClick={() => setRevealed(false)} className="text-sm text-[#d4a017] hover:underline flex items-center gap-1 mx-auto">
                <EyeOff className="w-4 h-4" /> Hide
              </button>
            </div>
          ) : (
            <div>
              <p className="text-[#3d2a0e]/60 mb-4">Click to reveal who you're buying a gift for</p>
              <button
                onClick={() => setRevealed(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#43aa8b] to-[#2d8b5e] text-white rounded-xl font-semibold hover:shadow-lg transition-all mx-auto"
              >
                <Eye className="w-5 h-5" /> Reveal Recipient
              </button>
            </div>
          )}
        </div>
      )}

      {!myAssignment && !isOrganizer && (
        <div className="p-8 rounded-2xl bg-[#d4a017]/5 border border-dashed border-white/15 text-center">
          <Shuffle className="w-10 h-10 text-[#3d2a0e]/30 mx-auto mb-3" />
          <p className="text-[#3d2a0e]/60">No assignments yet. The organizer needs to generate them.</p>
        </div>
      )}

      {/* Organizer sees all assignments */}
      {isOrganizer && assignments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#3d2a0e] mb-2">All Assignments (Organizer View)</h3>
          {assignments.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#d4a017]/5 border border-[#d4a017]/15">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm text-[#3d2a0e]">
                  {participants.find((p) => p.user_id === a.giver_user_id)?.profile?.display_name || 'Someone'}
                </span>
                <ArrowLeft className="w-4 h-4 text-[#d4a017]" />
                <span className="text-sm font-semibold text-[#43aa8b]">
                  {(a as any).receiver_profile?.display_name || 'Someone'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== TRACKING TAB =====
function TrackingTab({ event, isOrganizer }: { event: Event; isOrganizer: boolean }) {
  const { user } = useAuth();
  const [tracking, setTracking] = useState<(GiftTracking & { receiver_profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const STATUS_STEPS = ['not_started', 'purchased', 'packed', 'shipped', 'delivered', 'completed'];
  const STATUS_LABELS: Record<string, string> = {
    not_started: 'Not Started', purchased: 'Purchased', packed: 'Packed',
    shipped: 'Shipped', delivered: 'Delivered', completed: 'Completed',
  };

  const loadTracking = useCallback(async () => {
    if (!user) return;
    let query = supabase
      .from('gift_tracking')
      .select('*, assignment:assignments!inner(receiver_user_id), receiver_profile:profiles!receiver_user_id(*)')
      .eq('event_id', event.id);

    if (!isOrganizer) {
      query = query.eq('giver_user_id', user.id);
    }

    const { data } = await query;
    setTracking((data || []) as unknown as (GiftTracking & { receiver_profile?: Profile })[]);
    setLoading(false);
  }, [event.id, user, isOrganizer]);

  useEffect(() => {
    loadTracking();
  }, [loadTracking]);

  const updateStatus = async (trackingId: string, status: string) => {
    setUpdating(true);
    await supabase
      .from('gift_tracking')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', trackingId);
    await loadTracking();
    setUpdating(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#d4a017] animate-spin" /></div>;

  if (tracking.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-[#d4a017]/5 border border-dashed border-white/15 text-center">
        <Package className="w-10 h-10 text-[#3d2a0e]/30 mx-auto mb-3" />
        <p className="text-[#3d2a0e]/60">No gift tracking yet. Generate assignments first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tracking.map((t) => {
        const currentIdx = STATUS_STEPS.indexOf(t.status);
        return (
          <div key={t.id} className="p-5 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a017] to-[#e76f51] flex items-center justify-center text-white font-bold">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#3d2a0e]">
                    Gift for {t.receiver_profile?.display_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-[#3d2a0e]/50">Current: {STATUS_LABELS[t.status]}</p>
                </div>
              </div>
            </div>

            {/* Progress steps */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {STATUS_STEPS.map((step, idx) => (
                <div key={step} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => updateStatus(t.id, step)}
                    disabled={updating || (!isOrganizer && t.giver_user_id !== user?.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      idx <= currentIdx
                        ? 'bg-[#43aa8b]/20 text-[#43aa8b]'
                        : 'bg-[#d4a017]/5 text-[#3d2a0e]/40'
                    } hover:bg-[#43aa8b]/30 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {STATUS_LABELS[step]}
                  </button>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`w-4 h-0.5 ${idx < currentIdx ? 'bg-[#43aa8b]' : 'bg-[#d4a017]/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== MEMORY WALL TAB =====
function MemoryWallTab({ event, isParticipant }: { event: Event; isParticipant: boolean }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<MemoryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', caption: '', image_url: '' });

  const loadPosts = useCallback(async () => {
    const { data } = await supabase
      .from('memory_wall_posts')
      .select('*, profile:profiles(*)')
      .eq('event_id', event.id)
      .order('created_at', { ascending: false });
    setPosts((data || []) as unknown as MemoryPost[]);
    setLoading(false);
  }, [event.id]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    await supabase.from('memory_wall_posts').insert({
      event_id: event.id,
      user_id: user.id,
      title: form.title || null,
      caption: form.caption || null,
      image_url: form.image_url || null,
    });

    setForm({ title: '', caption: '', image_url: '' });
    await loadPosts();
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#d4a017] animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {isParticipant && (
        <form onSubmit={handlePost} className="p-5 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 space-y-3">
          <h3 className="text-lg font-semibold text-[#3d2a0e] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#e63946]" /> Share a Memory
          </h3>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Memory title"
            className="w-full px-3 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-lg text-sm text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50"
          />
          <input
            type="url"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="Image URL (optional)"
            className="w-full px-3 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-lg text-sm text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50"
          />
          <textarea
            rows={2}
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            placeholder="Write a caption..."
            className="w-full px-3 py-2.5 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-lg text-sm text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            Share Memory
          </button>
        </form>
      )}

      {posts.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#d4a017]/5 border border-dashed border-white/15 text-center">
          <Heart className="w-10 h-10 text-[#3d2a0e]/30 mx-auto mb-3" />
          <p className="text-[#3d2a0e]/60">No memories shared yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 overflow-hidden">
              {post.image_url && (
                <img src={post.image_url} alt={post.title || 'Memory'} className="w-full h-40 object-cover rounded-xl mb-3" />
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4a017] to-[#e76f51] flex items-center justify-center text-xs font-bold text-white">
                  {post.profile?.display_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#3d2a0e]">{post.profile?.display_name || 'Unknown'}</p>
                  <p className="text-xs text-[#3d2a0e]/50">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {post.title && <h4 className="font-semibold text-[#3d2a0e] mb-1">{post.title}</h4>}
              {post.caption && <p className="text-sm text-[#3d2a0e]/70">{post.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== LEADERBOARD TAB =====
function LeaderboardTab({ event }: { event: Event }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('leaderboard_entries')
        .select('*, profile:profiles(*)')
        .eq('event_id', event.id)
        .order('points', { ascending: false });
      setEntries((data || []) as unknown as LeaderboardEntry[]);
      setLoading(false);
    })();
  }, [event.id]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#d4a017] animate-spin" /></div>;

  if (entries.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-[#d4a017]/5 border border-dashed border-white/15 text-center">
        <Trophy className="w-10 h-10 text-[#3d2a0e]/30 mx-auto mb-3" />
        <p className="text-[#3d2a0e]/60">No leaderboard entries yet. Participate actively to earn points!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, idx) => (
        <div
          key={entry.id}
          className={`flex items-center gap-4 p-4 rounded-xl border ${
            idx === 0
              ? 'bg-gradient-to-r from-[#d4a017]/20 to-[#e76f51]/10 border-[#d4a017]/30'
              : 'bg-[#d4a017]/5 border-[#d4a017]/15'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            idx === 0 ? 'bg-[#d4a017] text-white' :
            idx === 1 ? 'bg-[#c0c0c0] text-[#fef9ef]' :
            idx === 2 ? 'bg-[#cd7f32] text-white' :
            'bg-[#d4a017]/10 text-[#3d2a0e]'
          }`}>
            {idx + 1}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#3d2a0e]">{entry.profile?.display_name || 'Unknown'}</p>
            {entry.badge && <p className="text-xs text-[#d4a017]">{entry.badge}</p>}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#d4a017]">{entry.points}</p>
            <p className="text-xs text-[#3d2a0e]/50">points</p>
          </div>
        </div>
      ))}
    </div>
  );
}
