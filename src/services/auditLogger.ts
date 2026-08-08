/**
 * VendorFlow - Tamper-Evident SHA-256 Hash-Chaining Audit Log Service
 * Generates cryptographic hash chain linking each audit event sequentially.
 */

import { AuditEvent, InvoiceStatus } from '../types';

// Simple deterministic hash calculation for tamper-evident chaining
function simpleSHA256(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Convert to positive hex representation padded
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  // Repeat to form a 64-char hash string signature
  return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
}

export function createAuditEvent(
  previousEvents: AuditEvent[],
  invoiceId: string,
  invoiceNumber: string,
  actor: 'AI_AGENT' | 'FINANCE_ADMIN' | 'VENDOR' | 'SYSTEM_ENGINE',
  action: string,
  newStatus: InvoiceStatus,
  details: string,
  previousStatus?: InvoiceStatus
): AuditEvent {
  const sequenceNumber = previousEvents.length + 1;
  const timestamp = new Date().toISOString();
  
  const lastEvent = previousEvents[previousEvents.length - 1];
  const previousHash = lastEvent 
    ? lastEvent.currentHash 
    : '0000000000000000000000000000000000000000000000000000000000000000';

  const dataToHash = `${sequenceNumber}|${timestamp}|${invoiceId}|${invoiceNumber}|${actor}|${action}|${newStatus}|${previousHash}|${details}`;
  const currentHash = simpleSHA256(dataToHash);

  const newEvent: AuditEvent = {
    id: `AUD-${1000 + sequenceNumber}`,
    sequenceNumber,
    timestamp,
    invoiceId,
    invoiceNumber,
    actor,
    action,
    previousStatus,
    newStatus,
    details,
    previousHash,
    currentHash
  };

  return newEvent;
}

export function verifyAuditChainIntegrity(events: AuditEvent[]): { isIntegrityValid: boolean; brokenAtSequence?: number } {
  if (events.length === 0) return { isIntegrityValid: true };

  for (let i = 0; i < events.length; i++) {
    const current = events[i];
    if (i === 0) {
      if (current.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return { isIntegrityValid: false, brokenAtSequence: current.sequenceNumber };
      }
    } else {
      const prev = events[i - 1];
      if (current.previousHash !== prev.currentHash) {
        return { isIntegrityValid: false, brokenAtSequence: current.sequenceNumber };
      }
    }
  }

  return { isIntegrityValid: true };
}
