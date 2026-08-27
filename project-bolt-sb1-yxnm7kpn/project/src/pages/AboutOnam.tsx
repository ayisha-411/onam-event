import { Sparkles, Flower, Ship, Music, Crown, Sun } from 'lucide-react';
import { Link } from '@/lib/router';

export default function AboutOnam() {
  const traditions = [
    { icon: Flower, title: 'Pookalam', desc: 'Intricate floral rangoli designs made with fresh flowers, created daily during the 10-day festival to welcome King Mahabali.' },
    { icon: Ship, title: 'Vallam Kali', desc: 'The spectacular snake boat races of Kerala, where hundreds of rowers compete in traditional longboats on the backwaters.' },
    { icon: Music, title: 'Onappattu', desc: 'Traditional Onam songs and folk music that fill the air during the harvest festival, celebrating Kerala\'s rich cultural heritage.' },
    { icon: Crown, title: 'King Mahabali', desc: 'The legendary benevolent king whose annual visit during Onam is celebrated. His reign was known for equality and prosperity.' },
  ];

  const feast = [
    'Rice', 'Sambar', 'Rasam', 'Avial', 'Thoran', 'Payasam', 'Pappadam', 'Parippu', 'Olan', 'Kalan', 'Erissery', 'Inji Curry',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a017]/15 border border-[#d4a017]/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#d4a017]" />
            <span className="text-sm text-[#d4a017] font-medium">Kerala's Harvest Festival</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#3d2a0e] mb-4">
            About <span className="bg-gradient-to-r from-[#d4a017] via-[#f4a261] to-[#e76f51] bg-clip-text text-transparent">Onam</span>
          </h1>
          <p className="text-lg text-[#3d2a0e]/70 max-w-2xl mx-auto leading-relaxed">
            Onam is the most celebrated festival of Kerala, India. It's a vibrant harvest festival that honors the homecoming of the legendary King Mahabali, celebrating unity, prosperity, and Kerala's rich cultural heritage.
          </p>
        </div>

        {/* Story */}
        <div className="p-8 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#d4a017]/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#d4a017]" />
            </div>
            <h2 className="text-xl font-bold text-[#3d2a0e]">The Legend of King Mahabali</h2>
          </div>
          <p className="text-[#3d2a0e]/70 leading-relaxed mb-4">
            According to Hindu mythology, King Mahabali ruled Kerala with such benevolence that his reign was considered a golden era. Everyone was equal, happy, and prosperous. The gods grew jealous of his popularity and sent Lord Vishnu in the form of Vamana, a dwarf Brahmin, to test the king.
          </p>
          <p className="text-[#3d2a0e]/70 leading-relaxed mb-4">
            Vamana asked for three paces of land. King Mahabali granted the wish despite being warned. Vamana then grew to cosmic size and covered the universe in two steps. For the third step, the king offered his own head. Vishnu pushed him to the netherworld but granted him the boon of visiting his people once a year.
          </p>
          <p className="text-[#3d2a0e]/70 leading-relaxed">
            That annual visit is celebrated as Onam — a time when Kerala welcomes their beloved king with flowers, feasts, and festivities.
          </p>
        </div>

        {/* Traditions */}
        <h2 className="text-2xl font-bold text-[#3d2a0e] mb-6">Traditions & Celebrations</h2>
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {traditions.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 hover:border-[#d4a017]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a017]/20 to-[#e76f51]/20 flex items-center justify-center mb-4">
                <t.icon className="w-6 h-6 text-[#d4a017]" />
              </div>
              <h3 className="text-lg font-semibold text-[#3d2a0e] mb-2">{t.title}</h3>
              <p className="text-sm text-[#3d2a0e]/60 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Onasadya */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#43aa8b]/10 to-[#d4a017]/10 border border-[#43aa8b]/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#43aa8b]/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-[#43aa8b]" />
            </div>
            <h2 className="text-xl font-bold text-[#3d2a0e]">Onasadya — The Grand Feast</h2>
          </div>
          <p className="text-[#3d2a0e]/70 leading-relaxed mb-4">
            The Onasadya is a grand vegetarian feast served on banana leaves, featuring 26+ dishes. It's the centerpiece of Onam celebrations, bringing families together around a meal that represents abundance and gratitude.
          </p>
          <div className="flex flex-wrap gap-2">
            {feast.map((dish) => (
              <span key={dish} className="px-3 py-1.5 rounded-full bg-[#d4a017]/5 text-sm text-[#3d2a0e]/70">{dish}</span>
            ))}
          </div>
        </div>

        {/* 10 Days */}
        <div className="p-8 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 mb-8">
          <h2 className="text-xl font-bold text-[#3d2a0e] mb-4">The 10 Days of Onam</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {['Atham', 'Chithira', 'Chodi', 'Vishakam', 'Anizham', 'Thriketa', 'Moolam', 'Pooradam', 'Uthradom', 'Thiruvonam'].map((day, idx) => (
              <div key={day} className="text-center p-3 rounded-xl bg-[#d4a017]/5">
                <p className="text-xs text-[#d4a017] font-medium mb-1">Day {idx + 1}</p>
                <p className="text-sm font-semibold text-[#3d2a0e]">{day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-[#d4a017]/15 to-[#e76f51]/15 border border-[#d4a017]/20">
          <h2 className="text-xl font-bold text-[#3d2a0e] mb-2">Celebrate Onam Together</h2>
          <p className="text-[#3d2a0e]/70 mb-6">Create a gift exchange event and bring the spirit of Onam to your community.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#d4a017]/30 transition-all"
          >
            <Sparkles className="w-5 h-5" /> Start Celebrating
          </Link>
        </div>
      </div>
    </div>
  );
}
