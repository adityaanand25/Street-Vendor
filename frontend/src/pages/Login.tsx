import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { signIn } from '../lib/api';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) return;
    setLoading(true);
    try {
      const auth = await signIn({ email, password });
      // Persist auth so dashboard can show the signed-in user
      localStorage.setItem('auth', JSON.stringify(auth));
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" aria-hidden="true" />

      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle />
      </div>

      <div className="relative z-10 max-w-xl w-full">
        <div className="bg-white/92 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl ring-1 ring-black/5 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-orange-600 font-semibold mb-2">{t('Secure Access')}</p>
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">{t('Welcome Back')}</h1>
              <p className="text-slate-600 mt-1">{t('Sign in to your vendor account')}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg">
              <Phone size={22} />
            </div>
          </div>

          <div className="grid gap-2 mb-6 text-sm text-slate-700">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-100 text-orange-700 font-semibold w-fit">
              <Sparkles size={16} /> {t('Faster check-ins for daily sales')}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>{t('Your data is secured and encrypted')}</span>
            </div>
          </div>

          <div className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {t('Email')}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {t('Password')}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 shadow-orange-200"
            disabled={loading}
          >
            {loading ? t('Signing in...') : t('Sign In')} <ArrowRight size={18} />
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 border-2 border-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-white transition shadow-sm"
          >
            {t("Don't have an account? Register")}
          </button>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm transition"
            >
              {t('Back to Home')}
            </button>
          </div>
        </div>

        <p className="text-center text-white drop-shadow text-sm mt-6">
          {t('Use your email and password to sign in. If you need an account, register first.')}
        </p>
      </div>
    </div>
  );
}
