import { Gift, Heart } from 'lucide-react';
import { Link } from '@/lib/router';

export default function Footer() {
  return (
    <footer className="bg-[#fffdf5] border-t border-[#d4a017]/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f4a261] to-[#e76f51] flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#3d2a0e]">
                Onam<span className="text-[#d4a017]">Swap</span>
              </span>
            </div>
            <p className="text-sm text-[#3d2a0e]/60 leading-relaxed">
              Celebrate Onam with joy, connection, and the thrill of secret gift exchanges among family, friends, and colleagues.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#3d2a0e] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-[#3d2a0e]/60 hover:text-[#d4a017] transition-colors">About Onam</Link></li>
              <li><Link to="/faq" className="text-sm text-[#3d2a0e]/60 hover:text-[#d4a017] transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-[#3d2a0e]/60 hover:text-[#d4a017] transition-colors">Contact Us</Link></li>
              <li><Link to="/dashboard" className="text-sm text-[#3d2a0e]/60 hover:text-[#d4a017] transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#3d2a0e] mb-4">Features</h4>
            <ul className="space-y-2">
              <li className="text-sm text-[#3d2a0e]/60">Secret Gift Assignment</li>
              <li className="text-sm text-[#3d2a0e]/60">Budget Management</li>
              <li className="text-sm text-[#3d2a0e]/60">Gift Tracking</li>
              <li className="text-sm text-[#3d2a0e]/60">Memory Wall</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#3d2a0e] mb-4">Categories</h4>
            <ul className="space-y-2">
              <li className="text-sm text-[#3d2a0e]/60">Family Events</li>
              <li className="text-sm text-[#3d2a0e]/60">Office Parties</li>
              <li className="text-sm text-[#3d2a0e]/60">School & College</li>
              <li className="text-sm text-[#3d2a0e]/60">Community Groups</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#d4a017]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#3d2a0e]/50">
            © 2026 OnamSwap. Celebrating Kerala's harvest festival.
          </p>
          <p className="text-xs text-[#3d2a0e]/50 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#e63946] fill-[#e63946]" /> for Onam
          </p>
        </div>
      </div>
    </footer>
  );
}
