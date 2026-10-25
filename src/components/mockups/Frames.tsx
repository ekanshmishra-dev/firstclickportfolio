import type { ReactNode } from "react";

/* Device chrome shared by every mockup. Mockups are illustrations: one label for screen readers, inner text hidden. */

export function MockFigure({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="img" aria-label={label} data-ui className={className}>
      <div aria-hidden="true" className="h-full">
        {children}
      </div>
    </div>
  );
}

export function BrowserFrame({ url, children, className = "" }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[14px] border border-line-strong bg-[#0d0d13] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] ${className}`}>
      <div className="flex h-9 items-center gap-3 border-b border-line px-3.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#3a3a46]" />
          <span className="size-2.5 rounded-full bg-[#3a3a46]" />
          <span className="size-2.5 rounded-full bg-[#3a3a46]" />
        </div>
        <div className="mx-auto flex h-6 w-full max-w-[260px] items-center justify-center gap-1.5 rounded-md bg-white/[0.04] text-[11px] text-muted">
          <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
            <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke="currentColor" />
            <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" />
          </svg>
          {url}
        </div>
        <span className="w-[42px]" />
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[34px] border border-line-strong bg-[#050508] p-[7px] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[28px] bg-[#0f0f16]">
        <div className="absolute left-1/2 top-2 z-10 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[14px] border border-line-strong bg-[#101017] ${className}`}>{children}</div>;
}

export function SampleTag() {
  return <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">Sample data</span>;
}
