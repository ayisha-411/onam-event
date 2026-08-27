import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2, Loader2, Gift, Calendar, Users } from 'lucide-react';
import { supabase, type Notification } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Link } from '@/lib/router';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setLoading(false);
    })();
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-[#d4a017] animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3d2a0e] flex items-center gap-3">
              <Bell className="w-7 h-7 text-[#d4a017]" /> Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-[#3d2a0e]/60 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#d4a017] hover:bg-[#d4a017]/10 rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#d4a017]/5 border border-dashed border-white/15 text-center">
            <Bell className="w-10 h-10 text-[#3d2a0e]/30 mx-auto mb-3" />
            <p className="text-[#3d2a0e]/60">No notifications yet. You'll see updates about your events here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                  n.read ? 'bg-[#d4a017]/5 border-[#d4a017]/15' : 'bg-[#d4a017]/5 border-[#d4a017]/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.type === 'gift' ? 'bg-[#e76f51]/20' :
                  n.type === 'event' ? 'bg-[#d4a017]/20' :
                  n.type === 'participant' ? 'bg-[#43aa8b]/20' :
                  'bg-[#d4a017]/10'
                }`}>
                  {n.type === 'gift' ? <Gift className="w-5 h-5 text-[#e76f51]" /> :
                   n.type === 'event' ? <Calendar className="w-5 h-5 text-[#d4a017]" /> :
                   n.type === 'participant' ? <Users className="w-5 h-5 text-[#43aa8b]" /> :
                   <Bell className="w-5 h-5 text-[#3d2a0e]/60" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? 'text-[#3d2a0e]/70' : 'text-[#3d2a0e] font-medium'}`}>{n.message}</p>
                  <p className="text-xs text-[#3d2a0e]/40 mt-0.5">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="p-1.5 rounded-lg text-[#3d2a0e]/40 hover:text-[#43aa8b] hover:bg-[#43aa8b]/10 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 rounded-lg text-[#3d2a0e]/40 hover:text-[#e63946] hover:bg-[#e63946]/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-sm text-[#d4a017] hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
