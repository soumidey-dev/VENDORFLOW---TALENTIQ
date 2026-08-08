import React from 'react';
import { UserRole } from '../types';
import { Bot, Building2, Store, RefreshCw, Sparkles, Sun, Moon, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenDemoScenarios: () => void;
  onResetData: () => void;
  pendingReviewsCount: number;
  isProcessing: boolean;
  onNavigateToPlatformChooser?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  onOpenDemoScenarios,
  onResetData,
  pendingReviewsCount,
  isProcessing,
  onNavigateToPlatformChooser,
  theme = 'dark',
  onToggleTheme
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 px-4 lg:px-8 py-3 ${
      isDark 
        ? 'bg-[#0B0F19]/90 border-slate-800/80 text-white' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div 
            onClick={onNavigateToPlatformChooser}
            className={`p-2.5 rounded-xl border flex items-center justify-center shadow-lg transition-all ${
              onNavigateToPlatformChooser ? 'cursor-pointer hover:scale-105' : ''
            } ${
              isDark 
                ? 'bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border-indigo-500/30 text-emerald-400 shadow-indigo-950/50' 
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-600 shadow-slate-200'
            }`}
            title="Return to Platform Chooser"
          >
            <Bot className="w-6 h-6 text-emerald-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 
                onClick={onNavigateToPlatformChooser}
                className={`text-xl font-extrabold tracking-tight font-mono ${
                  onNavigateToPlatformChooser ? 'cursor-pointer hover:opacity-80' : ''
                } ${isDark ? 'text-white' : 'text-slate-900'}`}
              >
                Vendor<span className="text-emerald-500">Flow</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-full">
                AUTONOMOUS AP
              </span>
            </div>
            <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>Autonomous B2B Invoice Audit, Fraud Check & Payout Engine</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Back to Platform Chooser Button */}
          {onNavigateToPlatformChooser && (
            <button
              onClick={onNavigateToPlatformChooser}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title="Return to Application Selection Landing Page"
              id="header-back-platform-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-500" />
              <span>Back to Platform</span>
            </button>
          )}

          {/* Quick Demo Scenarios Trigger */}
          <button
            onClick={onOpenDemoScenarios}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-300'
            }`}
            id="demo-scenarios-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin-slow" />
            <span>⚡ Run Demo Scenarios</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset to default demo data"
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
            }`}
            id="reset-demo-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Theme Switcher Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-400 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
              id="header-theme-toggle-btn"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Role Switcher Toggle (FINANCE_ADMIN vs VENDOR) */}
          <div className={`p-1 border rounded-xl flex items-center shadow-inner ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => onRoleChange('FINANCE_ADMIN')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'FINANCE_ADMIN'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
              id="role-finance-btn"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Finance Admin</span>
              {pendingReviewsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                  {pendingReviewsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onRoleChange('VENDOR')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'VENDOR'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
              id="role-vendor-btn"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Portal</span>
            </button>
          </div>

          {/* Live Agent Status Pulse */}
          <div className={`hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full border text-[11px] font-mono ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 text-slate-300' 
              : 'bg-slate-100 border-slate-300 text-slate-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            <span>{isProcessing ? 'AI Agent Auditing...' : 'Agent Standby'}</span>
          </div>

        </div>

      </div>
    </header>
  );
};


