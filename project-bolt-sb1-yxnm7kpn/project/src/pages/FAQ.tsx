import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

const FAQS = [
  {
    category: 'Getting Started',
    items: [
      { q: 'What is OnamSwap?', a: 'OnamSwap is a platform for organizing secret gift exchanges during the Onam festival. Create events, invite participants, get matched with a secret recipient, and exchange gifts — all with a beautiful Kerala-themed experience.' },
      { q: 'How do I create an event?', a: 'Sign up or log in, then click "Create Event" on your dashboard. Fill in the event details like name, date, venue, budget range, and category. You\'ll get a unique invite code to share with participants.' },
      { q: 'Do I need to pay to use OnamSwap?', a: 'OnamSwap is free to use for creating events, joining exchanges, and all core features. No subscription or payment is required.' },
    ],
  },
  {
    category: 'Events & Participants',
    items: [
      { q: 'How do I invite people to my event?', a: 'After creating an event, you\'ll receive a unique invite code. Share this code with your family, friends, or colleagues. They can join by entering the code on the "Join Event" page.' },
      { q: 'Can I make my event public?', a: 'Yes! When creating an event, choose "Public" visibility. Public events can be discovered by anyone on the platform. Private events require an invite code to join.' },
      { q: 'How many participants can join an event?', a: 'There is no limit to the number of participants. Whether it\'s a small family gathering or a large office celebration, OnamSwap handles events of any size.' },
      { q: 'Can I remove a participant?', a: 'As an event organizer, you can remove participants from the Participants tab in your event details page. You can also approve or reject pending join requests.' },
    ],
  },
  {
    category: 'Gift Assignment',
    items: [
      { q: 'How does the secret gift assignment work?', a: 'Once participants have joined, the organizer clicks "Generate Assignments" on the Assignment tab. Our algorithm randomly assigns each person a secret recipient — no one gets themselves, and no duplicate assignments.' },
      { q: 'Can I see who has me as their recipient?', a: 'No! The secret assignment is one-directional. You can see who you\'re buying a gift for, but you cannot see who is buying a gift for you. That\'s the fun of a secret exchange!' },
      { q: 'Can assignments be regenerated?', a: 'Yes, the organizer can regenerate assignments at any time. This will create a new set of random assignments. Previous tracking data will be cleared.' },
    ],
  },
  {
    category: 'Wishlists & Budget',
    items: [
      { q: 'What should I put in my wishlist?', a: 'Include your favorite brands, colors, hobbies, clothing size, allergies, and any gift ideas. The person assigned to you will see your wishlist (but won\'t know it\'s yours) to help them choose the perfect gift.' },
      { q: 'How does budget management work?', a: 'The organizer sets a minimum and maximum budget when creating the event. This helps ensure all gifts are in a similar price range. The budget is displayed on the event page for all participants.' },
      { q: 'Can I change my wishlist after saving?', a: 'Yes, you can update your wishlist at any time before assignments are generated. After that, changes are still visible to your assigned giver.' },
    ],
  },
  {
    category: 'Technical & Security',
    items: [
      { q: 'Is my data secure?', a: 'Yes. We use row-level security in our database, encrypted authentication, and secure session management. Your personal information and wishlist are only visible to you and the person assigned to give you a gift.' },
      { q: 'Can I use OnamSwap on my phone?', a: 'Absolutely! OnamSwap is fully responsive and works great on mobile browsers. It functions as a Progressive Web App, so you can add it to your home screen for quick access.' },
      { q: 'What languages are supported?', a: 'Currently the interface is in English, with Malayalam, Tamil, and Hindi language preferences available in your profile settings. Full multi-language UI is coming soon.' },
    ],
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<string | null>('0-0');
  const [search, setSearch] = useState('');

  const filtered = FAQS.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 pt-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#d4a017]/15 items-center justify-center mb-4">
            <HelpCircle className="w-7 h-7 text-[#d4a017]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3d2a0e] mb-3">Frequently Asked Questions</h1>
          <p className="text-[#3d2a0e]/60">Find answers to common questions about OnamSwap</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3d2a0e]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 transition-colors"
          />
        </div>

        {/* FAQ items */}
        <div className="space-y-8">
          {filtered.map((cat, catIdx) => (
            <div key={cat.category}>
              <h2 className="text-lg font-semibold text-[#d4a017] mb-3">{cat.category}</h2>
              <div className="space-y-2">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="rounded-xl bg-[#d4a017]/5 border border-[#d4a017]/15 overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-[#d4a017]/5 transition-colors"
                      >
                        <span className="text-sm font-medium text-[#3d2a0e]">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 text-[#3d2a0e]/40 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-[#3d2a0e]/70 leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#3d2a0e]/60">No results found for "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
