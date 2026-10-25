import { useLocation } from "react-router-dom";
import { whatsappUrl } from "../../lib/whatsapp";

/* Mobile-only shortcut to WhatsApp; hidden on the contact page where the form is the action. */
export default function WhatsAppFab() {
  const { pathname } = useLocation();
  if (pathname === "/contact") return null;
  return (
    <a
      href={whatsappUrl("Hi FIRST CLICK, I'd like to discuss a project.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-line-strong bg-raised-2/95 pl-3 pr-5 text-[15px] font-medium text-ink backdrop-blur md:hidden"
    >
      <WhatsAppIcon className="size-6 text-live" />
      WhatsApp us
    </a>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" />
    </svg>
  );
}
