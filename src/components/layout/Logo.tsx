import { Link } from "react-router-dom";

/* Wordmark: a cursor mid-click inside a rounded square, then the name. */
export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5" aria-label="FIRST CLICK home">
      <span className="grid size-8 place-items-center rounded-[9px] bg-violet">
        <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden="true">
          <path d="M6 4.5v10.2l2.7-2.6 1.9 4.4 1.9-.8-1.9-4.3h3.8L6 4.5z" fill="#fff" />
          <path d="M3.2 6.2 1.8 5.4M4.6 3.6l-.6-1.5M7.4 2.6l.1-1.6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity=".7" />
        </svg>
      </span>
      <span translate="no" className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">FIRST CLICK</span>
    </Link>
  );
}
