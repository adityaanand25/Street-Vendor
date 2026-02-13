import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Smartphone, BarChart3, Users } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{t('VendorHub')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => navigate('/policies')}
              className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition"
            >
              {t('Policies')}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition"
            >
              {t('Login')}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition"
            >
              {t('Register')}
            </button>
          </div>
        </div>
        <div className="border-t border-slate-200 bg-slate-50/70">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 font-semibold text-orange-600">
              <ShieldCheck size={16} /> {t('Street Vendor Policies')}
            </span>
            <span className="text-slate-600">
              {t('Know your rights, avoid fines, and access schemes like PM SVANidhi and TVC vending certificates.')}
            </span>
            <button
              onClick={() => navigate('/policies')}
              className="ml-auto px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 font-semibold hover:shadow-sm transition"
            >
              {t('View policies')}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {t('Empower Street Vendors. Build Better Livelihoods.')}
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {t('VendorHub connects street vendors with the tools, support, and resources they need to grow their businesses, improve their income, and achieve financial stability.')}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition"
                >
                  {t('Start as Vendor')}
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  {t('View as NGO')}
                </button>
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-pattern"></div>
              <Users size={120} className="text-orange-500" strokeWidth={1} />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            {t('How We Help')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: BarChart3,
                title: t('Income Growth'),
                desc: t('Track sales & access microloans'),
              },
              {
                icon: ShieldCheck,
                title: t('Legal Identity'),
                desc: t('Upload certificates & licenses'),
              },
              {
                icon: Smartphone,
                title: t('Digital Payments'),
                desc: t('Enable online transactions'),
              },
              {
                icon: TrendingUp,
                title: t('Promotion'),
                desc: t('Increase online visibility'),
              },
              {
                icon: Users,
                title: t('Community'),
                desc: t('Connect with other vendors'),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition text-center"
              >
                <item.icon className="mx-auto mb-4 text-orange-500" size={32} />
                <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-center text-white mb-16">
          <h3 className="text-3xl font-bold mb-4">{t('Ready to Transform Your Business?')}</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {t('Join thousands of vendors already earning better with VendorHub.')}
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            {t('Register Now')}
          </button>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>{t('VendorHub © 2024. Empowering Street Vendors Nationwide.')}</p>
        </div>
      </footer>
    </div>
  );
}
