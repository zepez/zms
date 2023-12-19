"use client";

import { useState, useEffect } from "react";
import type { MediaRef } from "~/types";

export const useMediaProgress = (mediaRef: MediaRef) => {
  const [mediaCurrentTime, setMediaCurrentTimeState] = useState(0);
  const [mediaCurrentPercent, setMediaCurrentPercent] = useState(0);
  const [mediaBufferPercent, setMediaBufferPercent] = useState(0);
  const [mediaTotalTime, setMediaTotalTime] = useState(0);

  const setMediaCurrentTime = (time: number) => {
    if (!mediaRef?.current) return;
    const media = mediaRef.current;

    if (time === Infinity || isNaN(time)) return;
    if (time < 0) time = 0;
    media.currentTime = time;
  };

  const offsetMediaTime = (offsetSeconds: number) => {
    if (!mediaRef?.current) return;
    const media = mediaRef.current;

    media.currentTime = media.currentTime + offsetSeconds;
  };

  useEffect(() => {
    if (!mediaRef?.current) return;
    const media = mediaRef.current;

    const updateProgress = () => {
      setMediaCurrentTimeState(media.currentTime);
      setMediaCurrentPercent((media.currentTime / media.duration) * 100);
      setMediaTotalTime(media.duration);

      const bufferedRanges = media.buffered;
      let maxBufferedEnd = 0;

      for (let i = 0; i < bufferedRanges.length; i++) {
        if (bufferedRanges.end(i) > maxBufferedEnd) {
          maxBufferedEnd = bufferedRanges.end(i);
        }
      }

      setMediaBufferPercent((maxBufferedEnd / media.duration) * 100);
    };

    media.addEventListener("timeupdate", updateProgress);

    return () => {
      if (media) media.removeEventListener("timeupdate", updateProgress);
    };
  }, [mediaRef]);

  return {
    mediaCurrentTime,
    setMediaCurrentTime,
    mediaCurrentPercent,
    mediaBufferPercent,
    mediaTotalTime,
    offsetMediaTime,
  } as const;
};
