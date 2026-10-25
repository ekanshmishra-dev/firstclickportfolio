import { useState, useEffect } from "react";
import { getGalleryPhotos, subscribeToGalleryUpdates, GalleryPhoto } from "../services/db";

const FF = {
  display: { fontFamily: "'Bricolage Grotesque', sans-serif" },
  body: { fontFamily: "'Inter', sans-serif" },
};

interface PhotoShowcaseGalleryProps {
  onOpenAdmin?: () => void;
}

export function PhotoShowcaseGallery({ onOpenAdmin }: PhotoShowcaseGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activePhotoModal, setActivePhotoModal] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    setPhotos(getGalleryPhotos());
    const unsubscribe = subscribeToGalleryUpdates(() => {
      setPhotos(getGalleryPhotos());
    });
    return unsubscribe;
  }, []);

  return (
    <section id="gallery" className="py-24 md:py-32 px-6 md:px-12 border-t border-[#1c1c2e] bg-[#08080c] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none z-0" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono tracking-[0.2em] uppercase mb-4">
              <span>✦ CLIENT PARTNERSHIPS & WORK</span>
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight text-white text-3d"
              style={{ ...FF.display, fontSize: "clamp(34px, 4.5vw, 56px)" }}
            >
              Featured Client <span className="text-gradient">Portfolio.</span>
            </h2>
            <p className="text-[15px] text-[#8a88ab] leading-relaxed max-w-xl mt-3" style={FF.body}>
              Explore our real client projects, custom website developments, and high-impact social media management campaigns.
            </p>
          </div>
        </div>

        {/* 4-Client Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 perspective-container">
          {photos.map((photo, idx) => {
            return (
              <div
                key={photo.id || idx}
                onClick={() => setActivePhotoModal(photo)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer card-3d-clean preserve-3d flex flex-col justify-between border border-purple-500/20 hover:border-purple-500/60 bg-[#0e0e1a] shadow-xl transition-all duration-500"
              >
                {/* Image & Overlay */}
                <div className="overflow-hidden relative preserve-3d aspect-[16/10]">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&auto=format";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-[#0e0e1a]/30 to-transparent opacity-85 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

                  {/* Slot Label Badge */}
                  <div className="absolute top-4 left-4 preserve-3d pointer-events-none" style={{ transform: "translateZ(30px)" }}>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-md bg-black/80 text-purple-300 border border-purple-500/50 shadow-md font-bold">
                      {photo.label || `CLIENT ${idx + 1}`}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-4 right-4 preserve-3d pointer-events-none" style={{ transform: "translateZ(30px)" }}>
                    <span className="text-[9px] font-mono px-2.5 py-1 rounded-md bg-purple-950/90 text-purple-200 border border-purple-400/40 backdrop-blur-md font-semibold">
                      {photo.category}
                    </span>
                  </div>
                </div>

                {/* Card Info Footer */}
                <div className="p-6 flex flex-col flex-1 justify-between preserve-3d" style={{ transform: "translateZ(20px)" }}>
                  <div>
                    <h3 className="font-bold text-[20px] text-white mb-2 text-3d group-hover:text-purple-300 transition-colors" style={FF.display}>
                      {photo.title}
                    </h3>
                    <p className="text-[13px] text-[#8a88ab] leading-relaxed line-clamp-2" style={FF.body}>
                      {photo.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-purple-500/15 flex items-center justify-between text-[11px] font-mono text-purple-400 group-hover:text-purple-300">
                    <span>VIEW FULL CLIENT DETAILS</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">🔍 ↗</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Photo View Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300 animate-fadeIn"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative w-full max-w-4xl glass-card rounded-3xl p-6 md:p-8 border border-purple-500/40 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 rounded-2xl overflow-hidden border border-purple-500/30">
                <img
                  src={activePhotoModal.imageUrl}
                  alt={activePhotoModal.title}
                  className="w-full h-auto max-h-[460px] object-cover"
                />
              </div>

              <div className="md:col-span-5 space-y-4">
                <div className="inline-block px-3 py-1 rounded-md bg-purple-950/80 text-purple-300 text-[10px] font-mono border border-purple-500/40">
                  {activePhotoModal.label} • {activePhotoModal.category}
                </div>

                <h3 className="font-bold text-[24px] text-white text-3d" style={FF.display}>
                  {activePhotoModal.title}
                </h3>

                <p className="text-[14px] text-[#9490b8] leading-relaxed" style={FF.body}>
                  {activePhotoModal.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
