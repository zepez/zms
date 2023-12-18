"use client";

import { useEffect } from "react";
import { useLocalStorage } from "react-use";

export const useVideoVolume = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [videoVolume, setVideoVolume] = useLocalStorage("zms-video-volume", 1);
  const [isVideoMuted, setVideoMuted] = useLocalStorage(
    "zms-video-muted",
    false,
  );

  useEffect(() => {
    if (!videoRef?.current) return;
    const video = videoRef.current;

    video.volume = isVideoMuted ? 0 : videoVolume ?? 1;
  }, [videoVolume, isVideoMuted, videoRef]);

  return {
    videoVolume: videoVolume ?? 1,
    setVideoVolume,
    isVideoMuted: isVideoMuted ?? false,
    setVideoMuted,
  } as const;
};
