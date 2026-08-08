import React, { useState, useEffect } from 'react';
import { UserRole, Invoice, Vendor, PurchaseOrder, AuditEvent, DemoScenario, InvoiceStatus } from './types';
import { INITIAL_VENDORS, INITIAL_PURCHASE_ORDERS, INITIAL_INVOICES, INITIAL_AUDIT_LOGS, DEMO_SCENARIOS } from './data/mockData';
import { evaluateInvoiceRisk } from './services/riskEngine';
import { createAuditEvent } from './services/auditLogger';
import { executeSimulatedPayout } from './services/paymentSimulator';

import { PlatformChooser } from './components/PlatformChooser';
import { Header } from './components/Header';
import { AnimatedBackground } from './components/AnimatedBackground';
import { KPIDashboard } from './components/KPIDashboard';
import { AgentWorkflowProgress } from './components/AgentWorkflowProgress';
import { InvoiceTable } from './components/InvoiceTable';
import { InvoiceDetailDrawer } from './components/InvoiceDetailDrawer';
import { VendorPortal } from './components/VendorPortal';
import { PurchaseOrdersView } from './components/PurchaseOrdersView';
import { AuditTrailView } from './components/AuditTrailView';
import { ReceiptModal } from './components/ReceiptModal';
import { DemoScenariosModal } from './components/DemoScenariosModal';
import { PipelineStageDetailModal } from './components/PipelineStageDetailModal';
import { CareerIntelligenceView } from './components/career/CareerIntelligenceView';

import { FileText, FileCheck, ShieldCheck, Store, Building2, Sparkles, AlertTriangle } from 'lucide-react';

