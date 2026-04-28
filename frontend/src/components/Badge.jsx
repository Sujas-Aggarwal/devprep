/**
 * components/Badge.jsx — using explicit mapping for Tailwind static analysis
 */

const DIFFICULTY_CLASSES = {
  easy:   'badge-easy',
  medium: 'badge-medium',
  hard:   'badge-hard',
}

const STATUS_CLASSES = {
  not_attempted: 'badge-not_attempted',
  attempted:     'badge-attempted',
  solved:        'badge-solved',
}

export function DifficultyBadge({ difficulty }) {
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const cls = DIFFICULTY_CLASSES[difficulty] || 'badge-not_attempted';
  return <span className={cls}>{label}</span>;
}

export function StatusBadge({ status }) {
  const labels = {
    not_attempted: "Not Attempted",
    attempted: "Attempted",
    solved: "Solved",
  };
  const cls = STATUS_CLASSES[status] || 'badge-not_attempted';
  return <span className={cls}>{labels[status] ?? status}</span>;
}

export function TagChip({ tag }) {
  return <span className="tag-chip">{tag}</span>;
}
