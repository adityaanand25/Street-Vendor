import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Eye, EyeOff, Upload } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Promotion() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('auth') : null;
  const authUser = storedAuth ? JSON.parse(storedAuth) : null;
  const vendorName = authUser?.user?.email || 'Your Stall';
  const vendorType = 'Vendor';
  const [description, setDescription] = useState('Fresh & delicious street food');
  const [visible, setVisible] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const handleToggleVisibility = () => {
    setVisible(!visible);
  };

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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('Promote Your Stall')}</h1>
        <p className="text-slate-600 mb-8">{t('Increase your online visibility and attract more customers')}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('Upload Photo')}</h2>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-orange-500 transition cursor-pointer mb-4">
                <Camera className="mx-auto mb-3 text-slate-400" size={40} />
                <p className="text-slate-600 font-medium mb-1">{t('Click to upload stall photo')}</p>
                <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
              <p className="text-sm text-slate-600">
                {t('High-quality photos of your stall and products help attract customers', 'High-quality photos of your stall and products help attract customers')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('Description')}</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description of your stall..."
                className="w-full h-24 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                maxLength={200}
              />
              <p className="text-xs text-slate-500 mt-2">{description.length}/200 characters</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('Visibility')}</h2>
              <div
                onClick={handleToggleVisibility}
                className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-orange-300 transition"
              >
                <div className="flex items-center gap-3">
                  {visible ? (
                    <Eye className="text-green-500" size={24} />
                  ) : (
                    <EyeOff className="text-slate-400" size={24} />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">
                      {visible ? t('Visible Online') : t('Hidden')}
                    </p>
                    <p className="text-sm text-slate-600">
                      {visible
                        ? t('Your stall is visible to customers')
                        : t('Your stall is not visible')}
                    </p>
                  </div>
                </div>
                <div
                  className={`relative inline-flex h-8 w-14 items-center rounded-full ${
                    visible ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      visible ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setPreviewMode(true)}
              className="w-full py-3 border-2 border-orange-500 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition"
            >
              {t('Preview Card')}
            </button>
          </div>

          <div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-20">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('Preview')}</h2>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center">
                    <Camera className="text-white" size={48} />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-900">{vendorName}</h3>
                    <p className="text-sm text-slate-600 mb-2">{vendorType}</p>

                    <p className="text-slate-700 text-sm mb-4">{description}</p>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-medium">{t('Location', 'Location')}:</span>
                        <span>{t('Update in profile', 'Update in profile')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-medium">{t('Avg Daily', 'Avg Daily')}:</span>
                        <span>—</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-medium">{t('Payments', 'Payments')}:</span>
                        <span>{t('Configure in settings', 'Configure in settings')}</span>
                      </div>
                    </div>

                    <div className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg text-center text-sm">
                      {t('View Profile', 'View Profile')}
                    </div>
                  </div>
                </div>

                {!visible && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700 font-medium">
                      ⚠️ {t('This preview is currently hidden from customers', 'This preview is currently hidden from customers')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-900 text-sm mb-2">{t('Tips for Better Visibility')}</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• {t('Use clear, well-lit photos', 'Use clear, well-lit photos')}</li>
                  <li>• {t('Write honest product descriptions', 'Write honest product descriptions')}</li>
                  <li>• {t('Include your best-selling items', 'Include your best-selling items')}</li>
                  <li>• {t('Enable digital payments', 'Enable digital payments')}</li>
                  <li>• {t('Maintain high hygiene score', 'Maintain high hygiene score')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
          >
            {t('Back')}
          </button>
          <button
            onClick={() => navigate('/finance')}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition"
          >
            {t('Save & Continue')}
          </button>
        </div>
      </main>
    </div>
  );
}
