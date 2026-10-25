import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { getGalleryPhotos, saveGalleryPhoto, resetGalleryPhotosToDefault, GalleryPhoto } from "../services/db";

const FF = {
  display: { fontFamily: "'Bricolage Grotesque', sans-serif" },
  body: { fontFamily: "'Inter', sans-serif" },
};

const DEFAULT_PIN = "admin123";

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activeSlotId, setActiveSlotId] = useState<string>("img1");
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Load photos on mount
  useEffect(() => {
    const data = getGalleryPhotos();
    setPhotos(data);
    const initial = data.find((p) => p.id === activeSlotId) || data[0];
    if (initial) setEditingPhoto({ ...initial });
  }, []);

  // Update active editing slot when activeSlotId changes
  useEffect(() => {
    const current = photos.find((p) => p.id === activeSlotId);
    if (current) {
      setEditingPhoto({ ...current });
    }
  }, [activeSlotId, photos]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN || pinInput === "admin") {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveCurrentSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    const updatedList = saveGalleryPhoto(editingPhoto);
    setPhotos(updatedList);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditingPhoto({
          ...editingPhoto,
          imageUrl: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all 5 photos to default?")) {
      const resetData = resetGalleryPhotosToDefault();
      setPhotos(resetData);
      const current = resetData.find((p) => p.id === activeSlotId) || resetData[0];
      setEditingPhoto({ ...current });
    }
  };

  // Render PIN login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#08080c] flex items-center justify-center p-6 selection:bg-purple-600 selection:text-white">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕ Exit
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 border border-purple-300/40 shadow-lg animate-pulse">
              <span className="text-2xl">🔑</span>
            </div>
            <h2 className="font-black text-[26px] text-white text-3d mb-1" style={FF.display}>
              FIRST CLICK ADMIN
            </h2>
            <p className="text-[12px] font-mono text-purple-300" style={FF.body}>
              Enter PIN to access photo database management panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-2 font-bold">
                Admin Passcode / PIN
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPin ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Admin PIN"
                  className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-[#080812] border border-purple-500/40 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-purple-400 transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 text-purple-400/70 hover:text-purple-300 p-1 transition-colors cursor-pointer"
                  title={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {pinError && (
                <p className="text-red-400 text-[11px] font-mono mt-2 text-center font-bold">
                  ⚠️ Invalid PIN. Access denied.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[12px] font-mono uppercase font-bold tracking-widest transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
            >
              Unlock Admin Portal →
            </button>
          </form>

          <p className="text-center text-[10px] font-mono text-white/40 mt-6 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-purple-400" /> Protected Admin Access
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#08080c] overflow-y-auto selection:bg-purple-600 selection:text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#090914]/90 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-white text-lg font-bold">
              🔑
            </div>
            <div>
              <h1 className="font-bold text-[18px] text-white text-3d" style={FF.display}>
                FIRST CLICK Photo Database Admin
              </h1>
              <p className="text-[10px] font-mono text-purple-300">
                5 Photo Slots Control Engine (IMG1 - IMG5)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              🔄 Reset Default Photos
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <span>View Live Website →</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-[1280px] mx-auto p-6 md:p-10">
        {/* Slot Selector Buttons */}
        <div className="mb-8">
          <label className="block text-[11px] font-mono text-purple-400 uppercase tracking-widest mb-3 font-bold">
            Select Photo Slot to Edit (IMG1 – IMG5)
          </label>
          <div className="grid grid-cols-5 gap-3">
            {photos.map((p) => {
              const isSelected = p.id === activeSlotId;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveSlotId(p.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-purple-900/40 border-purple-400 text-white shadow-xl ring-2 ring-purple-500/50"
                      : "bg-[#0e0e1a] border-purple-500/20 text-white/60 hover:text-white hover:border-purple-500/40"
                  }`}
                >
                  <span className="text-[12px] font-mono font-bold text-purple-300 mb-1">
                    {p.label}
                  </span>
                  <span className="text-[11px] font-medium truncate font-sans text-white/90">
                    {p.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor & Live Preview Grid */}
        {editingPhoto && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Editor Form (Left 7 Columns) */}
            <div className="lg:col-span-7 glass-card rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-2xl">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-4 mb-6">
                <h2 className="font-bold text-[20px] text-white text-3d" style={FF.display}>
                  Edit Slot Details: <span className="text-purple-400">{editingPhoto.label}</span>
                </h2>
                <span className="text-[10px] font-mono text-purple-300/80 bg-purple-950/60 px-3 py-1 rounded-md border border-purple-500/30">
                  SLOT ID: {editingPhoto.id.toUpperCase()}
                </span>
              </div>

              {savedSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-mono text-[12px] flex items-center justify-between animate-fadeIn">
                  <span>✓ Photo slot {editingPhoto.label} saved successfully to Database!</span>
                  <span className="text-[10px]">SYNCED LIVE</span>
                </div>
              )}

              <form onSubmit={handleSaveCurrentSlot} className="space-y-5">
                {/* Image Input Options */}
                <div className="space-y-3 p-4 rounded-2xl bg-[#080812] border border-purple-500/20">
                  <label className="block text-[11px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                    1. Photo Image Source
                  </label>

                  {/* Direct File Upload */}
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 mb-1">
                      Option A: Upload Local Image File from Computer
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-[12px] text-white/80 font-mono file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-mono file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                    />
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="flex-shrink mx-4 text-[9px] font-mono text-white/40 uppercase">OR</span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>

                  {/* Direct Image URL */}
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 mb-1">
                      Option B: Direct Image Web URL (Unsplash, CDN, etc)
                    </label>
                    <input
                      type="text"
                      value={editingPhoto.imageUrl}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e1a] border border-purple-500/30 text-white text-[12px] font-mono focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-[11px] font-mono text-purple-400 uppercase tracking-widest mb-1.5 font-bold">
                    2. Showcase Title
                  </label>
                  <input
                    type="text"
                    value={editingPhoto.title}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                    placeholder="e.g. NextGen Web Portal"
                    className="w-full px-4 py-3 rounded-xl bg-[#080812] border border-purple-500/30 text-white font-medium text-[14px] focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Category Input */}
                <div>
                  <label className="block text-[11px] font-mono text-purple-400 uppercase tracking-widest mb-1.5 font-bold">
                    3. Category / Tag
                  </label>
                  <input
                    type="text"
                    value={editingPhoto.category}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                    placeholder="e.g. Website Development, E-Commerce, Mobile App"
                    className="w-full px-4 py-3 rounded-xl bg-[#080812] border border-purple-500/30 text-white text-[13px] font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-[11px] font-mono text-purple-400 uppercase tracking-widest mb-1.5 font-bold">
                    4. Project Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingPhoto.description}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                    placeholder="Provide details about this project/service deliverable..."
                    className="w-full px-4 py-3 rounded-xl bg-[#080812] border border-purple-500/30 text-white text-[13px] leading-relaxed focus:outline-none focus:border-purple-400 font-sans"
                  />
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[12px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
                  >
                    💾 Save Changes to Slot {editingPhoto.label}
                  </button>

                  <span className="text-[10px] font-mono text-white/40">
                    Saves directly to Local DB
                  </span>
                </div>
              </form>
            </div>

            {/* Live Preview Column (Right 5 Columns) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card rounded-3xl p-6 border border-purple-500/30 shadow-2xl">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-4">
                  <span className="text-[10px] font-mono uppercase text-purple-300 font-bold tracking-wider">
                    🖼️ LIVE WEBSITE CARD PREVIEW ({editingPhoto.label})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                {/* Simulated Card Preview */}
                <div className="rounded-2xl overflow-hidden border border-purple-500/40 bg-[#0e0e1a] shadow-xl">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={editingPhoto.imageUrl}
                      alt={editingPhoto.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&auto=format";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-[#0e0e1a]/40 to-transparent opacity-80" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-mono font-bold px-2.5 py-1 rounded bg-black/80 text-purple-300 border border-purple-500/50">
                        {editingPhoto.label}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-200 border border-purple-400/30">
                        {editingPhoto.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-[16px] text-white" style={FF.display}>
                      {editingPhoto.title || "Untitled Showcase"}
                    </h3>
                    <p className="text-[11px] text-[#8a88ab] leading-relaxed line-clamp-3" style={FF.body}>
                      {editingPhoto.description || "No description provided yet."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-[11px] font-mono text-purple-300/80 space-y-2">
                <p className="font-bold text-white">💡 Admin Direct Access Info:</p>
                <p>• Access URL anytime by adding <code className="text-purple-300 font-bold bg-black/40 px-1.5 py-0.5 rounded">/admin</code> to your site URL.</p>
                <p>• You can also click the <code className="text-purple-300 font-bold bg-black/40 px-1.5 py-0.5 rounded">Admin 🔑</code> button in the navigation header.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
