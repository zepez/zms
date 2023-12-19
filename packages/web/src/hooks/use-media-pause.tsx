"use client";

import { useState } from "react";
import type { MediaRef } from "~/types";

export const useMediaPause = (mediaRef: MediaRef) => {
  const [isMediaPaused, setIsMediaPaused] = useState(true);

  const setMediaPaused = (paused: boolean) => {
    if (!mediaRef?.current) return;
    const media = mediaRef.current;

    paused ? media.pause() : media.play();
    setIsMediaPaused(paused);
  };

  const toggleMediaPaused = () => {
    if (!mediaRef?.current) return;
    const media = mediaRef.current;

    if (media.paused) {
      media.play();
      setIsMediaPaused(false);
    } else {
      media.pause();
      setIsMediaPaused(true);
    }
  };

  return {
    isMediaPaused,
    setMediaPaused,
    toggleMediaPaused,
  } as const;
};
