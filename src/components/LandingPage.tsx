import React, { useState } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  Sun, 
  Moon, 
  Eye, 
  ChevronRight,
  Database,
  Search,
  Scale,
  Menu,
  X,
  Sliders,
  Check,
  FileCheck2,
  ArrowDown
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onRunScenarioFromLanding: (scenarioId: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onRunScenarioFromLanding,
  theme,
  onToggleTheme
}) => {
  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 font-sans selection:bg-emerald-500 selection:text-white ${
      isDark ? 'bg-[#080B12] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Animated AI Audit Ambient Background */}
      <AnimatedBackground theme={theme} variant="hero" />
      
      {/* LANDING NAVIGATION HEADER */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 px-4 lg:px-8 py-3.5 ${
        isDark ? 'bg-[#0B0F19]/90 border-slate-800/80' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`p-2.5 rounded-xl border flex items-center justify-center shadow-md ${
              isDark 
                ? 'bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border-indigo-500/30 text-emerald-400' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <Bot className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xl font-extrabold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Vendor<span className="text-emerald-500">Flow</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-full">
                  AUTONOMOUS AP
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium font-mono">
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className={`transition-colors hover:text-emerald-500 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('decision-states')} 
              className={`transition-colors hover:text-emerald-500 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              Decision Matrix
            </button>
            <button 
              onClick={() => scrollToSection('ai-architecture')} 
              className={`transition-colors hover:text-emerald-500 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              AI & Rules Engine
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className={`transition-colors hover:text-emerald-500 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              Capabilities
            </button>
            <button 
              onClick={() => scrollToSection('security')} 
              className={`transition-colors hover:text-emerald-500 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              Security
            </button>
          </div>

          {/* Header Controls (NO "Enter VendorFlow" button in header per mandate) */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Switcher Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900/80 border-slate-700/80 text-amber-400 hover:bg-slate-800' 
                  : 'bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
              id="landing-theme-toggle-btn"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className={`md:hidden pt-4 pb-2 border-t mt-3 flex flex-col space-y-3 font-mono text-sm ${
            isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
          }`}>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left px-2 py-1.5 hover:text-emerald-500">How It Works</button>
            <button onClick={() => scrollToSection('decision-states')} className="text-left px-2 py-1.5 hover:text-emerald-500">Decision Matrix</button>
            <button onClick={() => scrollToSection('ai-architecture')} className="text-left px-2 py-1.5 hover:text-emerald-500">AI & Rules Engine</button>
            <button onClick={() => scrollToSection('features')} className="text-left px-2 py-1.5 hover:text-emerald-500">Capabilities</button>
            <button onClick={() => scrollToSection('security')} className="text-left px-2 py-1.5 hover:text-emerald-500">Security</button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 lg:px-8">
        
        {/* Subtle Background Accent Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Badge */}
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border ${
              isDark 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>AI-POWERED ACCOUNTS PAYABLE AUTOMATION</span>
            </div>

            {/* Main Heading per exact spec */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              From Invoice<br />
              to Decision.<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">Automatically.</span>
            </h1>

            {/* Supporting Text per exact spec */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              VendorFlow transforms invoices into verified, risk-scored decisions — automating routine payments and escalating suspicious cases to finance teams.
            </p>

            {/* CTA Buttons - Primary: "Get Started →" */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onEnterApp}
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold font-mono tracking-wide shadow-xl shadow-emerald-950/40 flex items-center space-x-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                id="landing-hero-get-started-btn"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className={`px-6 py-4 rounded-xl text-sm font-semibold border transition-all flex items-center space-x-2 cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
                }`}
              >
                <Eye className="w-4 h-4 text-emerald-500" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Metrics Bar */}
            <div className={`grid grid-cols-3 gap-4 pt-6 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
              <div>
                <p className="text-2xl font-extrabold text-emerald-500 font-mono">100%</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>PO Line Match</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-indigo-400 font-mono">&lt; 3 sec</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AI Audit Speed</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-teal-400 font-mono">0%</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fraud Tolerance</p>
              </div>
            </div>

          </div>

          {/* Right Hero Product Visualization */}
          <div className="lg:col-span-5">
            <div className={`p-6 rounded-2xl border backdrop-blur-xl shadow-2xl relative ${
              isDark 
                ? 'bg-[#0E1322]/90 border-slate-800 shadow-emerald-950/20' 
                : 'bg-white border-slate-200 shadow-slate-300/50'
            }`}>
              
              {/* Product Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    VendorFlow Audit Visualizer
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold">
                  GEMINI 2.5 OCR
                </span>
              </div>

              {/* Interactive Flow Demonstration inside Card */}
              <div className="space-y-3 font-mono text-xs">
                
                {/* 1. Invoice Ingest Node */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Invoice Ingestion</div>
                      <div className="text-[10px] text-slate-500">INV-2026-8812 • TechMatters India</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded">PDF</span>
                </div>

                <div className="flex justify-center text-slate-500 my-1">
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                </div>

                {/* 2. AI Extraction Node */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>AI Extraction</div>
                      <div className="text-[10px] text-slate-500">GSTIN: 27AAACT8812P1Z8 • ₹3,77,600</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded">EXTRACTED</span>
                </div>

                <div className="flex justify-center text-slate-500 my-1">
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                </div>

                {/* 3. PO Match Node */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>PO Reconciliation</div>
                      <div className="text-[10px] text-slate-500">Matched against PO-2026-8812</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded font-bold">100% MATCH ✓</span>
                </div>

                <div className="flex justify-center text-slate-500 my-1">
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                </div>

                {/* 4. Risk Engine Score Node */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">DETERMINISTIC RISK EVALUATION</span>
                    <span className="text-xl font-extrabold text-emerald-400">Risk Score: 0 / 100</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                {/* 5. Final Autonomous Action Banner */}
                <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-emerald-400" />
                    DECISION: AUTO-APPROVED
                  </span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    PAYMENT ROUTED
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PRODUCT FLOW SECTION: "One Workflow. Zero Unnecessary Manual Work." */}
      <section id="how-it-works" className={`py-20 px-4 lg:px-8 border-y ${
        isDark ? 'bg-[#0B0F18] border-slate-800/80' : 'bg-slate-100/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              END-TO-END AUTOMATION
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              One Workflow. Zero Unnecessary Manual Work.
            </h2>
            <p className={`text-sm sm:text-base max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Five deterministic stages handle invoice ingestion, document intelligence, line-item reconciliation, and autonomous payment execution.
            </p>
          </div>

          {/* 5 Elegant Steps Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'UPLOAD',
                subtitle: 'Invoice enters VendorFlow',
                desc: 'PDF, JPG, or PNG ingested via Drag & Drop or Vendor Self-Service Portal.',
                icon: FileText,
                color: 'text-blue-400',
                border: 'border-blue-500/30'
              },
              {
                step: '02',
                title: 'EXTRACT',
                subtitle: 'AI understands the document',
                desc: 'Multimodal Gemini 2.5 extracts line items, tax numbers, and bank details.',
                icon: Cpu,
                color: 'text-indigo-400',
                border: 'border-indigo-500/30'
              },
              {
                step: '03',
                title: 'VERIFY',
                subtitle: 'PO, vendor, bank and duplicate checks',
                desc: 'Automated 3-way line item match, GSTIN validation, and bank account audit.',
                icon: Database,
                color: 'text-teal-400',
                border: 'border-teal-500/30'
              },
              {
                step: '04',
                title: 'DECIDE',
                subtitle: 'Deterministic risk engine evaluates',
                desc: 'Calculates a 0-100 risk score based on strict financial tolerance matrices.',
                icon: Scale,
                color: 'text-amber-400',
                border: 'border-amber-500/30'
              },
              {
                step: '05',
                title: 'ACT',
                subtitle: 'Auto-process or send to Review',
                desc: 'Low-risk invoices trigger simulated payout; high-risk escalates to Finance Admin.',
                icon: Zap,
                color: 'text-emerald-400',
                border: 'border-emerald-500/30'
              }
            ].map((node, idx) => (
              <div 
                key={node.step}
                className={`p-5 rounded-2xl border text-left transition-all hover:-translate-y-1 relative flex flex-col justify-between ${
                  isDark 
                    ? 'bg-[#0D121F] border-slate-800 hover:border-slate-700' 
                    : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-500">{node.step}</span>
                    <div className={`p-2 rounded-xl bg-slate-800/40 border ${node.border} ${node.color}`}>
                      <node.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className={`text-sm font-extrabold font-mono mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {node.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-500 mb-2 font-mono">
                    {node.subtitle}
                  </p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {node.desc}
                  </p>
                </div>

                {idx < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SHOW THE THREE DECISION STATES SECTION: "Every Invoice Gets a Decision" */}
      <section id="decision-states" className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              AUTOMATED ROUTING MATRIX
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Every Invoice Gets a Decision
            </h2>
            <p className={`text-sm sm:text-base max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Our deterministic risk evaluation engine immediately categorizes invoices into clear, actionable outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 🟢 LOW RISK - AUTO-APPROVED */}
            <div className={`p-6 rounded-2xl border space-y-4 transition-all ${
              isDark ? 'bg-[#0E1322] border-emerald-500/30' : 'bg-white border-emerald-300 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 🟢 LOW RISK
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">Score 0 - 20</span>
              </div>
              <h3 className={`text-xl font-bold font-mono text-emerald-400`}>
                AUTO-APPROVED
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                "Everything matches. Payment workflow continues automatically."
              </p>
              <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
                isDark ? 'bg-[#080B12] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-1 text-emerald-400">✓ 100% PO Line Item Match</div>
                <div className="flex items-center gap-1 text-emerald-400">✓ Verified Master Bank Details</div>
                <div className="flex items-center gap-1 text-emerald-400">✓ Valid GSTIN & Clean Duplicate Check</div>
              </div>
            </div>

            {/* 🟠 REVIEW - HUMAN REVIEW REQUIRED */}
            <div className={`p-6 rounded-2xl border space-y-4 transition-all ${
              isDark ? 'bg-[#0E1322] border-amber-500/30' : 'bg-white border-amber-300 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> 🟠 REVIEW
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">Score 21 - 60</span>
              </div>
              <h3 className={`text-xl font-bold font-mono text-amber-400`}>
                HUMAN REVIEW
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                "Something needs attention. Finance gets the case."
              </p>
              <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
                isDark ? 'bg-[#080B12] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-1 text-amber-400">⚠ Price Variance Exceeds 5%</div>
                <div className="flex items-center gap-1 text-amber-400">⚠ Missing PO or Quantity Difference</div>
                <div className="flex items-center gap-1 text-slate-400">Escalates to Finance Admin Queue</div>
              </div>
            </div>

            {/* 🔴 HIGH RISK - PAYMENT BLOCKED */}
            <div className={`p-6 rounded-2xl border space-y-4 transition-all ${
              isDark ? 'bg-[#0E1322] border-rose-500/30' : 'bg-white border-rose-300 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> 🔴 HIGH RISK
                </span>
                <span className="text-xs font-mono text-rose-400 font-bold">Score 61 - 100</span>
              </div>
              <h3 className={`text-xl font-bold font-mono text-rose-400`}>
                BLOCKED
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                "Critical anomaly detected. Payment is stopped."
              </p>
              <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
                isDark ? 'bg-[#080B12] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-1 text-rose-400 font-bold">⛔ Bank Account Swap Attempt</div>
                <div className="flex items-center gap-1 text-rose-400 font-bold">⛔ Duplicate Invoice Number Submitted</div>
                <div className="flex items-center gap-1 text-rose-400">Payout Blocked Immediately</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* AI + RULE ENGINE SECTION: "AI Understands. Rules Decide." */}
      <section id="ai-architecture" className={`py-20 px-4 lg:px-8 border-y ${
        isDark ? 'bg-[#0B0F18] border-slate-800/80' : 'bg-slate-100/80 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              ZERO-HALLUCINATION ARCHITECTURE
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              AI Understands. Rules Decide.
            </h2>
            <p className={`text-sm sm:text-base max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              We separate non-deterministic LLM document perception from strict, deterministic financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            
            {/* Left Box: AI Document Intelligence */}
            <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    AI Document Intelligence
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Gemini 2.5 Multimodal OCR</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs font-mono text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unstructured PDF & Image OCR Parsing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dynamic Field Extraction (GSTIN, Amounts)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Line-Item Table & Unit Price Reading</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Natural Language Decision Explanation</span>
                </li>
              </ul>
            </div>

            {/* Center Flow Connector */}
            <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-2 text-center py-4 lg:py-0">
              <div className="hidden lg:flex flex-col items-center space-y-2 font-mono text-[10px] text-emerald-400 font-bold">
                <span>AI EXTRACTION</span>
                <ChevronRight className="w-5 h-5 text-emerald-500 animate-pulse" />
                <span>STRUCTURED DATA</span>
                <ChevronRight className="w-5 h-5 text-emerald-500 animate-pulse" />
                <span>DETERMINISTIC RULES</span>
              </div>
              <div className="lg:hidden font-mono text-xs text-emerald-400 font-bold">
                STRUCTURED JSON TRANSFER →
              </div>
            </div>

            {/* Right Box: Deterministic Verification */}
            <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Deterministic Verification
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Zero-Hallucination Rule Engine</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs font-mono text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Exact PO Line Item & Unit Price Matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5% Price Variance Threshold Evaluation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Master Vendor Bank Account Cross-Check</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Duplicate Submission & GSTIN Audit</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Central Architecture Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 border border-emerald-500/30 text-center font-mono text-xs text-emerald-400 font-bold">
            AI EXTRACTION → STRUCTURED DATA → DETERMINISTIC RULES → SAFE AUTOMATION
          </div>

        </div>
      </section>

      {/* REAL PRODUCT CAPABILITIES SECTION */}
      <section id="features" className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              REAL PRODUCT CAPABILITIES
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Engineered for Real Accounts Payable Workflows
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className={`p-6 rounded-2xl border transition-all ${
              isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 w-fit mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold font-mono mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                REAL DOCUMENT PROCESSING
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Process PDF and image invoices directly. Extract vendor names, GSTIN, line items, and totals automatically.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${
              isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 w-fit mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold font-mono mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                PURCHASE ORDER RECONCILIATION
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Compare invoice line items against approved POs. Calculate unit price variance and flag discrepancies.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${
              isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 w-fit mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold font-mono mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                FRAUD & ANOMALY DETECTION
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Detect price discrepancies, duplicate invoices, and bank account changes before money leaves the company.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${
              isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold font-mono mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                HUMAN-IN-THE-LOOP
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Escalate high-risk cases instead of blindly automating them. Provide finance admins with clear audit logs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECURITY / TRUST SECTION: "Automation With Guardrails" */}
      <section id="security" className="py-20 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          <div className="p-8 lg:p-12 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-indigo-900/20 via-slate-900/40 to-emerald-900/20 border-indigo-500/30">
            <div className="space-y-6 relative z-10 max-w-3xl mx-auto">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                CONTROLLED FINANCIAL AUTOMATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Automation With Guardrails
              </h2>
              
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-emerald-400 font-bold flex flex-wrap items-center justify-center gap-2">
                <span>AI Extraction</span>
                <span>+</span>
                <span>Deterministic Rules</span>
                <span>+</span>
                <span>Risk Thresholds</span>
                <span>+</span>
                <span>Human Oversight</span>
                <span>+</span>
                <span>Audit Trail</span>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                VendorFlow automates routine decisions while keeping high-risk financial actions under controlled human review.
              </p>

              <div className="pt-4">
                <button
                  onClick={onEnterApp}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold font-mono tracking-wide shadow-xl shadow-emerald-950/50 inline-flex items-center space-x-2 transition-all cursor-pointer"
                  id="landing-security-get-started-btn"
                >
                  <span>Get Started →</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FOOTER & DEMO ENVIRONMENT DISCLAIMER */}
      <footer className={`border-t py-8 px-4 lg:px-8 text-xs font-mono transition-colors ${
        isDark ? 'bg-[#06080F] border-slate-800/80 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-emerald-500" />
            <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>VendorFlow AP Engine</span>
            <span>•</span>
            <span className="text-amber-500 font-medium">DEMO ENVIRONMENT · NO REAL MONEY TRANSFER</span>
          </div>

          <div className="text-center md:text-right text-slate-500">
            <span>Gemini 2.5 OCR & Zero-Hallucination Risk Matrix</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
