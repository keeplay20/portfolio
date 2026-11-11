import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import "./CustomCursor.css";

const CustomCursor: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || reduceMotion) {
      return;
    }

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      const target = e.target as Element | null;
      const hover = Boolean(
        target?.closest(
          "a, button, [role='button'], input, textarea, select, label, .featured-card__visual"
        )
      );
      ringRef.current?.classList.toggle("custom-cursor__ring--hover", hover);
    };

    const tick = () => {
      ring.current.x += (pointer.current.x - ring.current.x) * 0.18;
      ring.current.y += (pointer.current.y - ring.current.y) * 0.18;
      dotRef.current?.style.setProperty(
        "transform",
        `translate(${pointer.current.x}px, ${pointer.current.y}px)`
      );
      ringRef.current?.style.setProperty(
        "transform",
        `translate(${ring.current.x}px, ${ring.current.y}px)`
      );
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [reduceMotion]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="custom-cursor__dot" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor__ring" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
