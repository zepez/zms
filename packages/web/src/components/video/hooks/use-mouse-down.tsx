"use client";

import { useState, useEffect } from "react";

export const useMouseDown = (ref: React.RefObject<HTMLDivElement>) => {
  const [isMouseDown, setMouseDown] = useState(false);

  const handleMouseDown = () => setMouseDown(true);
  const handleMouseUp = () => setMouseDown(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousedown", () => handleMouseDown);
    element.addEventListener("mouseup", () => handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref]);

  return [isMouseDown, setMouseDown] as const;
};
