"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-in-up" | "fade-in" | "scale-up" | "slide-in-left" | "slide-in-right";
  delay?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
  duration = 800,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fail-safe backup timeout: make visible anyway after a short delay
    // in case intersection observer doesn't trigger or is delayed
    const backupTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(backupTimeout);
        }
      },
      {
        threshold: 0.01,
      },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      clearTimeout(backupTimeout);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getAnimationStyles = () => {
    switch (animation) {
      case "fade-in-up":
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12";
      case "fade-in":
        return isVisible ? "opacity-100" : "opacity-0";
      case "scale-up":
        return isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95";
      case "slide-in-left":
        return isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12";
      case "slide-in-right":
        return isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12";
      default:
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all cubic-bezier(0.16, 1, 0.3, 1) ease-out",
        getAnimationStyles(),
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
