import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  phone: string | null;
  preferred_language: string;
  high_contrast: boolean;
  font_size: string;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  organizer_id: string;
  name: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  category: string;
  visibility: string;
  min_budget: number;
  max_budget: number;
  currency: string;
  banner_color: string;
  invite_code: string | null;
  created_at: string;
};

export type Participant = {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  joined_at: string;
  profile?: Profile;
};

export type Wishlist = {
  id: string;
  participant_id: string;
  event_id: string;
  user_id: string;
  favorite_brands: string | null;
  favorite_colors: string | null;
  hobbies: string | null;
  clothing_size: string | null;
  allergies: string | null;
  custom_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Assignment = {
  id: string;
  event_id: string;
  giver_user_id: string;
  receiver_user_id: string;
  created_at: string;
  receiver_profile?: Profile;
};

export type GiftTracking = {
  id: string;
  assignment_id: string;
  event_id: string;
  giver_user_id: string;
  status: string;
  updated_at: string;
};

export type MemoryPost = {
  id: string;
  event_id: string;
  user_id: string;
  title: string | null;
  image_url: string | null;
  caption: string | null;
  likes: number;
  created_at: string;
  profile?: Profile;
};

export type LeaderboardEntry = {
  id: string;
  event_id: string;
  user_id: string;
  points: number;
  badge: string | null;
  profile?: Profile;
};

export type Notification = {
  id: string;
  user_id: string;
  event_id: string | null;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
};
