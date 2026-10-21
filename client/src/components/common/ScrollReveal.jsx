import { useEffect, useRef, useState } from "react";

const ScrollReveal = ({ children, className = "" }) => {
  const revealRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [direction] = useState(() => (Math.random() < 0.5 ? "left" : "right"));

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return undefined;

    const frameId = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      ref={revealRef}
      data-reveal-direction={direction}
      className={`scroll-reveal${isVisible ? " is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
