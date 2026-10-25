import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Work from "./pages/Work";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { FEATURES } from "./features";

/* Route table, shared by the browser app and the build-time prerender (entry-server.tsx). */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="work" element={<Work />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        {FEATURES.map((f) => (
          <Route key={f.seo.path} path={f.seo.path.slice(1)} element={f.element} />
        ))}
        {/* Internal tools open as overlays on top of the home page */}
        {["admin", "employee", "portal", "attendance", "brochure"].map((p) => (
          <Route key={p} path={p} element={<Home />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
}
