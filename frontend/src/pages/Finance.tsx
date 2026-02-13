import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { addSale, getSalesSummary, SalesSummary } from '../lib/api';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Finance() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanAmount, setLoanAmount] = useState(0);
  const [dailySales, setDailySales] = useState('');
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const data = await getSalesSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load sales summary', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    const monthTotal = summary?.month_total ?? 0;
    setLoanAmount(Math.round(monthTotal * 0.6));
  }, [summary]);

  const monthlyChart = useMemo(() => {
    if (!summary || summary.entries.length === 0) return [];
    const map = new Map<string, number>();
    summary.entries.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + e.amount);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([ym, sales]) => {
        const [y, m] = ym.split('-');
        const label = new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short' });
        return { month: label, sales };
      });
  }, [summary]);

  const monthTotal = summary?.month_total ?? monthlyChart.reduce((acc, m) => acc + m.sales, 0);
  const todayTotal = useMemo(() => {
    if (!summary) return 0;
    const todayStr = new Date().toISOString().slice(0, 10);
    return summary.entries
      .filter((e) => e.date.slice(0, 10) === todayStr)
      .reduce((acc, e) => acc + e.amount, 0);
  }, [summary]);
  const uniqueDays = useMemo(() => {
    if (!summary) return 0;
    return new Set(summary.entries.map((e) => e.date.slice(0, 10))).size;
  }, [summary]);
  const avgDailySales = useMemo(() => {
    if (!monthTotal) return 0;
    const days = uniqueDays || 1;
    return monthTotal / days;
  }, [monthTotal, uniqueDays]);
  const loanCap = useMemo(() => Math.max(10000, Math.round(monthTotal * 0.8)), [monthTotal]);

  const maxScore = 100;
  const creditScore = useMemo(() => {
    const monthTotal = summary?.month_total ?? 0;
    if (!monthTotal) return 50;
    return Math.min(100, Math.max(50, Math.round(monthTotal / 1000)));
  }, [summary]);

  const SimpleChart = () => (
    <div className="flex items-end justify-center gap-2 h-48 p-4 bg-slate-50 rounded-lg">
      {monthlyChart.length === 0 ? (
        <p className="text-sm text-slate-500">{t("No daily sales logged yet.")}</p>
      ) : (
        monthlyChart.map((data, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 bg-gradient-to-t from-orange-500 to-orange-400"
              style={{
                height: `${(data.sales / 70000) * 100}%`,
                minHeight: '4px',
              }}
            />
            <span className="text-xs text-slate-600 font-medium">{data.month}</span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft size={20} />
            {t('Back')}
          </button>
          <LanguageToggle />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('Sales & Finance')}</h1>
        <p className="text-slate-600 mb-8">{t('Track your income and explore loan options')}</p>

        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t("Log Today's Sales")}</h2>
              <p className="text-slate-600 text-sm">{t('Store your daily sales and see monthly totals & charts.')}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500">{t('This month', 'This month')}</p>
                <p className="text-lg font-semibold text-slate-900">₹{monthTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="number"
              min="0"
              step="100"
              value={dailySales}
              onChange={(e) => setDailySales(e.target.value)}
              placeholder={t("Enter today's sales (₹)", "Enter today's sales (₹)")}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={async () => {
                if (!dailySales) return;
                setSaving(true);
                try {
                  await addSale({ amount: Number(dailySales) });
                  setDailySales('');
                  await fetchSummary();
                } catch (err) {
                  alert('Could not save sales. Please try again.');
                  console.error(err);
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? t('Saving...') : t('Save Sales')}
            </button>
          </div>

          {loadingSummary && (
            <p className="text-sm text-slate-500 mt-3">{t('Loading your sales data...', 'Loading your sales data...')}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            {
              title: t('Average Daily Sales'),
              value: `₹${Math.round((monthTotal || 0) / (summary?.entries.length ? new Set(summary.entries.map((e) => e.date.slice(0, 10))).size : 1)).toLocaleString()}`,
              icon: TrendingUp,
              color: 'from-green-500 to-emerald-600',
            },
            {
              title: t('Monthly Income'),
              value: `₹${Math.round(monthTotal).toLocaleString()}`,
              icon: DollarSign,
              color: 'from-blue-500 to-cyan-600',
            },
            {
              title: t("Today's Sales"),
              value: `₹${Math.round(todayTotal).toLocaleString()}`,
              icon: TrendingUp,
              color: 'from-purple-500 to-pink-600',
            },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div
                  className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}
                >
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t('6-Month Sales Trend')}</h2>
          <SimpleChart />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('Credit Score')}</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Credit Score</span>
                <span className="text-2xl font-bold text-slate-900">{creditScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-full"
                  style={{ width: `${creditScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-medium text-slate-900">{t('Good Payment History', 'Good Payment History')}</p>
                  <p className="text-slate-600">{t('No defaults recorded', 'No defaults recorded')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-medium text-slate-900">{t('Stable Income', 'Stable Income')}</p>
                  <p className="text-slate-600">₹{Math.round(avgDailySales).toLocaleString()}/day avg</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-medium text-slate-900">{t('High Hygiene Standards', 'High Hygiene Standards')}</p>
                  <p className="text-slate-600">{t('Data not yet provided', 'Data not yet provided')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('Loan Eligibility')}</h2>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
                <div>
                  <p className="font-bold text-green-900">{t('You are eligible for a loan!')}</p>
                  <p className="text-sm text-green-800 mt-1">
                    Maximum: ₹{loanCap.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLoanForm(!showLoanForm)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg transition"
            >
              {showLoanForm ? t('Cancel') : t('Apply for Loan')}
            </button>
          </div>
        </div>

        {showLoanForm && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{t('Loan Application')}</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Loan Amount (₹)')}
                </label>
                <input
                  type="range"
                  min="10000"
                  max={loanCap}
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-slate-600">{t('Min', 'Min')}: ₹10,000</span>
                  <span className="text-xl font-bold text-slate-900">₹{loanAmount.toLocaleString()}</span>
                  <span className="text-sm text-slate-600">{t('Max', 'Max')}: ₹{loanCap.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Loan Purpose')}
                </label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>{t('Equipment & Tools')}</option>
                  <option>{t('Stock & Inventory')}</option>
                  <option>{t('Stall Expansion')}</option>
                  <option>{t('Business Establishment')}</option>
                  <option>{t('Other')}</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">{t('Loan Details', 'Loan Details')}</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>{t('Loan Amount (₹)')}</span>
                    <span className="font-medium">₹{loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Tenure', 'Tenure')}:</span>
                    <span className="font-medium">12 {t('Months', 'Months')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Interest Rate', 'Interest Rate')}:</span>
                    <span className="font-medium">8% p.a.</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between font-bold">
                    <span>{t('Monthly EMI', 'Monthly EMI')}:</span>
                    <span>
                      ₹{Math.round((loanAmount * (1 + 0.08 * 1)) / 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoanForm(false)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={() => alert('Loan application submitted!')}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg transition"
                >
                  {t('Submit Application', 'Submit Application')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">{t('Money Tips')}</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• {t('Save at least 10% of your daily earnings', 'Save at least 10% of your daily earnings')}</li>
                <li>• {t('Keep business expenses separate from personal', 'Keep business expenses separate from personal')}</li>
                <li>• {t('Maintain a monthly income record for loan qualification', 'Maintain a monthly income record for loan qualification')}</li>
                <li>• {t('Reduce loan interest through early repayment', 'Reduce loan interest through early repayment')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
          >
            {t('Back')}
          </button>
          <button
            onClick={() => navigate('/promotion')}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition"
          >
            {t('View Promotion')}
          </button>
        </div>
      </main>
    </div>
  );
}
