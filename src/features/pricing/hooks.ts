import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "../../lib/useReducedMotion";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* Tweens a number to its new value (ease-out), so prices and totals roll instead of jumping. */
export function useCountUp(value: number, duration = 650): number {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      const v = Math.round(a + (value - a) * eased);
      setShown(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);

  return shown;
}

/* Measures the active child inside a container so a highlight can slide to it. */
export function useGlider(container: RefObject<HTMLElement | null>, activeSelector: string, deps: unknown[]) {
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = container.current?.querySelector<HTMLElement>(activeSelector);
      setBox(el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return box;
}
