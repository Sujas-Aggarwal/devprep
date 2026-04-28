/**
 * pages/Dashboard.jsx — refined problem list with unified badge consistency
 */
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { questionsApi } from '../api/questions'
import { submissionsApi } from '../api/submissions'
import { DifficultyBadge, StatusBadge, TagChip } from '../components/Badge'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'

// Fixed grid layout for consistency: ID (40px) | Title (1fr) | Level (100px) | Tags (180px) | Status (140px)
const GRID_COLS = "grid-cols-[40px_1fr_100px_180px_140px]";

function StatCard({ label, value, sub, valueClass = '' }) {
  return (
    <div className="stat-card">
      <span className="section-label">{label}</span>
      <span className={`text-2xl font-bold leading-none mt-1.5 text-zinc-900 dark:text-zinc-100 ${valueClass}`}>
        {value}
      </span>
      {sub && <span className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">{sub}</span>}
    </div>
  )
}

const SearchIcon = () => (
  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [tags, setTags]           = useState([])
  const [stats, setStats]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [difficulty, setDifficulty] = useState('')
  const [tag, setTag]             = useState('')
  const [search, setSearch]       = useState('')

  useEffect(() => { fetchAll() }, [difficulty, tag])

  async function fetchAll() {
    setLoading(true)
    try {
      const [qRes, pRes] = await Promise.all([
        questionsApi.list({ difficulty: difficulty || undefined, tag: tag || undefined }),
        submissionsApi.getProgress(),
      ])
      setQuestions(qRes.data.questions)
      setTags(qRes.data.tags)
      setStats(pRes.data.stats)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(
    () => questions.filter((q) => !search || q.title.toLowerCase().includes(search.toLowerCase())),
    [questions, search]
  )

  const solved = stats?.solved ?? 0
  const total  = stats?.total_questions ?? 1
  const pct    = Math.round((solved / total) * 100)

  return (
    <div className="min-h-[calc(100vh-52px)] bg-light-bg dark:bg-dark-bg page-enter">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Problems</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium">
                Welcome back, <span className="text-accent-600 dark:text-accent-400">{user?.name}</span>
              </p>
            </div>
            
            {(stats?.streak_days ?? 0) > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider
                              bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {stats.streak_days} Day Streak
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Solved"    value={solved} sub={`Target: ${total}`} valueClass="text-emerald-600" />
            <StatCard label="Accuracy"  value={`${stats?.accuracy_percent ?? 0}%`} sub={`${stats?.accepted_submissions ?? 0} total passes`} />
            <StatCard label="Active"    value={stats?.attempted ?? 0} sub="Problems attempted" />
            <StatCard label="Streak"    value={stats?.streak_days ?? 0} sub="Consecutive days" />
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
              <span className="section-label">Overall Mastery</span>
              <span className="text-[11px] font-bold text-zinc-500">{pct}%</span>
            </div>
            <div className="progress-track h-1.5">
              <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Problem List ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-accent-500">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9 w-64 h-9 text-[13px]"
            />
          </div>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="form-input h-9 w-32 text-[13px] cursor-pointer"
          >
            <option value="">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="form-input h-9 w-40 text-[13px] cursor-pointer"
          >
            <option value="">All Topics</option>
            {tags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <span className="ml-auto text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            {filtered.length} Found
          </span>
        </div>

        {/* Table Head - Perfectly aligned with rows */}
        <div className={`hidden sm:grid ${GRID_COLS} gap-4 px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/50 section-label`}>
          <span>#</span>
          <span>Title</span>
          <span>Level</span>
          <span>Tags</span>
          <span className="text-right">Status</span>
        </div>

        {/* Rows */}
        <div className="card shadow-none border-t-0 rounded-t-none divide-y divide-zinc-100 dark:divide-zinc-800/20">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size={24} /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3 text-zinc-400">
              <p className="text-sm font-medium">No problems found</p>
              <button className="btn-ghost text-xs" onClick={() => { setDifficulty(''); setTag(''); setSearch('') }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div>
              {filtered.map((q, i) => (
                <Link
                  key={q.id}
                  to={`/question/${q.id}`}
                  className={`problem-row ${GRID_COLS} animate-fade-up border-0`}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <span className="text-[11px] font-mono text-zinc-400">{i + 1}</span>

                  <span className="font-semibold text-[13px] text-zinc-800 dark:text-zinc-200 truncate hover:text-accent-600 transition-colors">
                    {q.title}
                  </span>

                  <div>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {q.tags.slice(0, 2).map((t) => <TagChip key={t} tag={t} />)}
                    {q.tags.length > 2 && (
                      <span className="text-[10px] font-bold text-zinc-400">+{q.tags.length - 2}</span>
                    )}
                  </div>

                  <div className="text-right">
                    <StatusBadge status={q.user_status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
