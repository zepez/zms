"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const events = [
  "mousemove",
  "keydown",
  "mousedown",
  "mouseup",
  "touchstart",
  "scroll",
];

export const usePlayerActive = (
  playerRef: React.RefObject<HTMLDivElement> | null,
) => {
  const activityTimer = useRef<NodeJS.Timeout>();
  const [isPlayerActive, setPlayerActive] = useState(true);
  const [isPlayerForcedActive, setPlayerForcedActive] = useState(false);

  const resetPlayerActiveTimer = useCallback(() => {
    clearTimeout(activityTimer.current);
    setPlayerActive(true);
    if (!isPlayerForcedActive) {
      activityTimer.current = setTimeout(() => setPlayerActive(false), 2000);
    }
  }, [isPlayerForcedActive, setPlayerActive]);

  useEffect(() => {
    if (!playerRef?.current) return;
    const player = playerRef.current;

    events.forEach((event) =>
      player.addEventListener(event, resetPlayerActiveTimer),
    );

    resetPlayerActiveTimer();

    return () => {
      clearTimeout(activityTimer.current);
      events.forEach((event) =>
        player.removeEventListener(event, resetPlayerActiveTimer),
      );
    };
  }, [playerRef, resetPlayerActiveTimer]);

  return {
    isPlayerActive,
    setPlayerActive,
    setPlayerForcedActive,
    resetPlayerActiveTimer,
  } as const;
};
