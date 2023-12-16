"use client";

import { useState, useEffect } from "react";
import { useVideoContext } from "~/providers";

export const TimeCodes = () => {
  const { videoRef } = useVideoContext();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const secondsToTime = (seconds: number | null) => {
    if (!seconds) return "00:00:00";

    var date = new Date(0);

    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  useEffect(() => {
    if (!videoRef?.current) return;

    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      if (video) video.removeEventListener("timeupdate", updateProgress);
    };
  }, [videoRef]);

  return (
    <p className="whitespace-nowrap">
      {secondsToTime(currentTime)} / {secondsToTime(duration)}
    </p>
  );
};
