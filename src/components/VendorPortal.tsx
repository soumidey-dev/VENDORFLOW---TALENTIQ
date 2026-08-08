import React, { useState, useRef, useEffect } from 'react';
import { Invoice, Vendor } from '../types';
import { 
  Upload, FileText, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Download, 
  Store, Sparkles, Send, File, Image as ImageIcon, X, RefreshCw, ShieldAlert, FileSearch
} from 'lucide-react';

interface VendorPortalProps {
  vendor: Vendor;
  invoices: Invoice[];
  onUploadInvoice: (file: File | null, executionId?: string, scenarioId?: string) => void;
  onOpenReceiptModal: (invoice: Invoice) => void;
  onOpenDemoScenarios: () => void;
  isProcessing: boolean;
  currentStep?: number;
  uploadError?: string | null;
  onClearError?: () => void;
}

export const VendorPortal: React.FC<VendorPortalProps> = ({
  vendor,
  invoices,
  onUploadInvoice,
  onOpenReceiptModal,
  onOpenDemoScenarios,
  isProcessing,
  currentStep = 0,
  uploadError,
  onClearError
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-reset file selection after successful processing
  const prevProcessingRef = useRef(isProcessing);
  useEffect(() => {
    if (prevProcessingRef.current && !isProcessing && !uploadError && selectedFile) {
      setSelectedFile(null);
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(null);
      }
      setExecutionId(null);
      setValidationError(null);
    }
    prevProcessingRef.current = isProcessing;
  }, [isProcessing, uploadError, selectedFile, filePreviewUrl]);

  const vendorInvoices = invoices.filter(
    i => i.vendorId === vendor.id || i.vendorGSTIN === vendor.gstin || i.vendorName === vendor.name
  );

  const formatRupees = (val: number = 0) => `₹${val.toLocaleString('en-IN')}`;

  // Validate File Format and Size
  const validateAndSetFile = (file: File) => {
    setValidationError(null);
    if (onClearError) onClearError();

    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const fileNameLower = file.name.toLowerCase();
    const isValidExtension = fileNameLower.endsWith('.pdf') || 
                               fileNameLower.endsWith('.jpg') || 
                               fileNameLower.endsWith('.jpeg') || 
                               fileNameLower.endsWith('.png');

    // 1. File Type Validation
    if (!allowedMimeTypes.includes(file.type) && !isValidExtension) {
      setValidationError(`Unsupported file format "${file.name}". VendorFlow only accepts PDF, JPG, and PNG documents.`);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setExecutionId(null);
      return;
    }

    // 2. File Size Validation (Max 15MB)
    const MAX_SIZE_BYTES = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setValidationError(`File size exceeds 15MB limit (${sizeMB} MB). Please select a smaller invoice document.`);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setExecutionId(null);
      return;
    }

    // 3. File Integrity Check (Non-zero)
    if (file.size === 0) {
      setValidationError(`File "${file.name}" is empty or corrupted (0 bytes).`);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setExecutionId(null);
      return;
    }

    // File passed validation! Generate Workflow Execution ID
    const generatedExecId = `EXEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSelectedFile(file);
    setExecutionId(generatedExecId);

    // Create Image Preview URL if image file
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setFilePreviewUrl(objectUrl);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    setExecutionId(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      setValidationError('Please select or drag an invoice file (PDF, JPG, PNG) before submitting.');
      return;
    }
    onUploadInvoice(selectedFile, executionId || undefined);
  };

  const getProcessingStepLabel = () => {
    if (currentStep === 0) return 'Uploading...';
    if (currentStep === 1) return 'AI Analyzing...';
    if (currentStep === 2 || currentStep === 3) return 'Validating...';
    if (currentStep >= 4) return 'Risk Assessment...';
    return 'Processing Document...';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Vendor Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131B2E] to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl text-indigo-400">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white font-sans">{vendor.name}</h2>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                VERIFIED VENDOR
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              GSTIN: <span className="text-slate-200">{vendor.gstin}</span> • Email: {vendor.email}
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono">
          <div className="text-slate-400 text-[10px] uppercase font-bold mb-0.5">Registered Beneficiary Bank A/C:</div>
          <div className="text-white font-bold">{vendor.registeredBank.bankName} - {vendor.registeredBank.accountNumber}</div>
          <div className="text-slate-400 text-[10px]">IFSC: {vendor.registeredBank.ifscCode} • {vendor.registeredBank.branch}</div>
        </div>
      </div>

      {/* Upload New Invoice Area & Demo Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form Box */}
        <div className="lg:col-span-2 bg-[#121826] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" /> UPLOAD REAL INVOICE DOCUMENT
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                AI MULTIMODAL OCR
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Select or drop a real tax invoice file from your computer (PDF, JPG, or PNG). Gemini AI will extract actual line items, PO references, and bank details for real-time audit.
            </p>

            {/* Validation or API Error Alert */}
            {(validationError || uploadError) && (
              <div className="mb-4 p-3 bg-rose-950/50 border border-rose-500/50 rounded-xl flex items-start justify-between text-xs text-rose-300 font-mono animate-fade-in">
                <div className="flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-200">Upload Validation Error:</strong>
                    <span>{validationError || uploadError}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setValidationError(null);
                    if (onClearError) onClearError();
                  }}
                  className="text-rose-400 hover:text-white p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {!selectedFile ? (
                /* Drag & Drop Area */
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative group ${
                    isDragging 
                      ? 'border-indigo-400 bg-indigo-500/10 scale-[0.99]' 
                      : 'border-slate-700 hover:border-indigo-500 bg-slate-900/50 hover:bg-slate-900/80'
                  }`}
                  id="vendor-file-dropzone"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    id="vendor-file-input"
                  />
                  <Upload className="w-10 h-10 mx-auto text-indigo-400 group-hover:scale-110 transition-transform mb-3" />
                  <p className="text-xs font-bold text-slate-200">
                    Click to select file, or drag & drop invoice document here
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Accepts PDF, JPG, PNG (Max 15MB)
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg text-[10px] text-slate-300 font-mono border border-slate-700">
                    <FileSearch className="w-3 h-3 text-indigo-400" />
                    <span>Real document text & vision extraction via Gemini AI</span>
                  </div>
                </div>
              ) : (
                /* Selected File Confirmation & Inspection Card */
                <div className="p-4 bg-slate-900 border border-indigo-500/40 rounded-xl space-y-3 font-mono text-xs animate-fade-in shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      {selectedFile.type.startsWith('image/') ? (
                        <ImageIcon className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-indigo-400" />
                      )}
                      <div>
                        <span className="text-white font-bold block truncate max-w-xs">{selectedFile.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearSelectedFile}
                      className="p-1 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Execution ID:</span>
                      <span className="text-indigo-300 font-bold">{executionId}</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">File Integrity:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Validated & Ready
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Preview for Images */}
                  {filePreviewUrl && (
                    <div className="mt-2 p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-center max-h-32 overflow-hidden">
                      <img 
                        src={filePreviewUrl} 
                        alt="Invoice Preview" 
                        className="max-h-28 object-contain rounded border border-slate-700" 
                      />
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Target Pipeline: <strong className="text-white">VendorFlow Autonomous Audit</strong>
                    </span>
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFormSubmit(e);
                      }}
                      disabled={isProcessing}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                      id="vendor-submit-btn"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-200" />
                          <span>{getProcessingStepLabel()}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Confirm & Submit Real Document</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              {!selectedFile && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Demo Scenarios Available:
                  </div>

                  <button
                    type="button"
                    onClick={onOpenDemoScenarios}
                    className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    id="vendor-scenarios-btn"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Select Preset Demo Scenario</span>
                  </button>
                </div>
              )}

            </form>
          </div>

          <div className="mt-4 p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Security Guarantee: Documents processed in server-side sandboxed container.</span>
            <span className="text-emerald-400 font-bold">DEMO MODE</span>
          </div>
        </div>

        {/* Info Card: How Autonomous Payout Works */}
        <div className="bg-[#121826] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> AUTONOMOUS PAYOUT POLICY
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Invoices matching active Purchase Order with ≤5% variance auto-clear in ~2 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Bank details must match registered profile to prevent payment redirection fraud.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Invoices with missing PO numbers or mismatched bank details are escalated to Finance Admin review.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>All missing or unreadable fields are flagged as "Not detected" without inventing data.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-mono mt-4">
            ⚠️ Bank details can only be changed via formal verified Finance Admin request to prevent payment hijacking.
          </div>
        </div>

      </div>

      {/* Submitted Invoices & Live Timeline Tracking */}
      <div className="bg-[#121826] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" /> YOUR SUBMITTED INVOICES & LIVE TIMELINE
        </h3>

        {vendorInvoices.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-mono">
            No invoices submitted yet for this vendor profile. Upload a real invoice document above or select a preset demo scenario.
          </div>
        ) : (
          <div className="space-y-4">
            {vendorInvoices.map((inv) => (
              <div key={inv.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
                
                {/* Invoice Brief */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{inv.invoiceNumber}</span>
                    <span className="text-xs text-slate-400">PO Ref: {inv.poNumber}</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-bold mt-1">
                    {formatRupees(inv.totalAmountINR)} • Date: {inv.invoiceDate}
                  </div>
                  {inv.fileName && (
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Source Document: {inv.fileName}
                    </div>
                  )}
                </div>

                {/* Status Timeline */}
                <div className="flex items-center space-x-2 text-xs">
                  {inv.status === 'PAID' ? (
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Payout Settled
                      </span>
                      <button
                        onClick={() => onOpenReceiptModal(inv)}
                        className="px-3 py-1 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 rounded-lg text-xs transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Receipt
                      </button>
                    </div>
                  ) : inv.status === 'AUTO_APPROVED' ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Auto-Approved (Payout Pending)
                    </span>
                  ) : inv.status === 'BLOCKED_HIGH_RISK' ? (
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Blocked (High Risk / Fraud)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Under Finance Review
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
