/**
 * components/ResultPanel.jsx — refined table and status scale
 */

const STATUS_META = {
  accepted:     { label: 'Accepted',     cls: 'text-emerald-600', dot: 'bg-emerald-500' },
  wrong_answer: { label: 'Wrong Answer', cls: 'text-red-600',     dot: 'bg-red-500' },
  partial:      { label: 'Partial',      cls: 'text-amber-600',   dot: 'bg-amber-500' },
}

export default function ResultPanel({ result }) {
  if (!result) return null
  const { status, passed, total, time_taken_ms, results, error } = result
  const meta = STATUS_META[status] ?? STATUS_META.wrong_answer

  return (
    <div className="bg-white dark:bg-zinc-900">
      {/* Summary Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${meta.dot} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
          <span className={`text-[13px] font-bold uppercase tracking-wider ${meta.cls}`}>{meta.label}</span>
        </div>
        <div className="flex items-center gap-5 text-[11px] font-bold text-zinc-400">
          <span className="uppercase tracking-widest">
            Passed: <span className={passed === total ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-300'}>{passed}/{total}</span>
          </span>
          <span className="font-mono tracking-normal">{time_taken_ms}ms</span>
        </div>
      </div>

      {error && (
        <div className="px-6 py-4 text-xs font-mono text-red-500 bg-red-50/50 dark:bg-red-950/10 border-b border-zinc-100 dark:border-zinc-800/50">
          {error}
        </div>
      )}

      {/* Test Case Table */}
      {results.length > 0 && (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          <div className="grid grid-cols-[40px_1fr_1fr_1fr_80px] gap-4 px-6 py-2 section-label bg-zinc-50 dark:bg-zinc-800/30">
            <span>#</span><span>Input</span><span>Expected</span><span>Actual</span><span className="text-right">Result</span>
          </div>

          {results.map((tc) => (
            <div key={tc.index} className="grid grid-cols-[40px_1fr_1fr_1fr_80px] gap-4 px-6 py-4 text-[12px] items-center">
              <span className="font-mono text-zinc-400">{tc.index}</span>

              <span className="font-mono truncate text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded">
                {tc.input}
              </span>

              <span className="font-mono truncate text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded">
                {tc.expected}
              </span>

              <span className={`font-mono truncate px-2 py-1 rounded ${
                tc.error
                  ? 'text-red-500 bg-red-50 dark:bg-red-950/20'
                  : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50'
              }`}>
                {tc.error ? `Error: ${tc.error}` : (tc.actual ?? '—')}
              </span>

              <span className={`text-right font-bold uppercase text-[10px] tracking-wider ${tc.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                {tc.passed ? 'Pass' : 'Fail'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
