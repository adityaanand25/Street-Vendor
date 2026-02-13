import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { fetchPolicies, type Policy } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Policies() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPolicies(region || undefined);
        setPolicies(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load policies';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [region]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition"
              aria-label={t('Back')}
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">{t('Government Policies')}</h1>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-orange-500 font-semibold">{t('Stay compliant')}</p>
              <h2 className="text-3xl font-bold text-slate-900">{t('Policies for Street Vendors')}</h2>
              <p className="text-slate-600 max-w-2xl">
                {t('Understand your rights, access benefits, and avoid penalties by following these official policies and schemes.')}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={t('Filter by region (e.g., India)')}
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={() => setRegion('')}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                {t('Clear')}
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-700">
            <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg font-semibold">
              <ShieldCheck size={16} /> {t('Know your rights and protections')}
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg font-semibold">
              <MapPin size={16} /> {t('Find region-specific guidance')}
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-semibold">
              <ExternalLink size={16} /> {t('Access official sources quickly')}
            </div>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {loading && (
            <div className="col-span-2 text-center text-slate-600">{t('Loading policies...')}</div>
          )}
          {error && (
            <div className="col-span-2 text-center text-red-600 font-semibold">{error}</div>
          )}
          {!loading && !error && policies.length === 0 && (
            <div className="col-span-2 text-center text-slate-600">{t('No policies found for this region yet.')}</div>
          )}
          {policies.map((policy) => (
            <article
              key={policy.title}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">{policy.region}</p>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{t(policy.title, policy.title)}</h3>
                </div>
                <a
                  href={policy.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-orange-600 font-semibold hover:underline"
                >
                  {t('Source')} <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-slate-700 leading-relaxed">{t(policy.summary, policy.summary)}</p>
            </article>
          ))}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-2">{t('Why this helps vendors')}</h4>
          <ul className="list-disc pl-5 text-slate-700 space-y-2">
            <li>{t('Prevents unexpected fines or eviction by following official vending rules.')}</li>
            <li>{t('Unlocks financial schemes like PM SVANidhi for working capital and subsidies.')}</li>
            <li>{t('Clarifies documentation needed for vending certificates and ID cards.')}</li>
            <li>{t('Gives trusted links to apply or read details directly from government sites.')}</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
