import { Link } from "react-router-dom";

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex items-center transition-transform duration-200 hover:opacity-90"
      aria-label="FIRST CLICK CONNECTS LLP home"
    >
      {/* Full uncropped official photo, sleek & compact */}
      <img
        src="/firstclick-full-card.png?v=6"
        alt="FIRST CLICK CONNECTS LLP"
        className="h-7 sm:h-8 md:h-[34px] w-auto object-contain rounded-[6px] shadow-sm transition-transform duration-200 group-hover:scale-105"
      />
    </Link>
  );
}
