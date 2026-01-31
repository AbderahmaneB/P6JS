export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* SportSee bars icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="14" width="5" height="14" rx="1" fill="#0202BE" />
        <rect x="7" y="8" width="5" height="20" rx="1" fill="#0202BE" />
        <rect x="14" y="3" width="5" height="25" rx="1" fill="#0202BE" />
        <rect x="21" y="10" width="5" height="18" rx="1" fill="#0202BE" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-primary">
        SPORTSEE
      </span>
    </div>
  );
}
