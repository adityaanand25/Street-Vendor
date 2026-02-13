import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, Zap, CheckCircle2, Upload, Mail, Lock } from 'lucide-react';
import { signUp } from '../lib/api';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Registration() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    contactNumber: '',
    fullAddress: '',
    pincode: '',
    email: '',
    password: '',
    confirmPassword: '',
    fssaiLicense: '',
    gstNumber: '',
    shopPhoto: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hygiene, setHygiene] = useState({
    clean_premises: false,
    waste_disposal: false,
    staff_hygiene: false,
    pest_control: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, shopPhoto: e.target.files[0] }));
    }
  };

  const handleHygieneChange = (key: string) => {
    setHygiene((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmitRegistration = async () => {
    if (Object.values(hygiene).some((v) => !v)) {
      setError('Please confirm all hygiene and cleanliness checks.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // This is a simplified example. In a real app, you'd likely
      // use FormData to upload the file to your backend.
      const { shopPhoto, ...rest } = formData;
      console.log('Submitting:', { ...rest, shopPhotoName: shopPhoto?.name });
      const auth = await signUp({ email: formData.email, password: formData.password });
      localStorage.setItem('auth', JSON.stringify(auth));
      // Simulate API call for the remaining fields
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 4) * 100;

  const steps = [
    {
      title: t('Shop & Contact'),
      icon: <MapPin size={24} />,
    },
    {
      title: t('Login & Documents'),
      icon: <Mail size={24} />,
    },
    {
      title: t('Vendor Details'),
      icon: <Zap size={24} />,
    },
    {
      title: t('Hygiene Check'),
      icon: <CheckCircle2 size={24} />,
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="min-h-screen bg-white/60 backdrop-blur-sm">
        <nav className="bg-white/90 backdrop-blur border-b border-white/40 sticky top-0">
          <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="text-slate-700 hover:text-slate-900">
              ← {t('Back')}
            </button>
            <LanguageToggle />
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('Register as Vendor')}</h1>
            <p className="text-slate-600">{t('Complete your profile in 3 steps')}</p>
          </div>

          <div className="mb-6">
            <div className="h-2 rounded-full bg-white/70 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-red-400 to-amber-300"
                style={{ width: `${progress}%`, transition: 'width 200ms ease' }}
              />
            </div>
            <p className="text-xs text-slate-700 mt-2">
              {t('Step')} {step} / 4
            </p>
          </div>

          <div className="flex gap-2 mb-12">
            {steps.map((s, idx) => (
              <div key={idx} className="flex-1">
                <button
                  onClick={() => setStep(idx + 1)}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                    step === idx + 1
                      ? 'bg-orange-500 text-white'
                      : step > idx + 1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s.icon}
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{idx + 1}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-slate-100 shadow-xl ring-1 ring-slate-100 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Shop Name')}
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="e.g. Raju's Street Food"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t("Owner's Full Name")}
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Contact Number')}
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1 pl-1">{t('We’ll use this for important updates')}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Full Address')}
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  placeholder="Enter shop's full address"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Pincode')}
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit pincode"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                {t('Next')} <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Email for Login')}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Create Password')}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    minLength={8}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('Confirm Password')}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  {t('Back')}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  {t('Next')} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('FSSAI License Number (Optional)')}
                </label>
                <input
                  type="text"
                  name="fssaiLicense"
                  value={formData.fssaiLicense}
                  onChange={handleInputChange}
                  placeholder="14-digit FSSAI number"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {t('GST Number (Optional)')}
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="15-digit GSTIN"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  {t('Back')}
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  {t('Next')} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {t('Hygiene & Cleanliness Checklist')}
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  {t('Please confirm each hygiene item before submitting your registration.')}
                </p>
              </div>
              <div className="space-y-3">
                {Object.entries(hygiene).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      value
                        ? 'border-green-200 bg-green-50'
                        : 'border-slate-200 hover:border-orange-200'
                    }`}
                    onClick={() => handleHygieneChange(key)}
                  >
                    <input type="checkbox" checked={value} readOnly className="accent-orange-500" />
                    <span className="text-slate-800 capitalize">{key.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {t(error, error)}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  {t('Back')}
                </button>
                <button
                  onClick={handleSubmitRegistration}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? t('Submitting...') : t('Complete Registration')} <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </div>
  );
}
