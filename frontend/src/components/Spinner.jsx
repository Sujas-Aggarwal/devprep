/**
 * components/Spinner.jsx
 */
export default function Spinner({ size = 18, className = '' }) {
  return (
    <svg
      className={`animate-spin-slow text-current opacity-60 ${className}`}
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/>
      <path fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
    </svg>
  )
}
