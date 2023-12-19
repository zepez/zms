"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import throttle from "lodash.throttle";

type ElementRef = React.RefObject<HTMLElement> | null;
type Callback = (e: MouseEvent) => void;

export const useDrag = (elementRef: ElementRef) => {
  const [isDragging, setDragging] = useState(false);

  const onDragStart = useRef<Callback>(() => {});
  const onDragMove = useRef<Callback>(() => {});
  const onDragEnd = useRef<Callback>(() => {});

  const handleDragStart = throttle((e: Event | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(true);
    onDragStart.current(e as MouseEvent);
  }, 50);

  const handleDragStartCallback = useCallback(handleDragStart, [
    handleDragStart,
  ]);

  const handleDragMove = throttle((e: Event | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging) return;

    onDragMove.current(e as MouseEvent);
  }, 50);

  const handleDragMoveCallback = useCallback(handleDragMove, [handleDragMove]);

  const handleDragEnd = throttle((e: Event | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging) return;

    setDragging(false);
    onDragEnd.current(e as MouseEvent);
  }, 50);

  const handleDragEndCallback = useCallback(handleDragEnd, [handleDragEnd]);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    ["mousedown", "touchstart"].forEach((event) =>
      element.addEventListener(event, handleDragStartCallback),
    );
    ["mousemove", "touchmove"].forEach((event) =>
      window.addEventListener(event, handleDragMoveCallback),
    );
    ["mouseup", "touchend"].forEach((event) =>
      window.addEventListener(event, handleDragEndCallback),
    );

    return () => {
      ["mousedown", "touchstart"].forEach((event) =>
        element.removeEventListener(event, handleDragStartCallback),
      );
      ["mousemove", "touchmove"].forEach((event) =>
        window.removeEventListener(event, handleDragMoveCallback),
      );
      ["mouseup", "touchend"].forEach((event) =>
        window.removeEventListener(event, handleDragEndCallback),
      );
    };
  }, [
    elementRef,
    handleDragStartCallback,
    handleDragMoveCallback,
    handleDragEndCallback,
  ]);

  return {
    isDragging,
    onDragStart: (callback: Callback) => (onDragStart.current = callback),
    onDragMove: (callback: Callback) => (onDragMove.current = callback),
    onDragEnd: (callback: Callback) => (onDragEnd.current = callback),
  } as const;
};
