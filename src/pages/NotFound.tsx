import Button, { Arrow } from "../components/ui/Button";
import { usePageMeta } from "../lib/usePageMeta";

export default function NotFound() {
  usePageMeta("/404");
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="text-[15px] text-violet-soft">404</p>
      <h1 className="mt-4 text-display text-ink">This click went nowhere.</h1>
      <p className="mt-6 max-w-lg text-lead text-soft">{"The page you're looking for doesn't exist or has moved."}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button to="/">
          Back to home <Arrow />
        </Button>
        <Button to="/contact" variant="ghost">
          Contact us
        </Button>
      </div>
    </section>
  );
}
