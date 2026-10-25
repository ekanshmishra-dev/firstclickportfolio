import { MockFigure, PhoneFrame } from "./Frames";

/* A vertical reel with its hook, captions and call to action. */
export default function ContentMock({ className = "" }: { className?: string }) {
  return (
    <MockFigure label="Sample Instagram reel with an on-screen hook, captions and a call to action" className={className}>
      <PhoneFrame className="h-full">
        <div className="relative h-full overflow-hidden bg-[#1b1424]">
          <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_30%_20%,#6d4bd8_0%,transparent_55%),radial-gradient(90%_60%_at_80%_80%,#d4a373_0%,transparent_60%)] opacity-70" />
          <div className="absolute left-1/2 top-[30%] h-[42%] w-[52%] -translate-x-1/2 rounded-t-full bg-[#2a1f36]/80" />
          <div className="absolute left-3 right-12 top-[16%]">
            <p className="inline rounded-md bg-white px-1.5 py-0.5 font-display text-[15px] font-semibold leading-[1.45] tracking-tight text-[#111] [box-decoration-break:clone]">
              3 mistakes that cost you customers
            </p>
          </div>
          <div className="absolute bottom-[22%] left-3 right-12 text-center">
            <p className="text-[11px] font-semibold text-white [text-shadow:0_1px_6px_rgb(0_0_0/0.6)]">
              Mistake #1: no clear price on your page
            </p>
          </div>
          <div className="absolute bottom-[16%] right-2.5 flex flex-col items-center gap-3 text-[9px] text-white/90">
            {["♥", "✦", "➤"].map((g) => (
              <span key={g} className="grid size-7 place-items-center rounded-full bg-black/30 text-[12px]">
                {g}
              </span>
            ))}
          </div>
          <div className="absolute inset-x-3 bottom-4">
            <div className="flex items-center gap-2 text-[10px] text-white">
              <span className="size-5 rounded-full bg-white/30" />
              <span className="font-medium">yourbrand</span>
              <span className="rounded border border-white/50 px-1.5 text-[9px]">Follow</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-[#111]">
              Send us a message <span>›</span>
            </div>
            <div className="mt-2 h-[2px] overflow-hidden rounded bg-white/25">
              <div className="h-full w-[62%] bg-white" />
            </div>
          </div>
        </div>
      </PhoneFrame>
    </MockFigure>
  );
}
