import { useEffect, useRef, useState } from "react";

/**
 * PortfolioCursor — correct classic cursor arrowhead shape (no stem).
 * Shape: tip top-left, left edge straight down, concave notch on right side.
 * Palette: soft frosted blue to match the portfolio aesthetic.
 */
export default function PortfolioCursor() {
  const cursorRef = useRef(null);
  const target    = useRef({ x: -300, y: -300 });
  const current   = useRef({ x: -300, y: -300 });
  const raf       = useRef(null);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const SELECTORS = "a, button, [role='button'], input, select, textarea, label, [tabindex]:not([tabindex='-1']), summary";
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHovering(!!el?.closest(SELECTORS));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const down = () => setClicking(true);
    const up   = () => setClicking(false);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup",   up);
    return () => {
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup",   up);
    };
  }, []);

  useEffect(() => {
    const loop = () => {
      const lp = 0.22;
      current.current.x += (target.current.x - current.current.x) * lp;
      current.current.y += (target.current.y - current.current.y) * lp;
      if (cursorRef.current) {
        const scale = clicking ? 0.80 : hovering ? 1.15 : 1;
        cursorRef.current.style.transform =
          `translate(${current.current.x}px, ${current.current.y}px) scale(${scale})`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [clicking, hovering]);

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        .pc-wrap {
          position: fixed;
          top: 0; left: 0;
          margin-left: -2px;
          margin-top:  -2px;
          width: 28px; height: 34px;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          transition: filter 0.18s ease;
          filter: drop-shadow(0 2px 6px rgba(80,120,210,0.30));
        }
        .pc-wrap.hovering {
          filter: drop-shadow(0 3px 12px rgba(80,120,210,0.60));
        }
        .pc-wrap.clicking {
          filter: drop-shadow(0 1px 3px rgba(80,120,210,0.85));
        }
      `}</style>

      <div
        ref={cursorRef}
        className={`pc-wrap${hovering ? " hovering" : ""}${clicking ? " clicking" : ""}`}
      >
        <svg
          width="28" height="34"
          viewBox="0 0 28 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pcg-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.97"/>
              <stop offset="100%" stopColor="#d0e4ff" stopOpacity="0.92"/>
            </linearGradient>

            <linearGradient id="pcg-b" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#b3ccf8" stopOpacity="0.88"/>
              <stop offset="100%" stopColor="#6d9ef0" stopOpacity="0.85"/>
            </linearGradient>
          </defs>

          <polygon
            points="2,2 2,28 10,21 20,28 2,2"
            fill="url(#pcg-a)"
          />

          <polygon
            points="2,2 10,21 20,28 2,2"
            fill="url(#pcg-b)"
            opacity="0.85"
          />

          <polygon
            points="2,2 2,28 10,21 20,28"
            fill="none"
            stroke="#1e2340"
            strokeWidth="1.7"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <line
            x1="2" y1="2"
            x2="10" y2="21"
            stroke="#4a68c8"
            strokeWidth="0.8"
            opacity="0.4"
          />

          <circle cx="2.8" cy="2.8" r="1.3" fill="white" opacity="0.85"/>
        </svg>
      </div>
    </>
  );
}
