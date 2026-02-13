import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, FileWarning, Shield } from 'lucide-react';
import { submitComplaint } from '../lib/api';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Complaint() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const navLinks = [
    { label: t('Dashboard'), to: '/dashboard' },
    { label: t('Sales & Finance'), to: '/finance' },
    { label: t('Hygiene'), to: '/hygiene' },
    { label: t('Promotion'), to: '/promotion' },
    { label: t('Complaint'), to: '/complaint' },
  ];

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    if (!subject.trim() || !description.trim()) {
      setError('Subject and description are required.');
      return;
    }
    setLoading(true);
    try {
      await submitComplaint({
        subject: subject.trim(),
        description: description.trim(),
        preferred_contact: preferredContact.trim() || undefined,
        evidence_url: evidenceUrl.trim() || undefined,
      });
      setSuccess(true);
      setSubject('');
      setDescription('');
      setPreferredContact('');
      setEvidenceUrl('');
    } catch (err) {
      setError('Could not submit complaint. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold"
          >
            <ArrowLeft size={18} />
            {t('Dashboard')}
          </button>
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <button
                  key={link.to}
                  onClick={() => navigate(link.to)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start gap-3 mb-6">
          <Shield className="text-orange-500" size={28} />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('Report Bribery / Misconduct')}</h1>
            <p className="text-slate-600">{t('Submit a confidential complaint against officials. Your identity stays protected.')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">{t('Subject')}</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('E.g., Bribery request during inspection', 'E.g., Bribery request during inspection')}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">{t('Description')}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('Provide details: date, place, names, what was requested, witnesses, etc.', 'Provide details: date, place, names, what was requested, witnesses, etc.')}
                className="w-full h-40 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">{t('Do not include sensitive credentials. Describe the incident clearly.', 'Do not include sensitive credentials. Describe the incident clearly.')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{t('Preferred contact (optional)')}</label>
                <input
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value)}
                  placeholder={t('Phone or email', 'Phone or email')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{t('Evidence link (optional)')}</label>
                <input
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder={t('Link to photos/docs', 'Link to photos/docs')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t('Submitting...') : t('Submit Complaint')}
            </button>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{t(error, error)}</div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
                <CheckCircle2 size={16} /> {t('Complaint submitted. We will review it.')}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-500" size={22} />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('Confidential')}</h3>
                <p className="text-xs text-slate-600">{t('Your report is stored securely. Share only necessary details.')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileWarning className="text-orange-500" size={22} />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('Evidence')}</h3>
                <p className="text-xs text-slate-600">{t('If you have photos/docs, provide a link. Do not upload sensitive IDs.')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="text-orange-500" size={22} />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('Follow-up')}</h3>
                <p className="text-xs text-slate-600">{t('We may contact you using the preferred contact you provide.')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
