/**
 * pages/Login.jsx — clean, no emoji
 */
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from?.pathname ?? '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return setError('Both fields are required.')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-light-bg dark:bg-dark-bg">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-zinc-950 p-12 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Accent line */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent-500 to-transparent" />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-16">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="5" fill="#f59e0b"/>
              <path d="M6 7l4 3-4 3M11 13h4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white font-semibold text-sm tracking-tight">DevPrep</span>
          </div>

          <h2 className="text-2xl font-bold text-white leading-tight mb-4">
            Level up your<br/>interview skills.
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Practice coding problems, track progress, and master algorithms at your own pace.
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-6 text-center">
            {[['12+', 'Problems'], ['3', 'Difficulty levels'], ['100%', 'Free']].map(([val, label]) => (
              <div key={label}>
                <div className="text-xl font-bold text-accent-400 leading-none">{val}</div>
                <div className="text-xs text-zinc-600 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="5" fill="#f59e0b"/>
              <path d="M6 7l4 3-4 3M11 13h4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold text-sm text-zinc-900 dark:text-white">DevPrep</span>
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Sign in</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
              Continue where you left off
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="section-label block mb-1.5" htmlFor="email">Email</label>
              <input id="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={set('email')} autoComplete="email" autoFocus />
            </div>

            <div>
              <label className="section-label block mb-1.5" htmlFor="password">Password</label>
              <input id="password" type="password" className="form-input" placeholder="••••••••"
                value={form.password} onChange={set('password')} autoComplete="current-password" />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg text-sm
                              bg-red-50 dark:bg-red-950/30
                              border border-red-200 dark:border-red-900/60
                              text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button id="login-submit" type="submit" className="btn-primary w-full py-2.5 mt-1" disabled={loading}>
              {loading ? <><Spinner size={15}/> Signing in</> : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
            No account?{' '}
            <Link to="/register" className="text-accent-600 dark:text-accent-400 font-medium hover:underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
