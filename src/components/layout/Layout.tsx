import { Suspense, createContext, lazy, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFab from "./WhatsAppFab";

// Internal tools load only when opened, keeping the public pages light.
const AdminDashboard = lazy(() => import("../AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const EmployeePortalModal = lazy(() => import("../EmployeePortalModal").then((m) => ({ default: m.EmployeePortalModal })));
const BrochureModal = lazy(() => import("../BrochureModal").then((m) => ({ default: m.BrochureModal })));

const BrochureContext =createContext<() => void>(() => {});
export const useOpenBrochure = () => useContext(BrochureContext);

/* Scroll to the top on page change, or to the #section when one is given. */
function useScrollRestore() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const id = hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname, hash]);
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEmployeePortalOpen, setIsEmployeePortalOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  useScrollRestore();

  // Same URL triggers as the original site for the internal tools.
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const search = location.search.toLowerCase();
    const hash = location.hash.toLowerCase();
    const loc = path + search + hash;
    if (path === "/admin" || search.includes("admin") || hash === "#admin") setIsAdminOpen(true);
    if (loc.includes("employee") || loc.includes("portal") || loc.includes("attendance")) setIsEmployeePortalOpen(true);
    if (loc.includes("brochure")) setIsBrochureOpen(true);
  }, [location.pathname, location.search, location.hash]);

  const openBrochure = () => {
    setIsBrochureOpen(true);
    window.history.pushState(null, "", `${location.pathname}#brochure`);
  };

  const closeBrochure = () => {
    setIsBrochureOpen(false);
    if (window.location.hash === "#brochure") window.history.pushState(null, "", window.location.pathname);
  };

  return (
    <BrochureContext.Provider value={openBrochure}>
      <div className="relative min-h-screen overflow-x-clip bg-ground text-ink">
        <Navbar />
        <main id="main">
          <Outlet />
        </main>
        <Footer onOpenBrochure={openBrochure} />
        <WhatsAppFab />
      </div>

      <Suspense fallback={null}>
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => {
            setIsAdminOpen(false);
            navigate("/");
          }}
        />
      )}

      {isEmployeePortalOpen && (
        <EmployeePortalModal
          onClose={() => {
            setIsEmployeePortalOpen(false);
            const loc = (window.location.pathname + window.location.hash).toLowerCase();
            if (loc.includes("employee") || loc.includes("portal") || loc.includes("attendance")) navigate("/");
          }}
        />
      )}

      {isBrochureOpen && <BrochureModal isOpen onClose={closeBrochure} />}
      </Suspense>
    </BrochureContext.Provider>
  );
}
