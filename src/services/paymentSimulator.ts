/**
 * VendorFlow - Synthetic Payout Gateway Simulator
 * Simulates B2B RTGS / NEFT / IMPS clearing and generates GST-ready payment receipts.
 * NOTE: SIMULATED ENVIRONMENT ONLY — NO REAL MONEY MOVEMENT.
 */

import { PaymentRecord, Invoice } from '../types';

export function executeSimulatedPayout(invoice: Invoice): PaymentRecord {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  
  const dateStr = now.toISOString().slice(0,10).replace(/-/g, '');
  const utrNumber = `HDFCR5${dateStr}${randomSuffix}`;
  const bankRefNumber = `CMS${dateStr}${Math.floor(1000 + Math.random() * 9000)}`;
  const transactionId = `TXN-IN-${dateStr}-${randomSuffix}`;

  const paymentRecord: PaymentRecord = {
    transactionId,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    vendorName: invoice.vendorName,
    amountINR: invoice.totalAmountINR,
    paidAt: now.toISOString(),
    paymentMethod: invoice.totalAmountINR >= 200000 ? 'RTGS' : 'NEFT',
    status: 'SETTLED',
    bankRefNumber,
    utrNumber
  };

  return paymentRecord;
}
