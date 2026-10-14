import { useState } from 'react';

export default function ManualForm({ onSubmit }) {
  const [code, setCode] = useState('');
  const [lotId, setLotId] = useState('');
  const [result, setResult] = useState('APPROVED');
  const [reason, setReason] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const r = onSubmit({ code, lotId: lotId.trim(), result, reason: result === 'REJECTED' ? reason.trim() : '' });
    if (r.ok) setCode('');
  }

  return (
    <div className="g4-card">
      <h2>Entrada manual (backup)</h2>
      <form onSubmit={handleSubmit} className="g4-form">
        <label>
          ID da peça (conteúdo do QR)
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex: P-1001" />
        </label>
        <div className="g4-row">
          <label>
            Resultado
            <select value={result} onChange={(e) => setResult(e.target.value)}>
              <option value="APPROVED">Aprovada</option>
              <option value="REJECTED">Rejeitada</option>
              <option value="PENDING">Pendente</option>
            </select>
          </label>
          <label>
            Lote
            <input value={lotId} onChange={(e) => setLotId(e.target.value)} placeholder="LOT-A1" />
          </label>
        </div>
        {result === 'REJECTED' && (
          <label>
            Motivo
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex: QR ilegível" />
          </label>
        )}
        <button type="submit" className="g4-btn g4-btn--primary">
          Registrar leitura
        </button>
      </form>
    </div>
  );
}
