const ITEMS = ["Websites", "Apps", "Automation", "Social Media", "Content & Reels", "Digital Marketing", "Meta Ads"];

export default function Ticker() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-line bg-raised/40 py-5" aria-label={`Services: ${ITEMS.join(", ")}`}>
      <div className="ticker-track flex w-max" aria-hidden="true">
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <li key={`${k}-${i}`} className="flex items-center font-display text-[22px] font-medium tracking-[-0.02em] text-soft">
                <span className="px-7">{t}</span>
                <span className="size-1.5 rounded-full bg-violet" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
