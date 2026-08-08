/**
 * VendorFlow - Autonomous B2B Invoice Audit, Fraud Check & Payout Engine
 * Global TypeScript Interface Definitions
 */

export type UserRole = 'FINANCE_ADMIN' | 'VENDOR';

export type InvoiceStatus = 
  | 'PENDING_AUDIT'
  | 'AUTO_APPROVED'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'REJECTED'
  | 'PAYOUT_PROCESSING'
  | 'PAID'
  | 'BLOCKED_HIGH_RISK';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branch: string;
  isVerified: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  gstin: string;
  email: string;
  phone: string;
  registeredBank: BankDetails;
  status: 'ACTIVE' | 'FLAGGED' | 'SUSPENDED';
  rating: number; // 1-5 rating based on history
  totalPaidINR: number;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceINR: number;
  totalINR: number;
  poQuantityMatch?: boolean;
  poUnitPriceMatch?: boolean;
  priceVariancePercent?: number;
}

export interface PurchaseOrder {
  poNumber: string;
  vendorId: string;
  vendorName: string;
  issueDate: string;
  expiryDate: string;
  items: LineItem[];
  subtotalINR: number;
  taxGSTPercent: number;
  totalAmountINR: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  approvedBy: string;
}

export interface RiskFactor {
  code: string;
  label: string;
  scoreImpact: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface DecisionRationale {
  finalDecision: InvoiceStatus;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  aiConfidencePercent: number;
  summaryText: string;
  keyReasons: string[];
  poMatchResult: {
    matched: boolean;
    poNumberFound?: string;
    amountVarianceINR: number;
    amountVariancePercent: number;
  };
  vendorMatchResult: {
    vendorFound: boolean;
    gstinMatch: boolean;
    nameMatch: boolean;
  };
  bankVerificationResult: {
    matched: boolean;
    isAccountChanged: boolean;
    invoiceBankDetails: BankDetails;
    registeredBankDetails: BankDetails;
  };
  duplicateCheckResult: {
    isDuplicate: boolean;
    duplicateOfInvoiceId?: string;
  };
  riskFactors: RiskFactor[];
}

export interface PaymentRecord {
  transactionId: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorName: string;
  amountINR: number;
  paidAt: string;
  paymentMethod: 'IMPS' | 'NEFT' | 'RTGS' | 'SIMULATED_UPI';
  status: 'PROCESSING' | 'CLEARING' | 'SETTLED' | 'FAILED';
  receiptUrl?: string;
  bankRefNumber: string;
  utrNumber: string;
}

export interface AuditEvent {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  invoiceId: string;
  invoiceNumber: string;
  actor: 'AI_AGENT' | 'FINANCE_ADMIN' | 'VENDOR' | 'SYSTEM_ENGINE';
  action: string;
  previousStatus?: InvoiceStatus;
  newStatus: InvoiceStatus;
  details: string;
  previousHash: string;
  currentHash: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  vendorGSTIN: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;
  lineItems: LineItem[];
  subtotalINR: number;
  taxGSTPercent: number;
  totalAmountINR: number;
  invoiceBankDetails: BankDetails;
  
  // Workflow & Audit
  status: InvoiceStatus;
  uploadedAt: string;
  uploadedBy: string;
  fileUrl?: string;
  fileName?: string;
  sourceType?: 'REAL_UPLOAD' | 'DEMO_SCENARIO';
  
  // AI & Risk Evaluation
  decisionRationale?: DecisionRationale;
  humanReviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;

  // Payment Link
  paymentRecord?: PaymentRecord;
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  tag: 'AUTO_APPROVED' | 'HUMAN_REVIEW' | 'HIGH_RISK_BLOCKED';
  description: string;
  invoice: Partial<Invoice>;
  expectedOutcome: string;
}
