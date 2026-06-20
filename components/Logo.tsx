export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 90"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: "48px", width: "auto" }}
    >
      <rect x="0" y="18" width="48" height="40" rx="5" fill="#16A34A"/>
      <path d="M8 18 Q8 0 24 0 Q40 0 40 18" fill="none" stroke="#16A34A" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="24" cy="36" r="5.5" fill="white"/>
      <line x1="24" y1="40" x2="24" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="62" y1="10" x2="62" y2="80" stroke="#E2E8F0" strokeWidth="0.8"/>
      <text x="74" y="52" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="38" fontWeight="800" fill="#111827" letterSpacing="-1">JABIYE</text>
      <text x="76" y="70" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="11" fontWeight="400" fill="#16A34A" letterSpacing="6">HOME</text>
    </svg>
  )
}