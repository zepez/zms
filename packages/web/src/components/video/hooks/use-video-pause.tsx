"use client";

import { useState } from "react";

export const useVideoPause = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  const setVideoPaused = (paused: boolean) => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    paused ? video.pause() : video.play();
    setIsVideoPaused(paused);
  };

  const toggleVideoPaused = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (video.paused) {
      video.play();
      setIsVideoPaused(false);
    } else {
      video.pause();
      setIsVideoPaused(true);
    }
  };

  return {
    isVideoPaused,
    setVideoPaused,
    toggleVideoPaused,
  } as const;
};
