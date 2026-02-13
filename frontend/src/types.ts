export interface Vendor {
  id: string;
  name: string;
  phone: string;
  vendorType: string;
  location: string;
  avgDailySales: number;
  legalCertificate?: string;
  hygieceScore: number;
  todaySales: number;
  monthlyIncome: number;
  loanEligibility: number;
  legalStatus: 'pending' | 'verified' | 'rejected';
  hygieneChecklist: HygieneItem[];
  promotionImage?: string;
  promotionDescription?: string;
  digitalPaymentsEnabled: boolean;
}

export interface HygieneItem {
  id: string;
  name: string;
  completed: boolean;
  category: 'stall' | 'products' | 'personal' | 'equipment';
}

export interface LoanApplication {
  id: string;
  vendorId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  purpose: string;
  appliedDate: string;
}
