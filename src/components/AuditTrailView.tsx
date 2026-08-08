import React from 'react';
import { AuditEvent } from '../types';
import { verifyAuditChainIntegrity } from '../services/auditLogger';
import { ShieldCheck, Lock, Hash, Bot, User, Cpu, Clock, FileText } from 'lucide-react';

interface AuditTrailViewProps {
  auditLogs: AuditEvent[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditLogs }) => {
  const { isIntegrityValid, brokenAtSequence } = verifyAuditChainIntegrity(auditLogs);

  return (
    <div className="bg-[#121826] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono">
      
      {/* Integrity Verification Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isIntegrityValid 
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
          : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              TAMPER-EVIDENT CRYPTOGRAPHIC AUDIT LOG
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isIntegrityValid 
                ? '✅ Cryptographic SHA-256 Hash Chain Intact. All event transitions verified.' 
                : `🚨 INTEGRITY VIOLATION DETECTED at sequence #${brokenAtSequence}`}
            </p>
          </div>
        </div>

        <div className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-emerald-400 font-bold">
          {auditLogs.length} Events Sequenced
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Seq #</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Invoice</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action & Details</th>
              <th className="py-3 px-4">SHA-256 Current Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-indigo-400">#{log.sequenceNumber}</td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                <td className="py-3 px-4 font-bold text-white">{log.invoiceNumber}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.actor === 'AI_AGENT' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                    log.actor === 'FINANCE_ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  }`}>
                    {log.actor}
                  </span>
                </td>
                <td className="py-3 px-4 font-sans">
                  <div className="font-bold text-white text-xs">{log.action}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{log.details}</div>
                </td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500 max-w-xs truncate" title={`Prev: ${log.previousHash}\nCurr: ${log.currentHash}`}>
                  <span className="text-slate-400">0x</span>{log.currentHash.slice(0, 16)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
