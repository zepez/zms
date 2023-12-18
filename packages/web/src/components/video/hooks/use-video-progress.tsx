"use client";

import { useState, useEffect } from "react";

export const useVideoProgress = (
  videoRef: React.RefObject<HTMLVideoElement>,
) => {
  const [videoCurrentTime, setVideoCurrentTimeState] = useState(0);
  const [videoCurrentPercent, setVideoCurrentPercent] = useState(0);
  const [videoBufferTime, setVideoBufferTime] = useState(0);
  const [videoBufferPercent, setVideoBufferPercent] = useState(0);
  const [videoTotalTime, setVideoTotalTime] = useState(0);

  const setVideoCurrentTime = (time: number) => {
    if (!videoRef?.current) return;
    const video = videoRef.current;

    if (time < 0 || isNaN(time)) time = 0;
    video.currentTime = time;
  };

  const offsetVideoTime = (offsetSeconds: number) => {
    if (!videoRef?.current) return;
    const video = videoRef.current;

    video.currentTime = video.currentTime + offsetSeconds;
  };

  useEffect(() => {
    if (!videoRef?.current) return;
    const video = videoRef.current;

    const updateProgress = () => {
      setVideoCurrentTimeState(video.currentTime);
      setVideoCurrentPercent((video.currentTime / video.duration) * 100);
      setVideoTotalTime(video.duration);

      const bufferedRanges = video.buffered;
      let maxBufferedEnd = 0;

      for (let i = 0; i < bufferedRanges.length; i++) {
        if (bufferedRanges.end(i) > maxBufferedEnd) {
          maxBufferedEnd = bufferedRanges.end(i);
        }
      }

      setVideoBufferTime(maxBufferedEnd);
      setVideoBufferPercent((maxBufferedEnd / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      if (video) video.removeEventListener("timeupdate", updateProgress);
    };
  }, [videoRef]);

  return {
    videoCurrentTime,
    setVideoCurrentTime,
    videoCurrentPercent,
    videoBufferTime,
    videoBufferPercent,
    videoTotalTime,
    offsetVideoTime,
  } as const;
};
