const LABELS = { APPROVED: 'APROVADA', REJECTED: 'REJEITADA', PENDING: 'PENDENTE' };

// Sinalização grande da última peça inspecionada.
export default function InspectionIndicator({ last }) {
  const result = last?.data.result;
  const key = result && LABELS[result] ? result.toLowerCase() : 'idle';

  return (
    <div className={`g4-inspect g4-inspect--${key}`} role="status" aria-live="polite">
      <div className="g4-inspect-label">{result ? LABELS[result] : 'AGUARDANDO PEÇA'}</div>
      {last && (
        <>
          <div className="g4-inspect-piece">{last.data.pieceId}</div>
          {last.data.reason && <div className="g4-inspect-reason">{last.data.reason}</div>}
        </>
      )}
    </div>
  );
}
