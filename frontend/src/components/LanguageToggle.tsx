import { useI18n } from '../lib/i18n';

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500 font-medium">{t('Language', 'Language')}</span>
      <div className="flex rounded-full border border-slate-300 overflow-hidden">
        {(
          [
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिंदी' },
          ] as const
        ).map((option) => (
          <button
            key={option.code}
            onClick={() => setLang(option.code)}
            className={`px-3 py-1 text-xs font-semibold transition ${
              lang === option.code ? 'bg-orange-500 text-white' : 'bg-white text-slate-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
