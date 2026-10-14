const LABELS = { APPROVED: 'Aprovada', REJECTED: 'Rejeitada', PENDING: 'Pendente' };

export default function StatusBadge({ result }) {
  const key = LABELS[result] ? result : 'PENDING';
  return <span className={`g4-badge g4-badge--${key.toLowerCase()}`}>{LABELS[key]}</span>;
}
