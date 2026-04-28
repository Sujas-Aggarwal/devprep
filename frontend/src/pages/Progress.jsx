/**
 * pages/Progress.jsx — refined analytics with consistent scale
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { submissionsApi } from '../api/submissions'
import { DifficultyBadge, StatusBadge } from '../components/Badge'
import Spinner from '../components/Spinner'

/* ── Donut Chart ── */
function DonutChart({ solved, total }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? solved / total : 0
  const dash = pct * circ

  return (
    <div className="relative inline-flex items-center justify-center w-32 h-32">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor"
          className="text-zinc-100 dark:text-zinc-800" strokeWidth="12" />
        <circle cx="64" cy="64" r={r} fill="none"
          stroke="url(#amberGrad)" strokeWidth="12"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <defs>
          <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center select-none">
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">{solved}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">Solved</div>
      </div>
    </div>
  )
}

function ago(str) {
  if (!str) return '—'
  const date = new Date(str.endsWith('Z') ? str : str + 'Z')
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function SubStatus({ status }) {
  const map = {
    accepted:     { cls: 'text-emerald-600', label: 'Accepted' },
    partial:      { cls: 'text-amber-600',   label: 'Partial' },
    wrong_answer: { cls: 'text-red-600',     label: 'Wrong' },
  }
  const m = map[status] ?? map.wrong_answer
  return <span className={`text-[12px] font-bold ${m.cls}`}>{m.label}</span>
}

export default function Progress() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('submissions')

  useEffect(() => {
    submissionsApi.getProgress()
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-52px)] bg-light-bg dark:bg-dark-bg">
        <Spinner size={24} />
      </div>
    )
  }

  const { stats = {}, recent_submissions = [], question_progress = [] } = data ?? {}

  return (
    <div className="min-h-[calc(100vh-52px)] bg-light-bg dark:bg-dark-bg page-enter">
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Track your growth and performance</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="stat-card">
                <span className="section-label">Solved</span>
                <span className="text-2xl font-bold mt-1 text-emerald-600">{stats.solved ?? 0}</span>
                <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">Problems</span>
              </div>
              <div className="stat-card">
                <span className="section-label">Accuracy</span>
                <span className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{stats.accuracy_percent ?? 0}%</span>
                <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">Rate</span>
              </div>
              <div className="stat-card">
                <span className="section-label">Streak</span>
                <span className="text-2xl font-bold mt-1 text-amber-500">{stats.streak_days ?? 0}</span>
                <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">Days</span>
              </div>
            </div>

            <div className="card p-6 space-y-5 shadow-none">
              <h2 className="section-label">Skill Breakdown</h2>
              <div className="space-y-4">
                {['easy', 'medium', 'hard'].map((d) => {
                  const qInDiff = question_progress.filter((q) => q.difficulty === d)
                  const solved  = qInDiff.filter((q) => q.status === 'solved').length
                  const total   = qInDiff.length
                  const pct = total > 0 ? (solved / total) * 100 : 0
                  return (
                    <div key={d}>
                      <div className="flex justify-between items-center mb-2">
                        <DifficultyBadge difficulty={d} />
                        <span className="text-[11px] font-bold text-zinc-500">{solved} / {total}</span>
                      </div>
                      <div className="progress-track h-1.5">
                        <div 
                          className="progress-fill h-full" 
                          style={{ 
                            width: `${pct}%`,
                            background: d === 'easy' ? '#10b981' : d === 'medium' ? '#f59e0b' : '#ef4444' 
                          }} 
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="card p-8 flex flex-col items-center justify-center text-center gap-5 shadow-none">
            <DonutChart solved={stats.solved ?? 0} total={stats.total_questions ?? 0} />
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Total Completion
              </div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                {Math.round(((stats.solved ?? 0) / (stats.total_questions ?? 1)) * 100)}% Mastered
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg w-fit">
            {[
              ['submissions', 'Activity'],
              ['questions', 'Status']
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all
                  ${tab === key 
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden shadow-none">
            {tab === 'submissions' ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                <div className="grid grid-cols-[1fr_100px_80px_80px_100px] gap-4 px-6 py-3 section-label bg-zinc-50 dark:bg-zinc-800/30">
                  <span>Problem</span><span>Status</span><span>Passed</span><span>Time</span><span className="text-right">When</span>
                </div>
                {recent_submissions.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-xs font-medium">No submissions yet</div>
                ) : (
                  recent_submissions.map((s) => (
                    <div key={s.id} className="grid grid-cols-[1fr_100px_80px_80px_100px] gap-4 px-6 py-4 text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <Link to={`/question/${s.question_id}`} className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-accent-600 truncate">
                        {s.question_title}
                      </Link>
                      <SubStatus status={s.status} />
                      <span className="text-zinc-500 font-medium">{s.passed_cases}/{s.total_cases}</span>
                      <span className="font-mono text-[11px] text-zinc-400">{s.time_taken_ms}ms</span>
                      <span className="text-right text-zinc-400 font-medium">{ago(s.submitted_at)}</span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                <div className="grid grid-cols-[1fr_100px_80px_100px_100px] gap-4 px-6 py-3 section-label bg-zinc-50 dark:bg-zinc-800/30">
                  <span>Problem</span><span>Level</span><span className="text-center">Tries</span><span>Status</span><span className="text-right">Last</span>
                </div>
                {question_progress.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-xs font-medium">No activity yet</div>
                ) : (
                  question_progress.map((qp) => (
                    <div key={qp.id} className="grid grid-cols-[1fr_100px_80px_100px_100px] gap-4 px-6 py-4 text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors items-center">
                      <Link to={`/question/${qp.question_id}`} className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-accent-600 truncate">
                        {qp.title}
                      </Link>
                      <DifficultyBadge difficulty={qp.difficulty} />
                      <span className="text-center text-zinc-500 font-medium">{qp.attempts}</span>
                      <StatusBadge status={qp.status} />
                      <span className="text-right text-zinc-400 font-medium">{ago(qp.last_attempted_at)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
