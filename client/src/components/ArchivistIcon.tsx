export default function ArchivistIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-testid="icon-archivist"
    >
      <rect width="40" height="40" rx="8" fill="#0A0A0A" />
      <path
        d="M20 6L20 34"
        stroke="#14B8A6"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="20" cy="12" r="2.5" fill="#14B8A6" />
      <circle cx="20" cy="20" r="2.5" fill="#14B8A6" opacity="0.7" />
      <circle cx="20" cy="28" r="2.5" fill="#14B8A6" opacity="0.4" />
      <path
        d="M13 12L20 12"
        stroke="#14B8A6"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M20 20L27 20"
        stroke="#14B8A6"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M13 28L20 28"
        stroke="#14B8A6"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
