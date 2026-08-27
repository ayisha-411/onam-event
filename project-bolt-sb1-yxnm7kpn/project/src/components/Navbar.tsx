import { useState } from 'react';
import { Menu, X, Gift, Bell, User, LogOut, Home, Info, Phone, HelpCircle, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from '@/lib/router';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/about', label: 'About Onam', icon: Info },
    { to: '/contact', label: 'Contact', icon: Phone },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#fef9ef]/95 to-[#fef9ef]/95 backdrop-blur-md border-b border-[#d4a017]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f4a261] to-[#e76f51] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#3d2a0e] hidden sm:block">
              Onam<span className="text-[#d4a017]">Swap</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-lg text-[#3d2a0e]/80 hover:text-[#3d2a0e] hover:bg-[#d4a017]/10 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="p-2 rounded-lg text-[#3d2a0e]/80 hover:text-[#3d2a0e] hover:bg-[#d4a017]/10 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#e63946] rounded-full"></span>
                </Link>
                <Link
                  to="/dashboard"
                  className="p-2 rounded-lg text-[#3d2a0e]/80 hover:text-[#3d2a0e] hover:bg-[#d4a017]/10 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-lg hover:bg-[#d4a017]/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4a017] to-[#e76f51] flex items-center justify-center text-white text-sm font-bold">
                      {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-[#3d2a0e] hidden sm:block">
                      {profile?.display_name || 'User'}
                    </span>
                  </button>
                  {userMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-[#fef9ef] border border-[#d4a017]/30 rounded-xl shadow-2xl overflow-hidden z-20">
                        <div className="px-4 py-3 border-b border-[#d4a017]/15">
                          <p className="text-sm font-medium text-[#3d2a0e]">{profile?.display_name}</p>
                          <p className="text-xs text-[#3d2a0e]/60">{user.email}</p>
                        </div>
                        <Link to="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3d2a0e]/80 hover:bg-[#d4a017]/10 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3d2a0e]/80 hover:bg-[#d4a017]/10 transition-colors">
                          <Settings className="w-4 h-4" /> Profile Settings
                        </Link>
                        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#e63946] hover:bg-[#e63946]/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-[#3d2a0e] hover:text-[#d4a017] text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#d4a017]/30 transition-all">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#3d2a0e] hover:bg-[#d4a017]/10"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#3d2a0e]/80 hover:bg-[#d4a017]/10 transition-colors text-sm"
              >
                <link.icon className="w-4 h-4" /> {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#3d2a0e]/80 hover:bg-[#d4a017]/10 transition-colors text-sm">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#3d2a0e]/80 hover:bg-[#d4a017]/10 transition-colors text-sm">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#e63946] hover:bg-[#e63946]/10 transition-colors text-sm">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-center text-[#3d2a0e] border border-[#d4a017]/40 rounded-lg text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-center bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-lg text-sm font-medium">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
