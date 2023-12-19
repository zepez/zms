"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type ElementRef = React.RefObject<HTMLElement> | null;
type Callback = (e: MouseEvent) => void;

export const useDrag = (elementRef: ElementRef) => {
  const [isDragging, setDragging] = useState(false);

  const onDragStart = useRef<Callback>(() => {});
  const onDragMove = useRef<Callback>(() => {});
  const onDragEnd = useRef<Callback>(() => {});

  const handleDragStart = useCallback(
    (e: Event | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragging(true);
      onDragStart.current(e as MouseEvent);
    },
    [onDragStart],
  );

  const handleDragMove = useCallback(
    (e: Event | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isDragging) return;

      onDragMove.current(e as MouseEvent);
    },
    [onDragMove, isDragging],
  );

  const handleDragEnd = useCallback(
    (e: Event | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragging(false);
      onDragEnd.current(e as MouseEvent);
    },
    [onDragEnd],
  );

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    ["mousedown", "touchstart"].forEach((event) =>
      element.addEventListener(event, handleDragStart),
    );
    ["mousemove", "touchmove"].forEach((event) =>
      window.addEventListener(event, handleDragMove),
    );
    ["mouseup", "touchend"].forEach((event) =>
      window.addEventListener(event, handleDragEnd),
    );

    return () => {
      ["mousedown", "touchstart"].forEach((event) =>
        element.removeEventListener(event, handleDragStart),
      );
      ["mousemove", "touchmove"].forEach((event) =>
        window.removeEventListener(event, handleDragMove),
      );
      ["mouseup", "touchend"].forEach((event) =>
        window.removeEventListener(event, handleDragEnd),
      );
    };
  }, [elementRef, handleDragStart, handleDragMove, handleDragEnd]);

  return {
    isDragging,
    onDragStart: (callback: Callback) => (onDragStart.current = callback),
    onDragMove: (callback: Callback) => (onDragMove.current = callback),
    onDragEnd: (callback: Callback) => (onDragEnd.current = callback),
  } as const;
};
