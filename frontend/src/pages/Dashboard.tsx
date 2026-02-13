import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Shield,
  Heart,
  LogOut,
  ArrowRight,
  Menu,
  X,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { addSale, getSalesSummary, SalesSummary } from '../lib/api';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [dailySales, setDailySales] = useState('');
  const [saving, setSaving] = useState(false);
  const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('auth') : null;
  const authUser = storedAuth ? JSON.parse(storedAuth) : null;
  const { t } = useI18n();

  const stats = useMemo(() => {
    const entries = summary?.entries ?? [];
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaySales = entries
      .filter((e) => e.date.slice(0, 10) === todayStr)
      .reduce((acc, e) => acc + e.amount, 0);
    const monthTotal = summary?.month_total ?? 0;
    const daysWithSales = new Set(entries.map((e) => e.date.slice(0, 10))).size || 1;
    const avgDaily = monthTotal / daysWithSales;
    return {
      todaySales,
      monthlyIncome: monthTotal,
      loanEligibility: monthTotal, // placeholder until backend provides real value
      hygieneScore: 'N/A',
      vendorType: 'Vendor',
      location: '',
      avgDaily,
    };
  }, [summary]);

  const dailyChart = useMemo(() => {
    const entries = summary?.entries ?? [];
    const map = new Map<string, number>();
    entries.forEach((e) => {
      const key = e.date.slice(0, 10);
      map.set(key, (map.get(key) || 0) + e.amount);
    });
    const days = Array.from({ length: 14 })
      .map((_, idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - idx));
        const key = d.toISOString().slice(0, 10);
        return {
          key,
          label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          amount: map.get(key) || 0,
        };
      });
    return days;
  }, [summary]);

  const loadSummary = async () => {
    try {
      const data = await getSalesSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load sales summary', err);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const actionCards = [
    {
      title: 'Apply for Loan',
      tKey: 'Apply for Loan',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/finance'),
      desc: `${t('Apply for Loan')} - ₹${Math.round(stats.loanEligibility).toLocaleString()}`,
    },
    {
      title: 'Upload Certificate',
      tKey: 'Upload Certificate',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/legal'),
      desc: 'Upload and verify',
    },
    {
      title: 'Promote Your Stall',
      tKey: 'Promote Your Stall',
      icon: TrendingUp,
      color: 'from-pink-500 to-pink-600',
      action: () => navigate('/promotion'),
      desc: 'Increase online visibility',
    },
    {
      title: 'Enable Payments',
      tKey: 'Enable Payments',
      icon: Heart,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/payments'),
      desc: 'Set up payments',
    },
    {
      title: 'Report Bribery',
      tKey: 'Report Bribery',
      icon: AlertTriangle,
      color: 'from-amber-500 to-red-500',
      action: () => navigate('/complaint'),
      desc: 'Submit a confidential complaint',
    },
  ];

  const navigationItems = [
    { label: t('Dashboard'), action: () => {} },
    { label: t('Sales & Finance'), action: () => navigate('/finance') },
    { label: t('Hygiene'), action: () => navigate('/hygiene') },
    { label: t('Promotion'), action: () => navigate('/promotion') },
    { label: t('Profile', 'Profile'), action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-slate-900">{t('VendorHub')}</h1>
              {authUser?.user?.email && (
                <span className="text-xs text-slate-500">{t('Welcome back')}, {authUser.user.email}</span>
              )}
            </div>
          </div>

          <div className="hidden md:flex gap-6 items-center">
            {navigationItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="text-slate-600 hover:text-slate-900 font-medium transition"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <LanguageToggle />
          </div>

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <LogOut size={18} />
            {t('Logout', 'Logout')}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            {navigationItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 border-b border-slate-100"
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 py-3">
              <LanguageToggle />
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50"
            >
              {t('Logout', 'Logout')}
            </button>
          </div>
        )}

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

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {t('Welcome back')}, {authUser?.user?.email || t('Vendor', 'Vendor')}!
          </h2>
          <p className="text-slate-600">{stats.vendorType}{stats.location ? ` at ${stats.location}` : ''}</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t("Log today's sales")}</h3>
              <p className="text-sm text-slate-600">{t('Enter your sales to update today and monthly totals.')}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input
                type="number"
                min="0"
                step="100"
                value={dailySales}
                onChange={(e) => setDailySales(e.target.value)}
                placeholder="₹"
                className="flex-1 md:w-48 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                onClick={async () => {
                  if (!dailySales) return;
                  setSaving(true);
                  try {
                    await addSale({ amount: Number(dailySales) });
                    setDailySales('');
                    await loadSummary();
                  } catch (err) {
                    alert('Could not save sales. Please try again.');
                    console.error(err);
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? t('Saving...') : t('Save')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: t("Today's Sales"),
              value: `₹${Math.round(stats.todaySales).toLocaleString()}`,
              icon: TrendingUp,
              color: 'from-green-500 to-emerald-600',
            },
            {
              title: t('Monthly Income'),
              value: `₹${Math.round(stats.monthlyIncome).toLocaleString()}`,
              icon: BarChart3,
              color: 'from-blue-500 to-cyan-600',
            },
            {
              title: t('Loan Eligibility'),
              value: `₹${Math.round(stats.loanEligibility).toLocaleString()}`,
              icon: DollarSign,
              color: 'from-purple-500 to-pink-600',
            },
            {
              title: t('Hygiene Score'),
              value: stats.hygieneScore,
              icon: Heart,
              color: 'from-red-500 to-rose-600',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">{stat.title}</h3>
                <div
                  className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}
                >
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{t('Daily Sales (last 14 days)')}</h3>
              <p className="text-sm text-slate-600">{t('Shows what you logged each day.')}</p>
            </div>
          </div>
          {dailyChart.every((d) => d.amount === 0) ? (
            <p className="text-sm text-slate-500">{t('No daily sales logged yet.')}</p>
          ) : (
            <div className="w-full">
              {(() => {
                const chartHeight = 180;
                const chartWidth = 650;
                const maxAmount = Math.max(...dailyChart.map((d) => d.amount), 1);
                const points = dailyChart.map((d, idx) => {
                  const x = (idx / Math.max(1, dailyChart.length - 1)) * chartWidth;
                  const y = chartHeight - (d.amount / maxAmount) * chartHeight;
                  return { x, y };
                });
                const linePath = points
                  .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
                  .join(' ');
                const areaPath = `${linePath} L${chartWidth},${chartHeight} L0,${chartHeight} Z`;

                return (
                  <div className="overflow-x-auto">
                    <div className="min-w-[700px]">
                      <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
                        className="w-full h-64"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="salesLine" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={areaPath} fill="url(#salesLine)" />
                        <path d={linePath} fill="none" stroke="#f97316" strokeWidth="3" strokeLinejoin="round" />
                        {points.map((p, idx) => (
                          <g key={idx}>
                            <circle cx={p.x} cy={p.y} r={4} fill="#f97316" />
                            <text
                              x={p.x}
                              y={chartHeight + 16}
                              textAnchor="middle"
                              className="text-[11px] fill-slate-600"
                            >
                              {dailyChart[idx].label}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">{t('Quick Actions')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {actionCards.map((card, idx) => (
              <button
                key={idx}
                onClick={card.action}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">{t(card.tKey, card.title)}</h4>
                    <p className="text-sm text-slate-600">{t(card.desc, card.desc)}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg text-white`}>
                    <card.icon size={24} />
                  </div>
                </div>
                <div className="flex items-center text-orange-600 font-medium text-sm group-hover:gap-2 transition">
                  Learn more <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">{t('Legal Status')}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{t('Certificate Status')}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {t('Pending')}
                </span>
              </div>
              <button
                onClick={() => navigate('/legal')}
                className="w-full mt-4 py-2 border border-orange-500 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition"
              >
                {t('Upload Certificate')}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">{t('Recent Activity')}</h3>
            <div className="space-y-3 text-sm">
              <p className="text-slate-600">{t("Today's Sales")}: ₹{Math.round(stats.todaySales).toLocaleString()}</p>
              <p className="text-slate-600">{t('Monthly Income')}: ₹{Math.round(stats.monthlyIncome).toLocaleString()}</p>
              <p className="text-slate-600">{t('Last certificate', 'Last certificate')}: {t('Not uploaded', 'Not uploaded')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
