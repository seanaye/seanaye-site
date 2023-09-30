import { useEffect, useMemo } from "preact/hooks";
import { signal } from "@preact/signals";
import { debounce } from "../utils/debounce.ts";

function getSize() {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
    };
  }
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return { width, height };
}

const widthSig = signal(0);
const heightSig = signal(0);
function handler() {
  const { width, height } = getSize();
  widthSig.value = width;
  heightSig.value = height;
}

/**
 * Hook for measuring the size of the document inner dimensions
 * optionally provide an amount of time to debounce by in ms
 * @param ms - the ms before recalculating, defauolts to 100ms
 */
export function useMeasureWindow(ms = 100) {
  const debouncedHandler = useMemo(() => debounce(handler, ms), [ms]);

  useEffect(() => {
    handler();
    addEventListener("resize", debouncedHandler);
    return () => {
      removeEventListener("resize", debouncedHandler);
    };
  }, [debouncedHandler]);

  return { width: widthSig, height: heightSig };
}
