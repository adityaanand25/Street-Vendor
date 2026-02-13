import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Lightbulb } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Hygiene() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [checklist, setChecklist] = useState([]);

  const toggleItem = (id: string) => {
    setChecklist(checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalItems = checklist.length || 1;
  const score = Math.round((completedCount / totalItems) * 100);

  const tips = [
    {
      category: 'Stall Maintenance',
      items: [
        'Clean and disinfect your stall daily',
        'Keep a covered trash bin nearby',
        'Use food-grade storage containers',
        'Ensure proper ventilation',
      ],
    },
    {
      category: 'Personal Hygiene',
      items: [
        'Wash hands before and after handling food',
        'Wear clean clothes daily',
        'Trim nails regularly',
        'Use disposable gloves when handling ready-to-eat food',
      ],
    },
    {
      category: 'Food Safety',
      items: [
        'Use clean water for preparation',
        'Check expiry dates on all ingredients',
        'Separate raw and cooked foods',
        'Keep food at safe temperatures',
      ],
    },
  ];

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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('Hygiene & Cleanliness')}</h1>
        <p className="text-slate-600 mb-8">{t('Track your hygiene score and get improvement tips')}</p>

        <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('Your Hygiene Score')}</h2>
              <p className="text-slate-600">
                {completedCount} {t('of', 'of')} {checklist.length} {t('items completed', 'items completed')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                {score}%
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {score >= 80 ? t('Excellent', '🌟 उत्कृष्ट') : score >= 60 ? t('Good', '👍 अच्छा') : t('Needs Work', '⚠️ सुधार जरूरी')}
              </p>
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('Cleanliness Checklist')}</h2>

          <div className="space-y-3 mb-8">
            {checklist.length === 0 ? (
              <p className="text-sm text-slate-500">{t('No hygiene items yet. Add your checklist to start tracking.', 'No hygiene items yet. Add your checklist to start tracking.')}</p>
            ) : (
              checklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                    item.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="mt-1 flex-shrink-0 focus:outline-none"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="text-green-500" size={24} />
                    ) : (
                      <Circle className="text-slate-300" size={24} />
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${item.completed ? 'text-green-700 line-through' : 'text-slate-900'}`}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 capitalize">{item.category}</p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900">{t('Improvement Tips')}</h2>

          {tips.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="text-orange-500 flex-shrink-0" size={24} />
                <h3 className="text-lg font-bold text-slate-900">{t(section.category, section.category)}</h3>
              </div>

              <ul className="space-y-2 ml-9">
                {section.items.map((tip, tipIdx) => (
                  <li key={tipIdx} className="text-slate-600 flex items-start gap-2">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>{t(tip, tip)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 mb-8">
          <h3 className="font-bold text-blue-900 mb-2">{t('Did you know?')}</h3>
          <p className="text-blue-800 text-sm">
            Vendors with a hygiene score above 80% receive 20% higher customer trust ratings and
            can qualify for premium promotional features on VendorHub!
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
          >
            {t('Back to Dashboard')}
          </button>
          <button
            onClick={() => navigate('/promotion')}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition"
          >
            {t('Go to Promotion')}
          </button>
        </div>
      </main>
    </div>
  );
}