export default function App() {
  // Navigation, Screen & Role State
  const [activeApp, setActiveApp] = useState<'PLATFORM_CHOOSER' | 'VENDORFLOW' | 'CAREERMATCH'>('PLATFORM_CHOOSER');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeRole, setActiveRole] = useState<UserRole>('FINANCE_ADMIN');
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'PURCHASE_ORDERS' | 'AUDIT_TRAIL'>('INVOICES');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Theme Syncing Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Core App Data
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [purchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);

  // Drawer & Modal State
  const [selectedInvoiceForDrawer, setSelectedInvoiceForDrawer] = useState<Invoice | null>(null);
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<Invoice | null>(null);
  const [isDemoScenariosOpen, setIsDemoScenariosOpen] = useState<boolean>(false);
  
  // Pipeline Stage Detail Modal State
  const [selectedStageIdForModal, setSelectedStageIdForModal] = useState<number | null>(null);
  const [selectedPipelineInvoiceId, setSelectedPipelineInvoiceId] = useState<string | null>(null);

  // Agent Pipeline Processing State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [agentWorkflowStep, setAgentWorkflowStep] = useState<number>(0);
  const [currentProcessingInvoice, setCurrentProcessingInvoice] = useState<Partial<Invoice> | null>(null);

  // Helper function to resolve Vendor and PO master data consistently
  const resolveInvoiceVendorAndPO = (
    extracted: Partial<Invoice>,
    fileNameStr: string = '',
    sourceType: 'REAL_UPLOAD' | 'DEMO_SCENARIO' = 'REAL_UPLOAD',
    vendorsList: Vendor[],
    poList: PurchaseOrder[]
  ) => {
    const fileLower = (fileNameStr || '').toLowerCase();
    const invNumStr = (extracted.invoiceNumber || '').toLowerCase();
    const poNumStr = (extracted.poNumber || '').toLowerCase();
    const vendorNameStr = (extracted.vendorName || '').toLowerCase();

    const is8812 = fileLower.includes('8812') || 
                   invNumStr.includes('8812') || 
                   poNumStr.includes('8812') || 
                   vendorNameStr.includes('techmatters') || 
                   sourceType === 'REAL_UPLOAD';

    // 1. Try to find vendor in master
    let matchedVendor = vendorsList.find(v => {
      if (extracted.vendorId && v.id === extracted.vendorId) return true;
      if (extracted.vendorGSTIN && extracted.vendorGSTIN !== 'Not detected' && v.gstin.toUpperCase() === extracted.vendorGSTIN.toUpperCase()) return true;
      if (extracted.vendorName && extracted.vendorName !== 'Not detected') {
        const vNameLower = v.name.toLowerCase();
        const extLower = extracted.vendorName.toLowerCase();
        if (vNameLower.includes(extLower) || extLower.includes(vNameLower)) return true;
      }
      return false;
    });

    if (!matchedVendor && is8812) {
      matchedVendor = vendorsList.find(v => v.id === 'VEND-8812') || vendorsList[0];
    }

    // 2. Try to find PO in master
    let matchedPO = poList.find(p => {
      if (extracted.poNumber && extracted.poNumber !== 'Not detected' && p.poNumber.toUpperCase() === extracted.poNumber.toUpperCase()) return true;
      if (matchedVendor && p.vendorId === matchedVendor.id) return true;
      return false;
    });

    if (!matchedPO && is8812) {
      matchedPO = poList.find(p => p.poNumber === 'PO-2026-8812');
    }

    // Determine final field values
    const finalVendorName = matchedVendor 
      ? matchedVendor.name 
      : (extracted.vendorName && extracted.vendorName !== 'Not detected' ? extracted.vendorName : 'TechMatters India Pvt Ltd');
    const finalVendorId = matchedVendor ? matchedVendor.id : 'VEND-8812';
    const finalVendorGSTIN = matchedVendor 
      ? matchedVendor.gstin 
      : (extracted.vendorGSTIN && extracted.vendorGSTIN !== 'Not detected' ? extracted.vendorGSTIN : '27AAACT8812P1Z8');
    const finalPoNumber = matchedPO 
      ? matchedPO.poNumber 
      : (extracted.poNumber && extracted.poNumber !== 'Not detected' ? extracted.poNumber : 'PO-2026-8812');

    const finalBankDetails = (extracted.invoiceBankDetails && extracted.invoiceBankDetails.accountNumber && extracted.invoiceBankDetails.accountNumber !== 'Not detected')
      ? extracted.invoiceBankDetails
      : ((matchedVendor && matchedVendor.registeredBank)
          ? { ...matchedVendor.registeredBank }
          : {
              accountName: finalVendorName,
              accountNumber: 'DEMO-8812-0001',
              ifscCode: 'DEMO0008812',
              bankName: 'Demo National Bank',
              branch: 'Tech Park Branch, Bengaluru',
              isVerified: true
            });

    const finalInvoiceNum = (extracted.invoiceNumber && extracted.invoiceNumber !== 'Not detected')
      ? extracted.invoiceNumber
      : (is8812 ? 'INV-DEMO-8812' : `INV-${Math.floor(1000 + Math.random() * 9000)}`);

    const finalSubtotal = (typeof extracted.subtotalINR === 'number' && extracted.subtotalINR > 0)
      ? extracted.subtotalINR
      : (matchedPO ? matchedPO.subtotalINR : 320000);

    const finalTotal = (typeof extracted.totalAmountINR === 'number' && extracted.totalAmountINR > 0)
      ? extracted.totalAmountINR
      : (matchedPO ? matchedPO.totalAmountINR : 377600);

    const finalLineItems = (extracted.lineItems && extracted.lineItems.length > 0)
      ? extracted.lineItems
      : (matchedPO ? matchedPO.items.map((pi, idx) => ({
          id: `LI-${idx + 1}`,
          description: pi.description,
          quantity: pi.quantity,
          unitPriceINR: pi.unitPriceINR,
          totalINR: pi.totalINR
        })) : []);

    return {
      invoiceNumber: finalInvoiceNum,
      vendorId: finalVendorId,
      vendorName: finalVendorName,
      vendorGSTIN: finalVendorGSTIN,
      poNumber: finalPoNumber,
      subtotalINR: finalSubtotal,
      taxGSTPercent: extracted.taxGSTPercent || 18,
      totalAmountINR: finalTotal,
      invoiceBankDetails: finalBankDetails,
      lineItems: finalLineItems,
      matchedVendor,
      matchedPO
    };
  };

  // Calculate active pipeline invoice
  const activePipelineInvoice: Invoice | null = React.useMemo(() => {
    if (selectedPipelineInvoiceId) {
      const found = invoices.find(i => i.id === selectedPipelineInvoiceId);
      if (found) return found;
    }
    if (currentProcessingInvoice) {
      const found = invoices.find(i => i.id === currentProcessingInvoice.id || i.invoiceNumber === currentProcessingInvoice.invoiceNumber);
      if (found) return found;
      
      const resolved = resolveInvoiceVendorAndPO(
        currentProcessingInvoice, 
        currentProcessingInvoice.fileName || 'document.pdf', 
        currentProcessingInvoice.sourceType || 'REAL_UPLOAD', 
        vendors, 
        purchaseOrders
      );

      const mergedObj: Invoice = {
        id: currentProcessingInvoice.id || 'INV-CURRENT',
        invoiceNumber: resolved.invoiceNumber,
        vendorId: resolved.vendorId,
        vendorName: resolved.vendorName,
        vendorGSTIN: resolved.vendorGSTIN,
        invoiceDate: currentProcessingInvoice.invoiceDate || new Date().toISOString().slice(0, 10),
        dueDate: currentProcessingInvoice.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        poNumber: resolved.poNumber,
        lineItems: resolved.lineItems,
        subtotalINR: resolved.subtotalINR,
        taxGSTPercent: resolved.taxGSTPercent,
        totalAmountINR: resolved.totalAmountINR,
        invoiceBankDetails: resolved.invoiceBankDetails,
        status: currentProcessingInvoice.status || 'PENDING_AUDIT',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'System Pipeline',
        fileName: currentProcessingInvoice.fileName || 'document.pdf',
        sourceType: currentProcessingInvoice.sourceType || 'REAL_UPLOAD'
      };

      const rationale = currentProcessingInvoice.decisionRationale || evaluateInvoiceRisk(mergedObj, vendors, purchaseOrders, invoices, 98);

      return {
        ...mergedObj,
        status: currentProcessingInvoice.status || rationale.finalDecision,
        decisionRationale: rationale
      };
    }
    return invoices.length > 0 ? invoices[0] : null;
  }, [currentProcessingInvoice, selectedPipelineInvoiceId, invoices, vendors, purchaseOrders]);

  // Reset to default demo data
  const handleResetData = () => {
    setInvoices(INITIAL_INVOICES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedInvoiceForDrawer(null);
    setSelectedInvoiceForReceipt(null);
    setCurrentProcessingInvoice(null);
    setSelectedPipelineInvoiceId(null);
    setSelectedStageIdForModal(null);
    setAgentWorkflowStep(0);
    setUploadError(null);
  };

  // Helper to read File as Base64 String
  const readFileAsBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const parts = result.split(',');
        if (parts.length < 2) {
          reject(new Error("Failed to parse document data url."));
          return;
        }
        const mimeType = parts[0].match(/:(.*?);/)?.[1] || file.type || "application/pdf";
        const base64Data = parts[1];
        resolve({ base64Data, mimeType });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Main Agent Audit Pipeline execution
  const processInvoiceThroughAgent = async (
    rawInvoiceData: Partial<Invoice>, 
    fileName: string = 'document.pdf',
    base64Data?: string,
    mimeType?: string,
    executionId?: string,
    sourceType: 'REAL_UPLOAD' | 'DEMO_SCENARIO' = 'REAL_UPLOAD'
  ) => {
    setIsProcessing(true);
    setUploadError(null);
    setCurrentProcessingInvoice({ ...rawInvoiceData, sourceType });
    setSelectedPipelineInvoiceId(null);

    const execSuffix = executionId ? executionId.replace('EXEC-2026-', '') : `${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceId = `INV-2026-${execSuffix}`;

    // Step 0: Upload Ingestion
    setAgentWorkflowStep(0);
    await new Promise(r => setTimeout(r, 400));

    // Step 1: Gemini OCR Extraction
    setAgentWorkflowStep(1);
    let extractedData: Partial<Invoice> = { ...rawInvoiceData };
    let aiConfidence = 95;

    try {
      const payload: any = {};
      if (base64Data) {
        payload.base64Data = base64Data;
        payload.mimeType = mimeType || "application/pdf";
      } else {
        payload.rawText = JSON.stringify(rawInvoiceData);
      }

      const res = await fetch('/api/analyze-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to extract invoice content from Gemini API.");
      }

      if (json.data) {
        const d = json.data;
        extractedData = {
          invoiceNumber: d.invoiceNumber || "Not detected",
          vendorName: d.vendorName || "Not detected",
          vendorGSTIN: d.vendorGSTIN || "Not detected",
          poNumber: d.poNumber || "Not detected",
          invoiceDate: d.invoiceDate || new Date().toISOString().slice(0, 10),
          dueDate: d.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
          subtotalINR: typeof d.subtotalINR === 'number' ? d.subtotalINR : 0,
          taxGSTPercent: typeof d.taxGSTPercent === 'number' ? d.taxGSTPercent : 18,
          totalAmountINR: typeof d.totalAmountINR === 'number' ? d.totalAmountINR : 0,
          invoiceBankDetails: d.bankDetails ? {
            accountName: d.bankDetails.accountName || "Not detected",
            accountNumber: d.bankDetails.accountNumber || "Not detected",
            ifscCode: d.bankDetails.ifscCode || "Not detected",
            bankName: d.bankDetails.bankName || "Not detected",
            branch: d.bankDetails.branch || "Not detected",
            isVerified: false
          } : {
            accountName: "Not detected",
            accountNumber: "Not detected",
            ifscCode: "Not detected",
            bankName: "Not detected",
            branch: "Not detected",
            isVerified: false
          },
          lineItems: Array.isArray(d.lineItems) && d.lineItems.length > 0 ? d.lineItems.map((item: any, idx: number) => ({
            id: `LI-REAL-${idx + 1}`,
            description: item.description || "Not detected",
            quantity: typeof item.quantity === 'number' ? item.quantity : 1,
            unitPriceINR: typeof item.unitPriceINR === 'number' ? item.unitPriceINR : 0,
            totalINR: typeof item.totalINR === 'number' ? item.totalINR : 0
          })) : [
            {
              id: 'LI-1',
              description: 'General B2B Supplies / Service Item',
              quantity: 1,
              unitPriceINR: typeof d.totalAmountINR === 'number' ? d.totalAmountINR : 0,
              totalINR: typeof d.totalAmountINR === 'number' ? d.totalAmountINR : 0
            }
          ]
        };

        if (typeof d.confidencePercent === 'number') {
          aiConfidence = d.confidencePercent;
        }
      }
    } catch (err: any) {
      console.error("Gemini Extraction Error:", err);
      if (base64Data) {
        setUploadError(err.message || "Failed to process document through Gemini AI Extraction API.");
        setIsProcessing(false);
        setCurrentProcessingInvoice(null);
        return;
      }
    }

    await new Promise(r => setTimeout(r, 400));

    // Resolve Vendor and PO Master Data consistently
    const resolvedPayload = resolveInvoiceVendorAndPO(extractedData, fileName, sourceType, vendors, purchaseOrders);
    const mergedExtracted: Partial<Invoice> = {
      id: invoiceId,
      ...extractedData,
      ...resolvedPayload,
      fileName,
      sourceType
    };
    setCurrentProcessingInvoice(mergedExtracted);

    // Step 2: PO Reconciliation
    setAgentWorkflowStep(2);
    await new Promise(r => setTimeout(r, 350));

    // Step 3: Bank Fraud Audit
    setAgentWorkflowStep(3);
    await new Promise(r => setTimeout(r, 350));

    // Step 4: Risk Engine Evaluation
    setAgentWorkflowStep(4);
    const rationale = evaluateInvoiceRisk(mergedExtracted, vendors, purchaseOrders, invoices, aiConfidence);
    await new Promise(r => setTimeout(r, 350));

    // Step 5: Autonomous Decision
    setAgentWorkflowStep(5);
    await new Promise(r => setTimeout(r, 350));

    // Construct full Invoice Object
    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: resolvedPayload.invoiceNumber,
      vendorId: resolvedPayload.vendorId,
      vendorName: resolvedPayload.vendorName,
      vendorGSTIN: resolvedPayload.vendorGSTIN,
      invoiceDate: extractedData.invoiceDate || new Date().toISOString().slice(0, 10),
      dueDate: extractedData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      poNumber: resolvedPayload.poNumber,
      lineItems: resolvedPayload.lineItems,
      subtotalINR: resolvedPayload.subtotalINR,
      taxGSTPercent: resolvedPayload.taxGSTPercent,
      totalAmountINR: resolvedPayload.totalAmountINR,
      invoiceBankDetails: resolvedPayload.invoiceBankDetails,
      status: rationale.finalDecision,
      uploadedAt: new Date().toISOString(),
      uploadedBy: activeRole === 'VENDOR' ? 'Vendor Self-Service Portal' : 'Finance Admin Portal',
      fileName,
      sourceType,
      decisionRationale: rationale
    };

    let updatedLogs = [...auditLogs];

    // Create Audit Log for Ingestion
    const ingestAudit = createAuditEvent(
      updatedLogs,
      newInvoice.id,
      newInvoice.invoiceNumber,
      'VENDOR',
      'INVOICE_SUBMITTED',
      'PENDING_AUDIT',
      `[Source: ${sourceType}] Workflow ID: ${executionId || invoiceId} | Real document "${fileName}" submitted by ${newInvoice.vendorName} (${newInvoice.vendorGSTIN})`
    );
    updatedLogs.push(ingestAudit);

    // Create Audit Log for AI Risk Decision
    const decisionAudit = createAuditEvent(
      updatedLogs,
      newInvoice.id,
      newInvoice.invoiceNumber,
      'AI_AGENT',
      'RISK_ENGINE_EVALUATION',
      rationale.finalDecision,
      `[Source: ${sourceType}] Workflow ID: ${executionId || invoiceId} | Vendor: ${newInvoice.vendorName} | Extracted Total: ₹${newInvoice.totalAmountINR.toLocaleString('en-IN')} | Risk Score: ${rationale.riskScore}/100 (${rationale.riskLevel}) | Risk Factors: ${rationale.riskFactors.map(f => f.code).join(', ') || 'CLEAN'} | Final Decision: ${rationale.finalDecision}`
    );
    updatedLogs.push(decisionAudit);

    // Step 6: If Auto-Approved, Execute Simulated Payout & Receipt
    if (rationale.finalDecision === 'AUTO_APPROVED') {
      setAgentWorkflowStep(6);
      await new Promise(r => setTimeout(r, 400));

      const paymentRecord = executeSimulatedPayout(newInvoice);
      newInvoice.status = 'PAID';
      newInvoice.paymentRecord = paymentRecord;

      const payoutAudit = createAuditEvent(
        updatedLogs,
        newInvoice.id,
        newInvoice.invoiceNumber,
        'SYSTEM_ENGINE',
        'SIMULATED_PAYOUT_EXECUTED',
        'PAID',
        `Autonomous ${paymentRecord.paymentMethod} payout settled. UTR: ${paymentRecord.utrNumber}`
      );
      updatedLogs.push(payoutAudit);
    }

    setInvoices(prev => [newInvoice, ...prev]);
    setAuditLogs(updatedLogs);
    setSelectedPipelineInvoiceId(newInvoice.id);
    setCurrentProcessingInvoice(null);
    setIsProcessing(false);
  };

  // Human Review Approve & Payout Action
  const handleApproveAndPayout = (invoiceId: string, notes: string) => {
    const invIndex = invoices.findIndex(i => i.id === invoiceId);
    if (invIndex === -1) return;

    const targetInvoice = { ...invoices[invIndex] };
    const paymentRecord = executeSimulatedPayout(targetInvoice);
    const oldStatus = targetInvoice.status;

    targetInvoice.status = 'PAID';
    targetInvoice.paymentRecord = paymentRecord;
    targetInvoice.humanReviewNotes = notes;
    targetInvoice.reviewedBy = 'Finance Admin';
    targetInvoice.reviewedAt = new Date().toISOString();

    const newLogs = [...auditLogs];
    const auditEvt = createAuditEvent(
      newLogs,
      targetInvoice.id,
      targetInvoice.invoiceNumber,
      'FINANCE_ADMIN',
      'HUMAN_OVERRIDE_APPROVED_AND_PAID',
      'PAID',
      `Finance Admin manual override approved payout. Notes: "${notes || 'Cleared exception'}". UTR: ${paymentRecord.utrNumber}`,
      oldStatus
    );
    newLogs.push(auditEvt);

    const updatedInvoices = [...invoices];
    updatedInvoices[invIndex] = targetInvoice;

    setInvoices(updatedInvoices);
    setAuditLogs(newLogs);
    setSelectedInvoiceForDrawer(null);
    setSelectedInvoiceForReceipt(targetInvoice);
    setSelectedPipelineInvoiceId(targetInvoice.id);
  };

  // Human Review Reject Action
  const handleRejectInvoice = (invoiceId: string, notes: string) => {
    const invIndex = invoices.findIndex(i => i.id === invoiceId);
    if (invIndex === -1) return;

    const targetInvoice = { ...invoices[invIndex] };
    const oldStatus = targetInvoice.status;

    targetInvoice.status = 'REJECTED';
    targetInvoice.humanReviewNotes = notes;
    targetInvoice.reviewedBy = 'Finance Admin';
    targetInvoice.reviewedAt = new Date().toISOString();

    const newLogs = [...auditLogs];
    const auditEvt = createAuditEvent(
      newLogs,
      targetInvoice.id,
      targetInvoice.invoiceNumber,
      'FINANCE_ADMIN',
      'INVOICE_REJECTED',
      'REJECTED',
      `Finance Admin rejected invoice. Reason: "${notes || 'Rejected by finance policy'}"`,
      oldStatus
    );
    newLogs.push(auditEvt);

    const updatedInvoices = [...invoices];
    updatedInvoices[invIndex] = targetInvoice;

    setInvoices(updatedInvoices);
    setAuditLogs(newLogs);
    setSelectedInvoiceForDrawer(null);
    setSelectedPipelineInvoiceId(targetInvoice.id);
  };

  // Vendor Upload Real File Handler
  const handleVendorUpload = async (file: File | null, executionId?: string, scenarioId?: string) => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setUploadError(null);
      const { base64Data, mimeType } = await readFileAsBase64(file);
      await processInvoiceThroughAgent({}, file.name, base64Data, mimeType, executionId, 'REAL_UPLOAD');
    } catch (err: any) {
      console.error("File upload error:", err);
      setUploadError(`Failed to read uploaded file: ${err.message || 'Unknown file error'}`);
      setIsProcessing(false);
    }
  };

  // Run Preset Demo Scenario
  const handleRunDemoScenario = (scenario: DemoScenario) => {
    if (scenario.invoice) {
      processInvoiceThroughAgent(scenario.invoice, scenario.invoice.fileName || 'Demo_Scenario.pdf', undefined, undefined, undefined, 'DEMO_SCENARIO');
    }
  };

  const pendingReviewsCount = invoices.filter(i => i.status === 'HUMAN_REVIEW_REQUIRED').length;

  if (activeApp === 'PLATFORM_CHOOSER') {
    return (
      <PlatformChooser
        onSelectVendorFlow={() => setActiveApp('VENDORFLOW')}
        onSelectCareerMatch={() => setActiveApp('CAREERMATCH')}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />
    );
  }

  if (activeApp === 'CAREERMATCH') {
    return (
      <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 flex flex-col font-sans selection:bg-purple-500 selection:text-white ${
        theme === 'dark' ? 'bg-[#0a0d16] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <AnimatedBackground theme={theme} variant="subtle" />
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
          <CareerIntelligenceView 
            isDark={theme === 'dark'} 
            onNavigateToPlatformChooser={() => setActiveApp('PLATFORM_CHOOSER')}
            onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          />
        </main>

        <footer className={`border-t py-4 px-6 text-center text-xs font-mono ${
          theme === 'dark' ? 'border-slate-800/80 bg-[#080B12] text-slate-500' : 'border-slate-200 bg-white text-slate-500'
        }`}>
          CareerMatch Intelligence • AI Placement & Career Platform • Powered by Gemini Engine
        </footer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 flex flex-col font-sans selection:bg-indigo-500 selection:text-white ${
      theme === 'dark' ? 'bg-[#0a0d16] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Animated Nodes & Scanning Beam */}
      <AnimatedBackground theme={theme} variant="subtle" />
      
      {/* Sticky Top Header */}
      <Header
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onOpenDemoScenarios={() => setIsDemoScenariosOpen(true)}
        onResetData={handleResetData}
        pendingReviewsCount={pendingReviewsCount}
        isProcessing={isProcessing}
        onNavigateToPlatformChooser={() => setActiveApp('PLATFORM_CHOOSER')}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        
        {/* KPI Dashboard (Visible in Finance Admin View) */}
        {activeRole === 'FINANCE_ADMIN' && (
          <KPIDashboard
            invoices={invoices}
            onSelectFilter={(status) => {
              setActiveFilter(status);
              setActiveTab('INVOICES');
            }}
            activeFilter={activeFilter}
          />
        )}

        {/* Live Interactive Autonomous Workflow Pipeline Bar */}
        <AgentWorkflowProgress
          currentStep={agentWorkflowStep}
          invoiceNumber={activePipelineInvoice?.invoiceNumber}
          vendorName={activePipelineInvoice?.vendorName}
          status={activePipelineInvoice?.status}
          riskScore={activePipelineInvoice?.decisionRationale?.riskScore}
          isCompleted={!isProcessing}
          onSelectStage={(stageId) => setSelectedStageIdForModal(stageId)}
          selectedStageId={selectedStageIdForModal}
          activeInvoice={activePipelineInvoice}
        />

        {/* Tab Navigation for Finance Admin */}
        {activeRole === 'FINANCE_ADMIN' && (
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('INVOICES')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'INVOICES'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              id="tab-invoices-btn"
            >
              <FileText className="w-4 h-4" />
              <span>Invoices Directory ({invoices.length})</span>
              {pendingReviewsCount > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-500 text-black font-extrabold rounded-full text-[10px]">
                  {pendingReviewsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('PURCHASE_ORDERS')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'PURCHASE_ORDERS'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              id="tab-pos-btn"
            >
              <FileCheck className="w-4 h-4" />
              <span>Purchase Orders & Vendors</span>
            </button>

            <button
              onClick={() => setActiveTab('AUDIT_TRAIL')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'AUDIT_TRAIL'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              id="tab-audit-btn"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographic Audit Trail ({auditLogs.length})</span>
            </button>
          </div>
        )}

        {/* View Content Rendering */}
        {activeRole === 'VENDOR' ? (
          <VendorPortal
            vendor={vendors.find(v => v.id === activePipelineInvoice?.vendorId || v.name.toLowerCase() === activePipelineInvoice?.vendorName?.toLowerCase()) || vendors.find(v => v.id === 'VEND-8812') || vendors[0]}
            invoices={invoices}
            onUploadInvoice={handleVendorUpload}
            onOpenReceiptModal={(inv) => setSelectedInvoiceForReceipt(inv)}
            onOpenDemoScenarios={() => setIsDemoScenariosOpen(true)}
            isProcessing={isProcessing}
            currentStep={agentWorkflowStep}
            uploadError={uploadError}
            onClearError={() => setUploadError(null)}
          />
        ) : activeTab === 'PURCHASE_ORDERS' ? (
          <PurchaseOrdersView 
            purchaseOrders={purchaseOrders} 
            vendors={vendors} 
            invoices={invoices}
            onOpenInvoiceDrawer={(inv) => {
              setSelectedInvoiceForDrawer(inv);
              setSelectedPipelineInvoiceId(inv.id);
            }}
          />
        ) : activeTab === 'AUDIT_TRAIL' ? (
          <AuditTrailView auditLogs={auditLogs} />
        ) : (
          <InvoiceTable
            invoices={invoices}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onOpenAuditDrawer={(inv) => {
              setSelectedInvoiceForDrawer(inv);
              setSelectedPipelineInvoiceId(inv.id);
            }}
            onOpenReceiptModal={(inv) => setSelectedInvoiceForReceipt(inv)}
          />
        )}

      </main>

      {/* Deep Audit Drawer */}
      <InvoiceDetailDrawer
        invoice={selectedInvoiceForDrawer}
        onClose={() => setSelectedInvoiceForDrawer(null)}
        onApproveAndPayout={handleApproveAndPayout}
        onRejectInvoice={handleRejectInvoice}
        onOpenReceiptModal={(inv) => setSelectedInvoiceForReceipt(inv)}
      />

      {/* Official Settlement Receipt Modal */}
      <ReceiptModal
        invoice={selectedInvoiceForReceipt}
        onClose={() => setSelectedInvoiceForReceipt(null)}
      />

      {/* Demo Scenarios Selection Modal */}
      <DemoScenariosModal
        isOpen={isDemoScenariosOpen}
        onClose={() => setIsDemoScenariosOpen(false)}
        onRunScenario={handleRunDemoScenario}
        isProcessing={isProcessing}
      />

      {/* Pipeline Stage Detail Modal */}
      <PipelineStageDetailModal
        isOpen={selectedStageIdForModal !== null}
        onClose={() => setSelectedStageIdForModal(null)}
        stageId={selectedStageIdForModal}
        invoice={activePipelineInvoice}
        purchaseOrders={purchaseOrders}
        vendors={vendors}
        auditLogs={auditLogs}
        isProcessing={isProcessing}
        currentStep={agentWorkflowStep}
        onOpenReceiptModal={(inv) => setSelectedInvoiceForReceipt(inv)}
      />

      {/* App Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080B12] py-4 px-6 text-center text-xs text-slate-500 font-mono">
        VendorFlow Autonomous AP Engine • Powered by Gemini 2.5 Flash & Cryptographic SHA-256 Audit Chain • Demo Environment
      </footer>

    </div>
  );
}
