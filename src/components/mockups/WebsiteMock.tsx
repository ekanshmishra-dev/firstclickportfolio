import { BrowserFrame, MockFigure } from "./Frames";

/* A sample business website: the kind of site FIRST CLICK builds. */
export default function WebsiteMock({ className = "" }: { className?: string }) {
  return (
    <MockFigure label="Sample business website built by FIRST CLICK, shown in a browser window" className={className}>
      <BrowserFrame url="yourbrand.in" className="h-full">
        <div className="relative bg-[#f6f3ee] text-[#1c1a17]">
          <div className="flex items-center justify-between px-5 py-3.5 text-[11px]">
            <span className="font-display text-[14px] font-semibold tracking-tight">Your Brand</span>
            <div className="hidden gap-4 text-[#6b665e] sm:flex">
              <span>Services</span>
              <span>Pricing</span>
              <span>Reviews</span>
            </div>
            <span className="rounded-full bg-[#1c1a17] px-3 py-1 text-[10px] text-white">Book now</span>
          </div>
          <div className="grid grid-cols-5 gap-4 px-5 pb-5 pt-3">
            <div className="col-span-3 flex flex-col justify-center">
              <p className="font-display text-[clamp(18px,2.1vw,28px)] font-semibold leading-[1.02] tracking-[-0.03em]">
                Book your next visit in under a minute.
              </p>
              <p className="mt-2 max-w-[90%] text-[10.5px] leading-snug text-[#6b665e]">Online booking, clear pricing and instant WhatsApp confirmation.</p>
              <div className="mt-3.5 flex gap-2">
                <span className="rounded-full bg-[#5b3df5] px-3 py-1.5 text-[10px] font-medium text-white">Book appointment</span>
                <span className="rounded-full border border-[#d9d3c8] px-3 py-1.5 text-[10px]">View services</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#e3ddd2]">
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[#d4a373]" />
                <div className="absolute bottom-0 left-3 h-[62%] w-[58%] rounded-t-full bg-[#b5838d]" />
                <div className="absolute bottom-0 right-3 h-[40%] w-[34%] rounded-t-[999px] bg-[#6d597a]" />
                <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/90 p-2 text-[9px] shadow-sm">
                  <p className="font-semibold">Next free slot</p>
                  <p className="text-[#6b665e]">Today · 4:30 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5 border-t border-[#e6e0d6] px-5 py-4 text-[10px]">
            {["Consultation", "Signature service", "Monthly plan"].map((t, i) => (
              <div key={t} className="rounded-lg bg-white p-2.5">
                <div className="mb-2 h-1.5 w-6 rounded-full" style={{ background: ["#5b3df5", "#d4a373", "#6d597a"][i] }} />
                <p className="font-semibold">{t}</p>
                <p className="text-[#8a847a]">From ₹{[499, 1499, 3999][i]}</p>
              </div>
            ))}
          </div>
        </div>
      </BrowserFrame>
    </MockFigure>
  );
}
