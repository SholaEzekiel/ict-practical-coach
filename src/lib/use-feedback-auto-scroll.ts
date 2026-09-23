"use client";

import { useEffect, useRef } from "react";

export function useFeedbackAutoScroll<T extends HTMLElement>(feedback: unknown, shouldScroll: boolean) {
  const feedbackRef = useRef<T | null>(null);

  useEffect(() => {
    if (!feedback || !shouldScroll) return;
    const frame = window.requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [feedback, shouldScroll]);

  return feedbackRef;
}
