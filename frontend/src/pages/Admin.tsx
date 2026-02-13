import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  X,
  LogOut,
  Menu,
  Filter,
} from 'lucide-react';
import { mockVendors } from '../data';
import { useI18n } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Admin() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<typeof mockVendors[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [vendors, setVendors] = useState(mockVendors);

  const filteredVendors = vendors.filter((v) => {
    if (filterStatus === 'all') return true;
    return v.legalStatus === filterStatus;
  });

  const stats = [
    {
      title: 'Total Vendors',
      value: vendors.length,
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Verified',
      value: vendors.filter((v) => v.legalStatus === 'verified').length,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Pending Review',
      value: vendors.filter((v) => v.legalStatus === 'pending').length,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Total Monthly Income',
      value: `₹${vendors.reduce((sum, v) => sum + v.monthlyIncome, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const handleApprove = (vendorId: string) => {
    setVendors(
      vendors.map((v) => (v.id === vendorId ? { ...v, legalStatus: 'verified' as const } : v))
    );
    setSelectedVendor(null);
  };

  const handleReject = (vendorId: string) => {
    setVendors(
      vendors.map((v) => (v.id === vendorId ? { ...v, legalStatus: 'rejected' as const } : v))
    );
    setSelectedVendor(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <BarChart3 className="text-white" size={20} />
            </div>
            <h1 className="text-lg font-bold text-slate-900">VendorHub Admin</h1>
          </div>

          <div className="hidden md:flex gap-6 items-center">
            <button className="text-slate-600 hover:text-slate-900 font-medium transition">
              {t('Dashboard')}
            </button>
            <button className="text-slate-600 hover:text-slate-900 font-medium transition">
              {t('Reports', 'Reports')}
            </button>
            <button className="text-slate-600 hover:text-slate-900 font-medium transition">
              {t('Settings', 'Settings')}
            </button>
            <LanguageToggle />
          </div>

          <button
            onClick={() => navigate('/')}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <LogOut size={18} />
            {t('Logout')}
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
            <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 border-b border-slate-100">
              Dashboard
            </button>
            <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 border-b border-slate-100">
              Reports
            </button>
            <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 border-b border-slate-100">
              Settings
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{t('Admin Dashboard')}</h2>
          <p className="text-slate-600">{t('Manage vendors and review applications')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition"
            >
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

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">Vendor Certificates</h3>
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Hygiene</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Monthly Income</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{vendor.name}</p>
                        <p className="text-sm text-slate-600">{vendor.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vendor.vendorType}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          vendor.legalStatus === 'verified'
                            ? 'bg-green-100 text-green-700'
                            : vendor.legalStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {vendor.legalStatus === 'verified'
                          ? '✓ Verified'
                          : vendor.legalStatus === 'pending'
                            ? 'Pending'
                            : 'Rejected'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                            style={{ width: `${vendor.hygieceScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600">{vendor.hygieceScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ₹{vendor.monthlyIncome.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Vendor Details</h2>
              <button
                onClick={() => setSelectedVendor(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="font-bold text-slate-900">{selectedVendor.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-bold text-slate-900">{selectedVendor.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Type</p>
                <p className="font-bold text-slate-900">{selectedVendor.vendorType}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Location</p>
                <p className="font-bold text-slate-900">{selectedVendor.location}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <p
                  className={`font-bold ${
                    selectedVendor.legalStatus === 'verified'
                      ? 'text-green-600'
                      : selectedVendor.legalStatus === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {selectedVendor.legalStatus === 'verified'
                    ? 'Verified'
                    : selectedVendor.legalStatus === 'pending'
                      ? 'Pending'
                      : 'Rejected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Hygiene Score</p>
                <p className="font-bold text-slate-900">{selectedVendor.hygieceScore}%</p>
              </div>
            </div>

            {selectedVendor.legalStatus === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleReject(selectedVendor.id)}
                  className="flex-1 py-2 border-2 border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedVendor.id)}
                  className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition"
                >
                  Approve
                </button>
              </div>
            )}

            {selectedVendor.legalStatus !== 'pending' && (
              <button
                onClick={() => setSelectedVendor(null)}
                className="w-full py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
