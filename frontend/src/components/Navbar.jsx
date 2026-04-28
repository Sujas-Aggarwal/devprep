/**
 * components/Navbar.jsx — improved dropdown and layout
 */
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const NavLink = ({ to, children, id }) => {
  const { pathname } = useLocation()
  const active = pathname.startsWith(to)
  return (
    <Link id={id} to={to} className={`nav-link ${active ? 'active' : ''}`}>
      {children}
    </Link>
  )
}

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent-500">
    <rect width="24" height="24" rx="6" fill="currentColor" fillOpacity="0.1" />
    <path d="M7 8l5 4-5 4M13 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  
  const initial = user?.name?.[0]?.toUpperCase() ?? '?'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 h-14 w-full flex items-center justify-center
                       bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md
                       border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="max-w-5xl w-full flex items-center justify-between px-6">
        
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2.5 group transition-opacity hover:opacity-80">
            <LogoIcon />
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-white">
              DevPrep
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" id="nav-problems">Problems</NavLink>
            <NavLink to="/progress" id="nav-progress">Progress</NavLink>
          </nav>
        </div>

        {/* Right: Actions + User Dropdown */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all
                         hover:bg-zinc-100 dark:hover:bg-zinc-800/60 active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-md bg-accent-500 flex items-center justify-center
                              text-[12px] font-bold text-white shadow-glow">
                {initial}
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                  {user?.name}
                </span>
                <svg className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                     fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 
                              border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl 
                              py-2 z-[60] animate-fade-in origin-top-right">
                <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user?.email}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[12px] font-bold text-red-500 
                             hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
