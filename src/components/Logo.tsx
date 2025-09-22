export function PixteryxLogo({ size = 40, wordmark = true }: { size?: number; wordmark?: boolean }) {
  const stroke = "#38bdf8";
  return (
    <div className="flex items-center gap-3 select-none">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Pixteryx logo">
        <rect x="6" y="8" width="8" height="8" rx="1.5" fill={stroke} />
        <path d="M8 32C14 20 26 12 32 12c6 0 18 8 24 20-6 12-18 20-24 20S14 44 8 32Z" stroke={stroke} strokeWidth={4} fill="none" strokeLinejoin="round" />
        <path d="M28 26l8 12M36 26l-8 12" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
      </svg>
      {wordmark && <span className="font-semibold tracking-tight text-2xl text-sky-400">Pixteryx</span>}
    </div>
  );
}
