"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

export default function RedoAnimText() {
  const textIndex = useMotionValue(0);
  const texts = ["Shall we begin writing?"];
  const containerRef = useRef(null);

  const baseText = useTransform(textIndex, (latest) => texts[latest] || "");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    baseText.get().slice(0, latest)
  );
  const updatedThisRound = useMotionValue(true);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animate(count, 60, {
          type: "tween",
          duration: 1,
          ease: "easeIn",
          repeat: undefined,
          repeatType: "reverse",
          repeatDelay: 1,
          delay: 0.2,
          onUpdate(latest) {
            if (updatedThisRound.get() === true && latest > 0) {
              updatedThisRound.set(false);
            }
          },
        });
        observer.unobserve(entry.target);
      }
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(containerRef.current);
      }
    };
  }, [containerRef, updatedThisRound, count]);

  return (
    <motion.span className="inline min-h-14" ref={containerRef}>
      {displayText}
    </motion.span>
  );
}
