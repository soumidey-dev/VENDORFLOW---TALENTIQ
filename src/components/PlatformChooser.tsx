import React from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { 
  Building2, 
  GraduationCap, 
  ArrowRight, 
  Check, 
  Sun, 
  Moon, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  FileCheck, 
  Zap,
  Target,
  FileText
} from 'lucide-react';

interface PlatformChooserProps {
  onSelectVendorFlow: () => void;
  onSelectCareerMatch: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const PlatformChooser: React.FC<PlatformChooserProps> = ({
  onSelectVendorFlow,
  onSelectCareerMatch,
  theme,
  onToggleTheme
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 font-sans selection:bg-emerald-500 selection:text-white flex flex-col justify-between ${
      isDark ? 'bg-[#080B12] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Effect */}
      <AnimatedBackground theme={theme} variant="hero" />

      {/* Header Bar */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 px-4 lg:px-8 py-3.5 ${
        isDark ? 'bg-[#0B0F19]/90 border-slate-800/80' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Platform Brand */}
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center shadow-md ${
              isDark 
                ? 'bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 border-indigo-500/30 text-emerald-400' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <Bot className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xl font-extrabold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Vendor<span className="text-emerald-500">Flow</span> <span className="text-slate-500 font-normal">-</span> Talent<span className="text-purple-400">IQ</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  AI PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Intelligent Business & Career Automation Platform
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Selection Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 lg:py-16 my-auto w-full z-10 space-y-10">
        
        {/* Title Hero */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select an Application</span>
          </div>
          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-mono ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            What would you like to use?
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto">
            Choose between autonomous B2B finance automation or AI-driven student career placement intelligence.
          </p>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* CARD 1: VENDORFLOW FINANCE */}
          <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
            isDark 
              ? 'bg-[#0B0F19]/90 border-slate-800 hover:border-emerald-500/50 shadow-2xl hover:shadow-emerald-950/20' 
              : 'bg-white border-slate-200 hover:border-emerald-500/50 shadow-lg hover:shadow-xl'
          }`}>
            {/* Top Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            
            <div className="space-y-6">
              
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Building2 className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-extrabold uppercase tracking-wider">
                  FINANCE AUTOMATION
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  💼 VendorFlow
                </h2>
                <p className="text-sm font-bold text-emerald-400 font-mono mt-1">
                  "Autonomous B2B Invoice Audit, Fraud Check & Payout Engine"
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
                Automatically analyze invoices, verify purchase orders, detect fraud and manage high-risk financial exceptions.
              </p>

              {/* Features List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/60 font-mono text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Key Capabilities:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Invoice AI Audit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>PO Verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Fraud Detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Risk Scoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Human Review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Simulated Payout</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cryptographic Audit Trail</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Button */}
            <div className="pt-8">
              <button
                onClick={onSelectVendorFlow}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold font-mono text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center space-x-3 transition-all cursor-pointer group-hover:scale-[1.01] active:scale-95"
              >
                <span>Enter VendorFlow</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* CARD 2: CAREERMATCH INTELLIGENCE */}
          <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
            isDark 
              ? 'bg-[#0B0F19]/90 border-slate-800 hover:border-purple-500/50 shadow-2xl hover:shadow-purple-950/20' 
              : 'bg-white border-slate-200 hover:border-purple-500/50 shadow-lg hover:shadow-xl'
          }`}>
            {/* Top Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400"></div>

            <div className="space-y-6">
              
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-extrabold uppercase tracking-wider">
                  CAREER & PLACEMENT AI
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  🎓 CareerMatch Intelligence
                </h2>
                <p className="text-sm font-bold text-purple-300 font-mono mt-1">
                  "AI-Powered Career & Placement Intelligence"
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
                Analyze your resume, academic profile, projects and skills to discover your best-fit career roles and identify skill gaps.
              </p>

              {/* Features List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/60 font-mono text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Key Capabilities:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Resume Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Marksheet Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Skill Intelligence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Role Matching</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>JD Description Matcher</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Skill Gap Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Career Roadmap</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Interview Preparation</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Button */}
            <div className="pt-8">
              <button
                onClick={onSelectCareerMatch}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold font-mono text-sm shadow-xl shadow-purple-950/40 flex items-center justify-center space-x-3 transition-all cursor-pointer group-hover:scale-[1.01] active:scale-95 border border-purple-400/30"
              >
                <span>Enter CareerMatch</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className={`border-t py-4 px-6 text-center text-xs text-slate-500 font-mono z-10 ${
        isDark ? 'border-slate-800/80 bg-[#080B12]' : 'border-slate-200 bg-white'
      }`}>
        VendorFlow & CareerMatch Intelligence Platform • Powered by Gemini AI Engine
      </footer>

    </div>
  );
};
