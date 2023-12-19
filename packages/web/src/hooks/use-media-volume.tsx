"use client";

import { useEffect } from "react";
import { useLocalStorage } from "react-use";
import type { MediaRef } from "~/types";

export const useMediaVolume = (mediaRef: MediaRef) => {
  const [mediaVolume, setMediaVolume] = useLocalStorage("zms-media-volume", 1);
  const [isMediaMuted, setMediaMuted] = useLocalStorage(
    "zms-media-muted",
    false,
  );

  useEffect(() => {
    if (!mediaRef?.current) return;
    const media = mediaRef.current;

    media.volume = isMediaMuted ? 0 : mediaVolume ?? 1;
  }, [mediaVolume, isMediaMuted, mediaRef]);

  return {
    mediaVolume: mediaVolume ?? 1,
    setMediaVolume,
    isMediaMuted: isMediaMuted ?? false,
    setMediaMuted,
  } as const;
};
