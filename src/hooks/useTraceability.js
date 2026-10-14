import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createLocalBus } from '../bus.js';
import { buildScanEvent } from '../events.js';

const MAX_HISTORY = 500;

// Ouve o barramento (Shell ou local) e mantém o histórico em memória.
export function useTraceability(externalBus) {
  const localBus = useMemo(() => createLocalBus(), []);
  const bus = externalBus ?? localBus;

  const [scans, setScans] = useState([]);
  const [connection, setConnection] = useState(null);
  const [machine, setMachine] = useState(null);
  const seen = useRef({ events: new Set(), pieces: new Set() });

  // Idempotência: mesmo eventId ou mesma peça não entra duas vezes.
  const addScan = useCallback((event) => {
    const { eventId, data } = event;
    if (seen.current.events.has(eventId) || seen.current.pieces.has(data.pieceId)) return false;
    seen.current.events.add(eventId);
    seen.current.pieces.add(data.pieceId);
    setScans((prev) => [event, ...prev].slice(0, MAX_HISTORY));
    return true;
  }, []);

  useEffect(
    () =>
      bus.subscribe((event) => {
        switch (event?.type) {
          case 'traceability.piece-scanned':
            addScan(event);
            break;
          case 'connection.state':
            setConnection(event.data);
            break;
          case 'machine.telemetry':
            setMachine(event.data);
            break;
          default:
        }
      }),
    [bus, addScan],
  );

  // Sem Shell (standalone), simula a conexão para o indicador.
  useEffect(() => {
    if (externalBus) return;
    localBus.publish({
      schemaVersion: '0.1.0',
      eventId: `local-conn-${Date.now()}`,
      type: 'connection.state',
      timestamp: new Date().toISOString(),
      source: 'mock',
      data: { state: 'CONNECTED' },
    });
  }, [externalBus, localBus]);

  // Leitura local (câmera ou manual): registra e publica no barramento.
  const register = useCallback(
    (input) => {
      const code = input.code?.trim();
      if (!code) return { ok: false, invalid: true };
      const event = buildScanEvent({ ...input, code });
      const ok = addScan(event);
      if (ok) bus.publish(event);
      return { ok, event };
    },
    [bus, addScan],
  );

  return { scans, connection, machine, register };
}
