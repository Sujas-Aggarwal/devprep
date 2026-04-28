/**
 * pages/Register.jsx — matches Login's left-panel layout, no emoji
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

const LogoBrand = () => (
  <div className="flex items-center gap-2">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect width="20" height="20" rx="5" fill="#f59e0b"/>
      <path d="M6 7l4 3-4 3M11 13h4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="font-semibold text-sm">DevPrep</span>
  </div>
)

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return setError('All fields are required.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-light-bg dark:bg-dark-bg">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-zinc-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent-500 to-transparent" />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-16 text-white">
            <LogoBrand />
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight mb-4">
            Start solving.<br/>Start growing.
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Join developers who use DevPrep to sharpen their skills before technical interviews.
          </p>
        </div>

        <div className="relative">
          <ul className="space-y-3 text-sm text-zinc-500">
            {[
              'Real algorithmic problems',
              'Instant feedback on every submission',
              'Track your progress over time',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-accent-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="flex items-center gap-2 mb-10 lg:hidden text-zinc-900 dark:text-white">
            <LogoBrand />
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Create account</h1>
            <p className="text-sm text-zinc-500 mt-1">Free, no credit card required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="section-label block mb-1.5" htmlFor="reg-name">Full Name</label>
              <input id="reg-name" type="text" className="form-input" placeholder="Sushil Kumar"
                value={form.name} onChange={set('name')} autoComplete="name" autoFocus />
            </div>

            <div>
              <label className="section-label block mb-1.5" htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={set('email')} autoComplete="email" />
            </div>

            <div>
              <label className="section-label block mb-1.5" htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" className="form-input" placeholder="Min 6 characters"
                value={form.password} onChange={set('password')} autoComplete="new-password" />
            </div>

            <div>
              <label className="section-label block mb-1.5" htmlFor="reg-confirm">Confirm Password</label>
              <input id="reg-confirm" type="password" className="form-input" placeholder="Same as above"
                value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg text-sm
                              bg-red-50 dark:bg-red-950/30
                              border border-red-200 dark:border-red-900/60
                              text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button id="register-submit" type="submit" className="btn-primary w-full py-2.5 mt-1" disabled={loading}>
              {loading ? <><Spinner size={15}/> Creating account</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-600 dark:text-accent-400 font-medium hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
