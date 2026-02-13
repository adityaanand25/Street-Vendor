import { Vendor, HygieneItem } from './types';

const hygieneChecklist: HygieneItem[] = [
  { id: '1', name: 'Clean utensils daily', category: 'equipment', completed: true },
  { id: '2', name: 'Wash hands before preparation', category: 'personal', completed: true },
  { id: '3', name: 'Use clean water source', category: 'products', completed: false },
  { id: '4', name: 'Proper food storage', category: 'products', completed: true },
  { id: '5', name: 'Stall covered properly', category: 'stall', completed: false },
  { id: '6', name: 'Waste disposal proper', category: 'stall', completed: true },
];

export const currentVendor: Vendor = {
  id: '',
  name: '',
  phone: '',
  vendorType: '',
  location: '',
  avgDailySales: 0,
  legalCertificate: undefined,
  hygieceScore: 0,
  todaySales: 0,
  monthlyIncome: 0,
  loanEligibility: 0,
  legalStatus: 'pending',
  hygieneChecklist: [],
  digitalPaymentsEnabled: false,
};

export const mockVendors: Vendor[] = [];

export const monthlyData: { month: string; sales: number }[] = [];
