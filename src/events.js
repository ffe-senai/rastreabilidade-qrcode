import { SCHEMA_VERSION } from './contract/contrato-smart40-v0_1.ts';

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Monta um TraceabilityScanEvent conforme o contrato v0.1.0.
// O conteúdo do QR é o ID da peça (pieceId e code recebem o mesmo valor).
export function buildScanEvent({ code, lotId, result, reason }) {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    eventId: newId(),
    type: 'traceability.piece-scanned',
    timestamp: now,
    source: 'mock',
    data: {
      pieceId: code,
      code,
      lotId: lotId || undefined,
      scannedAt: now,
      result,
      reason: reason || undefined,
    },
  };
}
