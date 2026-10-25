/* ── Persistent Local Database Engine for FIRST CLICK Gallery Photos ── */

export interface GalleryPhoto {
  id: string; // "img1", "img2", "img3", "img4", "img5"
  label: string; // "IMG1", "IMG2", "IMG3", "IMG4", "IMG5"
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  updatedAt: string;
}

const STORAGE_KEY = "fc_gallery_photos_v2";
const EVENT_KEY = "fc_gallery_updated";

export const DEFAULT_PHOTOS: GalleryPhoto[] = [
  {
    id: "img1",
    label: "CLIENT 1",
    title: "FITNESS & RHYTHM YOGA",
    category: "Website & Social Media",
    imageUrl: "/clients/fitness-rhythm-yoga.png",
    description: "Full website design, digital branding, and dynamic social media growth strategy for Fitness & Rhythm Yoga.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "img2",
    label: "CLIENT 2",
    title: "BLOSSOM NAILS STUDIO",
    category: "Social Media Management",
    imageUrl: "/clients/blossom-nails-studio.png",
    description: "Creative reel production, social media handle management, and local client acquisition for Blossom Nails Studio.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "img3",
    label: "CLIENT 3",
    title: "NJ BEAUTY SALON & TATTOO STUDIO",
    category: "Social Media Management",
    imageUrl: "/clients/nj-beauty-salon.jpg",
    description: "End-to-end salon marketing, Instagram reel campaigns, and digital booking drive for NJ Beauty Salon and Tattoo Studio.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "img4",
    label: "CLIENT 4",
    title: "GURBANI COLLECTION",
    category: "Social Media Services",
    imageUrl: "/clients/gurbani-collection.jpg",
    description: "Store promotion, short-form reel hooks, and performance marketing services for Gurbani Collection.",
    updatedAt: new Date().toISOString(),
  },
];

// Read photos from DB
export function getGalleryPhotos(): GalleryPhoto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PHOTOS));
      return DEFAULT_PHOTOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error("Error loading gallery photos from DB:", e);
  }
  return DEFAULT_PHOTOS;
}

// Save single photo
export function saveGalleryPhoto(updated: GalleryPhoto): GalleryPhoto[] {
  const current = getGalleryPhotos();
  const index = current.findIndex((p) => p.id === updated.id);
  
  let newPhotos: GalleryPhoto[];
  if (index >= 0) {
    newPhotos = [...current];
    newPhotos[index] = { ...updated, updatedAt: new Date().toISOString() };
  } else {
    newPhotos = [...current, { ...updated, updatedAt: new Date().toISOString() }];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newPhotos));
  window.dispatchEvent(new Event(EVENT_KEY));
  return newPhotos;
}

// Save all photos bulk
export function saveAllGalleryPhotos(photos: GalleryPhoto[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  window.dispatchEvent(new Event(EVENT_KEY));
}

// Reset DB to default seed photos
export function resetGalleryPhotosToDefault(): GalleryPhoto[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PHOTOS));
  window.dispatchEvent(new Event(EVENT_KEY));
  return DEFAULT_PHOTOS;
}

// Subscribe to DB changes
export function subscribeToGalleryUpdates(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(EVENT_KEY, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_KEY, handler);
    window.removeEventListener("storage", handler);
  };
}
