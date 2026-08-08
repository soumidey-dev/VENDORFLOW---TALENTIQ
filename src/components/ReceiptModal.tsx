import React, { useState } from 'react';
import { Invoice } from '../types';
import { X, CheckCircle2, Download, Printer, ShieldCheck, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';

interface ReceiptModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, onClose }) => {
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!invoice || !invoice.paymentRecord) return null;

  const record = invoice.paymentRecord;
  const formatRupees = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      setDownloadError(null);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const cleanInvoiceNum = (invoice.invoiceNumber || 'INV').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `VendorFlow_Payment_Receipt_${cleanInvoiceNum}.pdf`;

      // Page Header Banner
      doc.setFillColor(15, 23, 42); // dark navy
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('VENDORFLOW AUTONOMOUS AP', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129); // emerald-400
      doc.text('OFFICIAL B2B PAYMENT SETTLEMENT RECEIPT', 14, 22);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 145, 22);

      // DEMO DATA Disclaimer Banner
      doc.setFillColor(254, 242, 242); // red-50
      doc.setDrawColor(248, 113, 113); // red-400
      doc.rect(14, 36, 182, 9, 'DF');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(220, 38, 38); // red-600
      doc.text('DEMO DATA — NO REAL MONEY TRANSFER', 105, 42, { align: 'center' });

      // Settlement Status Card
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.setDrawColor(16, 185, 129); // emerald-500
      doc.rect(14, 49, 182, 22, 'DF');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105);
      doc.text('SETTLEMENT STATUS:', 20, 56);
      doc.setFontSize(14);
      doc.setTextColor(6, 78, 59);
      doc.text('SETTLED & CLEARED', 20, 64);

      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105);
      doc.text('TRANSFER AMOUNT:', 135, 56);
      doc.setFontSize(14);
      doc.setTextColor(6, 78, 59);
      doc.text(formatRupees(record.amountINR), 135, 64);

      let y = 78;

      // Section 1: Transaction Metadata
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, y, 182, 34, 'DF');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('TRANSACTION METADATA', 20, y + 7);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);

      doc.text('Transaction ID:', 20, y + 15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(record.transactionId, 60, y + 15);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Banking UTR Ref:', 110, y + 15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text(record.utrNumber, 150, y + 15);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Payment Channel:', 20, y + 23);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${record.paymentMethod} (Simulated)`, 60, y + 23);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Settlement Timestamp:', 110, y + 23);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(record.paidAt.slice(0, 19).replace('T', ' '), 150, y + 23);

      y += 40;

      // Section 2: Beneficiary Vendor Details
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, y, 182, 38, 'DF');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('BENEFICIARY VENDOR DETAILS', 20, y + 7);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);

      doc.text('Vendor Name:', 20, y + 15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.vendorName, 60, y + 15);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('GSTIN / Tax ID:', 20, y + 22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.vendorGSTIN || 'Not Specified', 60, y + 22);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Credit Account:', 20, y + 29);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${invoice.invoiceBankDetails?.bankName || 'Demo Bank'} - ${invoice.invoiceBankDetails?.accountNumber || 'N/A'}`, 60, y + 29);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('IFSC / Branch:', 110, y + 29);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${invoice.invoiceBankDetails?.ifscCode || 'DEMO0001'} (${invoice.invoiceBankDetails?.branch || 'Main Branch'})`, 140, y + 29);

      y += 44;

      // Section 3: Invoice & PO Breakdown
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, y, 182, 40, 'DF');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('INVOICE & PURCHASE ORDER RECONCILIATION', 20, y + 7);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);

      doc.text('Tax Invoice Ref:', 20, y + 16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.invoiceNumber, 60, y + 16);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Purchase Order Ref:', 110, y + 16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.poNumber || 'N/A', 150, y + 16);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Billed Subtotal:', 20, y + 24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(formatRupees(invoice.subtotalINR), 60, y + 24);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`GST Tax (${invoice.taxGSTPercent}%):`, 110, y + 24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(formatRupees(invoice.totalAmountINR - invoice.subtotalINR), 150, y + 24);

      doc.setDrawColor(203, 213, 225);
      doc.line(20, y + 29, 190, y + 29);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(5, 150, 105);
      doc.text('Total Settled Amount (INR):', 20, y + 35);
      doc.setFontSize(11);
      doc.text(formatRupees(invoice.totalAmountINR), 150, y + 35);

      y += 46;

      // Section 4: Security & Cryptographic Attestation
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, y, 182, 18, 'DF');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text('CRYPTOGRAPHIC SECURITY ATTESTATION:', 20, y + 7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('SHA-256 Hash Validated • Autonomous Risk Engine Cleared • Immutable Audit Trail Logged', 20, y + 13);

      // Page Footer
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('VendorFlow B2B Autonomous AP System • DEMO DATA — NO REAL MONEY TRANSFER', 105, 285, { align: 'center' });

      // Save PDF
      doc.save(filename);
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      setDownloadError('Unable to generate PDF. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#121826] border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                B2B GST PAYMENT SETTLEMENT RECEIPT
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Official Autonomous AP Settlement Voucher • UTR: {record.utrNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner if PDF Generation fails */}
        {downloadError && (
          <div className="px-6 py-2.5 bg-rose-950/80 border-b border-rose-500/50 text-rose-200 text-xs font-mono font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{downloadError}</span>
          </div>
        )}

        {/* Printable Receipt Body */}
        <div className="p-6 space-y-5 bg-[#0d121f] text-slate-300 font-mono text-xs">
          
          {/* Status Watermark */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">SETTLEMENT STATUS</div>
              <div className="text-lg font-extrabold text-white">SETTLED & CLEARED</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-emerald-400">TRANSFER AMOUNT</div>
              <div className="text-xl font-bold text-emerald-400">{formatRupees(record.amountINR)}</div>
            </div>
          </div>

          {/* Key Transaction Metadata */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Transaction ID:</span>
              <span className="text-white font-bold text-[11px]">{record.transactionId}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Banking UTR Ref:</span>
              <span className="text-emerald-400 font-bold text-[11px]">{record.utrNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Payment Channel:</span>
              <span className="text-white font-bold text-[11px]">{record.paymentMethod} (Simulated)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Settlement Time:</span>
              <span className="text-slate-300 text-[11px]">{record.paidAt.slice(0, 19).replace('T', ' ')}</span>
            </div>
          </div>

          {/* Vendor Beneficiary Details */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-500 text-[10px] uppercase font-bold">BENEFICIARY VENDOR:</div>
            <div className="text-white font-bold text-sm font-sans">{invoice.vendorName}</div>
            <div className="text-slate-400 text-[11px]">GSTIN: {invoice.vendorGSTIN}</div>
            <div className="pt-2 border-t border-slate-800 text-slate-300">
              Credit Account: <span className="text-white font-bold">{invoice.invoiceBankDetails.bankName} - {invoice.invoiceBankDetails.accountNumber}</span>
            </div>
            <div className="text-slate-400">IFSC: {invoice.invoiceBankDetails.ifscCode} ({invoice.invoiceBankDetails.branch})</div>
          </div>

          {/* Invoice Summary */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Tax Invoice Ref: <strong className="text-white">{invoice.invoiceNumber}</strong></span>
              <span>PO Ref: <strong className="text-white">{invoice.poNumber}</strong></span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-2 font-bold text-white text-xs">
              <span>Billed Amount: {formatRupees(invoice.subtotalINR)}</span>
              <span>GST ({invoice.taxGSTPercent}%): {formatRupees(invoice.totalAmountINR - invoice.subtotalINR)}</span>
            </div>
          </div>

          {/* Security Signature */}
          <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CRYPTOGRAPHIC PROOF ATTESTATION ATTACHED</span>
            </div>
            <span className="font-mono text-slate-500">SHA-256 Validated</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#111827] border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              id="download-receipt-pdf-btn"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

