import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, Gavel, ShieldCheck, UploadCloud } from 'lucide-react';
import LanguageToggle from '../components/LanguageToggle';
import { useI18n } from '../lib/i18n';

export default function Legal() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [caseTitle, setCaseTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [contact, setContact] = useState('');
  const [attachment, setAttachment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setCaseTitle('');
    setSummary('');
    setContact('');
    setAttachment('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold"
          >
            <ArrowLeft size={18} />
            {t('Home')}
          </button>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition"
            >
              {t('Dashboard')}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-start gap-3 mb-6">
            <ShieldCheck className="text-orange-500" size={26} />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-600 font-semibold mb-1">{t('Demo')}</p>
              <h1 className="text-3xl font-bold text-slate-900">{t('Submit a Legal Request')}</h1>
              <p className="text-slate-600">{t('This demo form helps vendors draft legal help requests. No data is sent to any server.')}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{t('Case title')}</label>
                <input
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder={t('E.g., License renewal delay')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{t('Summary')}</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={t('Describe the issue, officials involved, and any deadlines.')}
                  className="w-full h-36 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">{t('For demo only. Do not paste sensitive personal data.')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">{t('Preferred contact')}</label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t('Phone or email')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">{t('Attachment link (optional)')}</label>
                  <input
                    value={attachment}
                    onChange={(e) => setAttachment(e.target.value)}
                    placeholder={t('Link to documents or photos')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                {t('Save Draft (Demo)')}
              </button>

              {submitted && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle2 size={16} /> {t('Draft saved locally. This is a demo only.')}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {[{
                icon: Gavel,
                title: t('Not legal advice'),
                body: t('This tool is for demonstration. Consult a lawyer for formal guidance.'),
              }, {
                icon: FileText,
                title: t('What to include'),
                body: t('Key dates, notices received, officer names, and any reference numbers.'),
              }, {
                icon: UploadCloud,
                title: t('Evidence links'),
                body: t('Share cloud links instead of uploads. Avoid sharing Aadhaar/PAN in demos.'),
              }].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex gap-3">
                  <item.icon className="text-orange-500" size={20} />
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
