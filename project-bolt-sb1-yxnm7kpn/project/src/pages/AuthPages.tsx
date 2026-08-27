import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Gift, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Link, useRouter } from '@/lib/router';
import { useAuth } from '@/lib/auth';

export function LoginPage() {
  const { navigate } = useRouter();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await refreshProfile();
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue your Onam celebrations">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3d2a0e]/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 focus:bg-[#d4a017]/10 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3d2a0e]/40" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 focus:bg-[#d4a017]/10 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d2a0e]/40 hover:text-[#3d2a0e]/70"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#d4a017]/30 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#3d2a0e]/60 mt-6">
        New to OnamSwap?{' '}
        <Link to="/signup" className="text-[#d4a017] hover:underline font-medium">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export function SignupPage() {
  const { navigate } = useRouter();
  const { refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await refreshProfile();
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Join the Celebration" subtitle="Create your account to start exchanging gifts">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Display Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3d2a0e]/40" />
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full pl-10 pr-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 focus:bg-[#d4a017]/10 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3d2a0e]/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 focus:bg-[#d4a017]/10 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#3d2a0e]/70 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3d2a0e]/40" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-10 py-3 bg-[#d4a017]/5 border border-[#d4a017]/15 rounded-xl text-[#3d2a0e] placeholder:text-[#3d2a0e]/30 focus:outline-none focus:border-[#d4a017]/50 focus:bg-[#d4a017]/10 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d2a0e]/40 hover:text-[#3d2a0e]/70"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#d4a017] to-[#e76f51] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#d4a017]/30 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#3d2a0e]/60 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#d4a017] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf5] via-[#fef9ef] to-[#fffdf5] flex flex-col items-center justify-center px-4 pt-24 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#d4a017]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-[#e76f51]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f4a261] to-[#e76f51] flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#3d2a0e] mb-2">{title}</h1>
          <p className="text-sm text-[#3d2a0e]/60">{subtitle}</p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#d4a017]/5 border border-[#d4a017]/15 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
