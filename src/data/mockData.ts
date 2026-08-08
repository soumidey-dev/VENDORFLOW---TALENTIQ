/**
 * VendorFlow - Pre-seeded Synthetic Demo Data
 * Contains fictional B2B vendors, active purchase orders, and demo invoice scenarios.
 * NOTE: DEMO DATA ONLY — NO REAL MONEY TRANSFER.
 */

import { Vendor, PurchaseOrder, Invoice, AuditEvent, DemoScenario } from '../types';

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'VEND-101',
    name: 'TechSource Solutions Pvt Ltd',
    gstin: '27AABCT1234H1Z5',
    email: 'accounts@techsourcesolutions.co.in',
    phone: '+91 98200 11223',
    registeredBank: {
      accountName: 'TechSource Solutions Pvt Ltd',
      accountNumber: '918020045612390',
      ifscCode: 'HDFC0000240',
      bankName: 'HDFC Bank Ltd',
      branch: 'BKC Branch, Mumbai',
      isVerified: true
    },
    status: 'ACTIVE',
    rating: 4.9,
    totalPaidINR: 1850000
  },
  {
    id: 'VEND-102',
    name: 'Apex Logistics India Ltd',
    gstin: '29AAACA5678J1Z2',
    email: 'billing@apexlogistics.in',
    phone: '+91 98450 33445',
    registeredBank: {
      accountName: 'Apex Logistics India Ltd',
      accountNumber: '006010200089123',
      ifscCode: 'UTIB0000060',
      bankName: 'Axis Bank',
      branch: 'Indiranagar, Bengaluru',
      isVerified: true
    },
    status: 'ACTIVE',
    rating: 4.5,
    totalPaidINR: 620000
  },
  {
    id: 'VEND-103',
    name: 'CyberGrid Security Systems',
    gstin: '07AAACC9911K1Z9',
    email: 'finance@cybergrid.co.in',
    phone: '+91 99100 55667',
    registeredBank: {
      accountName: 'CyberGrid Security Systems',
      accountNumber: '50200012345678',
      ifscCode: 'ICIC0000104',
      bankName: 'ICICI Bank',
      branch: 'Connaught Place, New Delhi',
      isVerified: true
    },
    status: 'FLAGGED',
    rating: 3.8,
    totalPaidINR: 450000
  },
  {
    id: 'VEND-104',
    name: 'Mahindra Facility Care',
    gstin: '27AABCM8822F1Z1',
    email: 'payables@mahindrafacility.com',
    phone: '+91 97690 77889',
    registeredBank: {
      accountName: 'Mahindra Facility Care',
      accountNumber: '000301501234',
      ifscCode: 'SBIN0000300',
      bankName: 'State Bank of India',
      branch: 'Nariman Point, Mumbai',
      isVerified: true
    },
    status: 'ACTIVE',
    rating: 4.8,
    totalPaidINR: 280000
  },
  {
    id: 'VEND-8812',
    name: 'TechMatters India Pvt Ltd',
    gstin: '27AAACT8812P1Z8',
    email: 'accounts@techmatters.co.in',
    phone: '+91 98110 88812',
    registeredBank: {
      accountName: 'TechMatters India Pvt Ltd',
      accountNumber: 'DEMO-8812-0001',
      ifscCode: 'DEMO0008812',
      bankName: 'Demo National Bank',
      branch: 'Tech Park Branch, Bengaluru',
      isVerified: true
    },
    status: 'ACTIVE',
    rating: 4.9,
    totalPaidINR: 1250000
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    poNumber: 'PO-2026-8812',
    vendorId: 'VEND-8812',
    vendorName: 'TechMatters India Pvt Ltd',
    issueDate: '2026-07-01',
    expiryDate: '2026-09-30',
    subtotalINR: 320000,
    taxGSTPercent: 18,
    totalAmountINR: 377600,
    status: 'ACTIVE',
    approvedBy: 'Sanjay Mehta (Procurement Director)',
    items: [
      {
        id: 'POI-8812-1',
        description: 'Business Laptop',
        quantity: 5,
        unitPriceINR: 50000,
        totalINR: 250000
      },
      {
        id: 'POI-8812-2',
        description: 'Wireless Keyboard & Mouse',
        quantity: 10,
        unitPriceINR: 2000,
        totalINR: 20000
      },
      {
        id: 'POI-8812-3',
        description: 'USB-C Docking Station',
        quantity: 5,
        unitPriceINR: 10000,
        totalINR: 50000
      }
    ]
  },
  {
    poNumber: 'PO-2026-8821',
    vendorId: 'VEND-101',
    vendorName: 'TechSource Solutions Pvt Ltd',
    issueDate: '2026-07-15',
    expiryDate: '2026-09-15',
    subtotalINR: 360254,
    taxGSTPercent: 18,
    totalAmountINR: 425100,
    status: 'ACTIVE',
    approvedBy: 'Rajesh Kumar (Procurement Head)',
    items: [
      {
        id: 'POI-101',
        description: 'Dell Latitude 5540 Enterprise Laptops (i7, 16GB, 512GB SSD)',
        quantity: 5,
        unitPriceINR: 68000,
        totalINR: 340000
      },
      {
        id: 'POI-102',
        description: 'Dell USB-C Triple Display Docking Stations',
        quantity: 5,
        unitPriceINR: 4050.8,
        totalINR: 20254
      }
    ]
  },
  {
    poNumber: 'PO-2026-8822',
    vendorId: 'VEND-102',
    vendorName: 'Apex Logistics India Ltd',
    issueDate: '2026-07-20',
    expiryDate: '2026-08-30',
    subtotalINR: 80000,
    taxGSTPercent: 18,
    totalAmountINR: 94400,
    status: 'ACTIVE',
    approvedBy: 'Anita Sharma (Logistics Manager)',
    items: [
      {
        id: 'POI-201',
        description: 'Pan-India Air Express Freight Shipping - Q3 Batch',
        quantity: 100,
        unitPriceINR: 800,
        totalINR: 80000
      }
    ]
  },
  {
    poNumber: 'PO-2026-8823',
    vendorId: 'VEND-103',
    vendorName: 'CyberGrid Security Systems',
    issueDate: '2026-08-01',
    expiryDate: '2026-09-01',
    subtotalINR: 127118,
    taxGSTPercent: 18,
    totalAmountINR: 150000,
    status: 'ACTIVE',
    approvedBy: 'Siddharth V (CTO)',
    items: [
      {
        id: 'POI-301',
        description: 'Enterprise NextGen Firewall Annual License & Threat Shield',
        quantity: 1,
        unitPriceINR: 127118,
        totalINR: 127118
      }
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    invoiceNumber: 'TSS/2026/0942',
    vendorId: 'VEND-101',
    vendorName: 'TechSource Solutions Pvt Ltd',
    vendorGSTIN: '27AABCT1234H1Z5',
    invoiceDate: '2026-08-02',
    dueDate: '2026-08-17',
    poNumber: 'PO-2026-8821',
    subtotalINR: 360254,
    taxGSTPercent: 18,
    totalAmountINR: 425100,
    status: 'PAID',
    uploadedAt: '2026-08-02T10:15:00Z',
    uploadedBy: 'TechSource Accounts Portal',
    fileName: 'TechSource_INV_0942.pdf',
    invoiceBankDetails: {
      accountName: 'TechSource Solutions Pvt Ltd',
      accountNumber: '918020045612390',
      ifscCode: 'HDFC0000240',
      bankName: 'HDFC Bank Ltd',
      branch: 'BKC Branch, Mumbai',
      isVerified: true
    },
    lineItems: [
      {
        id: 'LI-001',
        description: 'Dell Latitude 5540 Enterprise Laptops (i7, 16GB, 512GB SSD)',
        quantity: 5,
        unitPriceINR: 68000,
        totalINR: 340000,
        poQuantityMatch: true,
        poUnitPriceMatch: true,
        priceVariancePercent: 0
      },
      {
        id: 'LI-002',
        description: 'Dell USB-C Triple Display Docking Stations',
        quantity: 5,
        unitPriceINR: 4050.8,
        totalINR: 20254,
        poQuantityMatch: true,
        poUnitPriceMatch: true,
        priceVariancePercent: 0
      }
    ],
    decisionRationale: {
      finalDecision: 'AUTO_APPROVED',
      riskScore: 2,
      riskLevel: 'LOW',
      aiConfidencePercent: 98,
      summaryText: 'Invoice matched PO-2026-8821 perfectly. Line items, unit prices, GST tax calculation, and bank details verified against registered vendor profile.',
      keyReasons: [
        'Exact match with active Purchase Order PO-2026-8821',
        'Line-item prices and quantities have 0.0% variance',
        'Vendor GSTIN and Bank Details match registered master database',
        'Duplicate check clean — no prior submission found'
      ],
      poMatchResult: {
        matched: true,
        poNumberFound: 'PO-2026-8821',
        amountVarianceINR: 0,
        amountVariancePercent: 0
      },
      vendorMatchResult: {
        vendorFound: true,
        gstinMatch: true,
        nameMatch: true
      },
      bankVerificationResult: {
        matched: true,
        isAccountChanged: false,
        invoiceBankDetails: {
          accountName: 'TechSource Solutions Pvt Ltd',
          accountNumber: '918020045612390',
          ifscCode: 'HDFC0000240',
          bankName: 'HDFC Bank Ltd',
          branch: 'BKC Branch, Mumbai',
          isVerified: true
        },
        registeredBankDetails: {
          accountName: 'TechSource Solutions Pvt Ltd',
          accountNumber: '918020045612390',
          ifscCode: 'HDFC0000240',
          bankName: 'HDFC Bank Ltd',
          branch: 'BKC Branch, Mumbai',
          isVerified: true
        }
      },
      duplicateCheckResult: {
        isDuplicate: false
      },
      riskFactors: []
    },
    paymentRecord: {
      transactionId: 'TXN-IN-2026-082914',
      invoiceId: 'INV-2026-001',
      invoiceNumber: 'TSS/2026/0942',
      vendorName: 'TechSource Solutions Pvt Ltd',
      amountINR: 425100,
      paidAt: '2026-08-02T10:15:03Z',
      paymentMethod: 'RTGS',
      status: 'SETTLED',
      bankRefNumber: 'CMS88201920141',
      utrNumber: 'HDFCR5202608029810412'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUD-1001',
    sequenceNumber: 1,
    timestamp: '2026-08-02T10:15:00Z',
    invoiceId: 'INV-2026-001',
    invoiceNumber: 'TSS/2026/0942',
    actor: 'VENDOR',
    action: 'INVOICE_UPLOADED',
    newStatus: 'PENDING_AUDIT',
    details: 'Vendor uploaded invoice PDF TSS/2026/0942 via Vendor Portal',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'AUD-1002',
    sequenceNumber: 2,
    timestamp: '2026-08-02T10:15:01Z',
    invoiceId: 'INV-2026-001',
    invoiceNumber: 'TSS/2026/0942',
    actor: 'AI_AGENT',
    action: 'GEMINI_EXTRACTION_COMPLETED',
    previousStatus: 'PENDING_AUDIT',
    newStatus: 'PENDING_AUDIT',
    details: 'Gemini 2.5 Flash extracted structured data with 98% confidence',
    previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    currentHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  },
  {
    id: 'AUD-1003',
    sequenceNumber: 3,
    timestamp: '2026-08-02T10:15:02Z',
    invoiceId: 'INV-2026-001',
    invoiceNumber: 'TSS/2026/0942',
    actor: 'SYSTEM_ENGINE',
    action: 'RISK_ENGINE_DECISION',
    previousStatus: 'PENDING_AUDIT',
    newStatus: 'AUTO_APPROVED',
    details: 'Calculated Risk Score: 2/100 (LOW). Auto-approved under threshold (<10).',
    previousHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    currentHash: '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a'
  },
  {
    id: 'AUD-1004',
    sequenceNumber: 4,
    timestamp: '2026-08-02T10:15:03Z',
    invoiceId: 'INV-2026-001',
    invoiceNumber: 'TSS/2026/0942',
    actor: 'SYSTEM_ENGINE',
    action: 'SIMULATED_PAYOUT_SETTLED',
    previousStatus: 'AUTO_APPROVED',
    newStatus: 'PAID',
    details: 'Simulated RTGS payout ₹4,25,100 completed. UTR: HDFCR5202608029810412. Receipt generated.',
    previousHash: '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    currentHash: '4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e'
  }
];

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'SCENARIO_1_CLEAN',
    title: 'Scenario 1: Clean Invoice (Auto-Approved)',
    subtitle: 'TechSource Solutions • PO-2026-8821 • ₹4,25,100',
    tag: 'AUTO_APPROVED',
    description: 'Perfect match with registered PO, verified vendor bank details, 0% price variance. System automatically audits and executes simulated RTGS payment in 2 seconds.',
    expectedOutcome: 'Risk Score: 2/100 → AUTO-APPROVED → Payout Settled in 2s',
    invoice: {
      invoiceNumber: 'TSS/2026/0988',
      vendorId: 'VEND-101',
      vendorName: 'TechSource Solutions Pvt Ltd',
      vendorGSTIN: '27AABCT1234H1Z5',
      invoiceDate: '2026-08-07',
      dueDate: '2026-08-22',
      poNumber: 'PO-2026-8821',
      subtotalINR: 360254,
      taxGSTPercent: 18,
      totalAmountINR: 425100,
      fileName: 'TechSource_INV_0988_Clean.pdf',
      invoiceBankDetails: {
        accountName: 'TechSource Solutions Pvt Ltd',
        accountNumber: '918020045612390',
        ifscCode: 'HDFC0000240',
        bankName: 'HDFC Bank Ltd',
        branch: 'BKC Branch, Mumbai',
        isVerified: true
      },
      lineItems: [
        {
          id: 'LI-S1-1',
          description: 'Dell Latitude 5540 Enterprise Laptops (i7, 16GB, 512GB SSD)',
          quantity: 5,
          unitPriceINR: 68000,
          totalINR: 340000
        },
        {
          id: 'LI-S1-2',
          description: 'Dell USB-C Triple Display Docking Stations',
          quantity: 5,
          unitPriceINR: 4050.8,
          totalINR: 20254
        }
      ]
    }
  },
  {
    id: 'SCENARIO_2_DISCREPANCY',
    title: 'Scenario 2: Price Discrepancy (Human Review)',
    subtitle: 'Apex Logistics • PO-2026-8822 • Billed ₹900/unit vs PO ₹800/unit (+12.5%)',
    tag: 'HUMAN_REVIEW',
    description: 'Vendor billed unit price ₹900 vs approved PO unit price ₹800 resulting in a +12.5% price inflation above approved PO (exceeding 5% threshold). System flags exception for Finance Admin review.',
    expectedOutcome: 'Risk Score: 35/100 → HUMAN REVIEW REQUIRED → Flagged in Admin Queue',
    invoice: {
      invoiceNumber: 'APX/2026/7710',
      vendorId: 'VEND-102',
      vendorName: 'Apex Logistics India Ltd',
      vendorGSTIN: '29AAACA5678J1Z2',
      invoiceDate: '2026-08-07',
      dueDate: '2026-08-21',
      poNumber: 'PO-2026-8822',
      subtotalINR: 90000,
      taxGSTPercent: 18,
      totalAmountINR: 106200,
      fileName: 'ApexLogistics_INV_7710_PriceInflation.pdf',
      invoiceBankDetails: {
        accountName: 'Apex Logistics India Ltd',
        accountNumber: '006010200089123',
        ifscCode: 'UTIB0000060',
        bankName: 'Axis Bank',
        branch: 'Indiranagar, Bengaluru',
        isVerified: true
      },
      lineItems: [
        {
          id: 'LI-S2-1',
          description: 'Pan-India Air Express Freight Shipping - Q3 Batch',
          quantity: 100,
          unitPriceINR: 900,
          totalINR: 90000,
          poQuantityMatch: true,
          poUnitPriceMatch: false,
          priceVariancePercent: 12.5
        }
      ]
    }
  },
  {
    id: 'SCENARIO_3_FRAUD_BANK_SWAP',
    title: 'Scenario 3: Bank Account Swap Attack (Blocked High Risk)',
    subtitle: 'CyberGrid Security • PO-2026-8823 • Unauthorized Bank Account Swap',
    tag: 'HIGH_RISK_BLOCKED',
    description: 'Invoice presents altered bank details (different IFSC & unverified beneficiary account) attempting payment diversion. Deterministic engine flags critical fraud indicator and blocks payout immediately.',
    expectedOutcome: 'Risk Score: 88/100 (CRITICAL) → BLOCKED HIGH RISK → ₹1,50,000 Capital Protected',
    invoice: {
      invoiceNumber: 'CGB/2026/1109',
      vendorId: 'VEND-103',
      vendorName: 'CyberGrid Security Systems',
      vendorGSTIN: '07AAACC9911K1Z9',
      invoiceDate: '2026-08-07',
      dueDate: '2026-08-14',
      poNumber: 'PO-2026-8823',
      subtotalINR: 127118,
      taxGSTPercent: 18,
      totalAmountINR: 150000,
      fileName: 'CyberGrid_INV_1109_BankSwapFraud.pdf',
      invoiceBankDetails: {
        accountName: 'CyberGrid Cybernet FastPay',
        accountNumber: '99988877711122',
        ifscCode: 'PYTM0123456',
        bankName: 'Paytm Payments Bank',
        branch: 'Virtual Branch',
        isVerified: false
      },
      lineItems: [
        {
          id: 'LI-S3-1',
          description: 'Enterprise NextGen Firewall Annual License & Threat Shield',
          quantity: 1,
          unitPriceINR: 127118,
          totalINR: 127118
        }
      ]
    }
  }
];
