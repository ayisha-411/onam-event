import { lazy, Suspense } from 'react';
import { Gift, Users, Sparkles, Calendar, Package, MessageSquare, Trophy, BarChart3, ArrowRight, Star, Quote } from 'lucide-react';
import { Link } from '@/lib/router';
import { useAuth } from '@/lib/auth';

const Pookalam3D = lazy(() => import('@/components/Pookalam3D'));

const features = [
  { icon: Gift, title: 'Secret Gift Assignment', desc: 'Smart algorithm ensures no self-assignments and fair distribution among participants.' },
  { icon: Users, title: 'Participant Management', desc: 'Invite via email, WhatsApp, or QR code. Approve participants and manage waiting lists.' },
  { icon: Sparkles, title: 'AI Gift Recommendations', desc: 'Personalized gift suggestions based on wishlists, hobbies, and trending Onam gifts.' },
  { icon: Calendar, title: 'Event Countdown', desc: 'Live countdown timer for your gift exchange day with festive reminders.' },
  { icon: Package, title: 'Gift Tracking', desc: 'Track gifts from purchased to delivered with a beautiful timeline view.' },
  { icon: MessageSquare, title: 'Group Chat', desc: 'Real-time discussion rooms for each event with image sharing support.' },
  { icon: Trophy, title: 'Leaderboards', desc: 'Gamify your celebration with participation badges and best gift awards.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track budgets, gifts exchanged, and engagement with detailed reports.' },
];

const steps = [
  { num: '01', title: 'Create an Event', desc: 'Set up your gift exchange with date, venue, budget, and category.' },
  { num: '02', title: 'Invite Participants', desc: 'Share your invite code or send invitations to family and friends.' },
  { num: '03', title: 'Add Wishlists', desc: 'Participants share their preferences, hobbies, and gift ideas.' },
  { num: '04', title: 'Reveal & Celebrate', desc: 'Get your secret assignment, buy the gift, and celebrate Onam together.' },
];

const testimonials = [
  { name: 'Priya Menon', role: 'Family Organizer', text: 'OnamSwap made our family gift exchange so much fun! The secret assignments were perfect and everyone loved the festive theme.', rating: 5 },
  { name: 'Rahul Nair', role: 'Office HR Manager', text: 'We used it for our office Onam celebration with 50+ employees. The budget tracking and gift tracking features were incredibly useful.', rating: 5 },
  { name: 'Anjali Pillai', role: 'College Student', text: 'The 3D Pookalam on the homepage is stunning! Our college group had the best gift exchange experience ever.', rating: 5 },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4a017]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#e76f51]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#43aa8b]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a017]/15 border border-[#d4a017]/30 mb-6">
                <Sparkles className="w-4 h-4 text-[#d4a017]" />
                <span className="text-sm text-[#d4a017] font-medium">Onam 2026 Celebration</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3d2a0e] leading-tight mb-6">
                Celebrate Onam with
                <span className="block bg-gradient-to-r from-[#d4a017] via-[#f4a261] to-[#e76f51] bg-clip-text text-transparent">
                  Secret Gift Exchanges
                </span>
              </h1>
              <p className="text-lg text-[#3d2a0e]/70 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Bring your family, friends, office, and community together this Onam. Create magical gift exchanges with smart assignments, wishlists, budget tracking, and a beautiful Kerala-themed experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to={user ? '/dashboard' : '/signup'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#d4a017]/30 hover:scale-105 transition-all"
                >
                  {user ? 'Go to Dashboard' : 'Start Your Exchange'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#d4a017]/40 text-[#3d2a0e] rounded-xl font-semibold hover:bg-[#d4a017]/10 transition-all"
                >
                  Learn About Onam
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 justify-center lg:justify-start">
                <div>
                  <p className="text-2xl font-bold text-[#d4a017]">500+</p>
                  <p className="text-sm text-[#3d2a0e]/60">Events Created</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#d4a017]">2,000+</p>
                  <p className="text-sm text-[#3d2a0e]/60">Gifts Exchanged</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#d4a017]">15+</p>
                  <p className="text-sm text-[#3d2a0e]/60">Communities</p>
                </div>
              </div>
            </div>

            {/* Right: 3D Pookalam */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-[#d4a017]/30 border-t-[#d4a017] rounded-full animate-spin"></div>
                  </div>
                }
              >
                <Pookalam3D className="w-full h-full" />
              </Suspense>
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-[#3d2a0e]/40 text-center">
                Interactive 3D Pookalam — drag to rotate, scroll to zoom
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#fffdf5]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3d2a0e] mb-4">
              Everything You Need for a Perfect Onam Celebration
            </h2>
            <p className="text-lg text-[#3d2a0e]/60 max-w-2xl mx-auto">
              From secret assignments to gift tracking, we've got every part of your gift exchange covered.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-gradient-to-b from-[#d4a017]/5 to-transparent border border-[#d4a017]/15 hover:border-[#d4a017]/40 hover:shadow-xl hover:shadow-[#d4a017]/10 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a017]/20 to-[#e76f51]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#d4a017]" />
                </div>
                <h3 className="text-lg font-semibold text-[#3d2a0e] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#3d2a0e]/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3d2a0e] mb-4">How It Works</h2>
            <p className="text-lg text-[#3d2a0e]/60">Four simple steps to your Onam gift exchange</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-[#fef9ef] to-[#fffdf5] border border-[#d4a017]/20">
                  <div className="text-4xl font-bold text-[#d4a017]/30 mb-3">{step.num}</div>
                  <h3 className="text-lg font-semibold text-[#3d2a0e] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#3d2a0e]/60 leading-relaxed">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#d4a017]/40 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#fffdf5]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3d2a0e] mb-4">Loved by Celebrators</h2>
            <p className="text-lg text-[#3d2a0e]/60">See what our community says about OnamSwap</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gradient-to-b from-[#d4a017]/5 to-transparent border border-[#d4a017]/15">
                <Quote className="w-8 h-8 text-[#d4a017]/40 mb-4" />
                <p className="text-sm text-[#3d2a0e]/80 leading-relaxed mb-4">{t.text}</p>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#d4a017] fill-[#d4a017]" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3d2a0e]">{t.name}</p>
                  <p className="text-xs text-[#3d2a0e]/50">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#d4a017]/20 via-[#e76f51]/15 to-[#43aa8b]/10 border border-[#d4a017]/30 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4a017]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#e76f51]/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#3d2a0e] mb-4">
                Ready to Start Your Onam Celebration?
              </h2>
              <p className="text-lg text-[#3d2a0e]/70 mb-8 max-w-2xl mx-auto">
                Join hundreds of families, offices, and communities celebrating Onam with memorable gift exchanges.
              </p>
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-[#d4a017]/40 hover:scale-105 transition-all"
              >
                Create Your First Event
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
