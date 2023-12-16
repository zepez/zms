"use client";

import { useState, useEffect, type MouseEvent } from "react";
import { useVideoContext } from "~/providers";

export const Progress = () => {
  const { videoRef } = useVideoContext();
  const [progress, setProgress] = useState(0);
  const [hoverProgress, setHoverProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);

  useEffect(() => {
    if (!videoRef?.current) return;

    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const value = (video.currentTime / video.duration) * 100;
      setProgress(value);

      const bufferedRanges = video.buffered;
      let maxBufferedEnd = 0;

      for (let i = 0; i < bufferedRanges.length; i++) {
        if (bufferedRanges.end(i) > maxBufferedEnd) {
          maxBufferedEnd = bufferedRanges.end(i);
        }
      }

      const bufferedValue = (maxBufferedEnd / video.duration) * 100;
      setBufferProgress(bufferedValue);
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      if (video) video.removeEventListener("timeupdate", updateProgress);
    };
  }, [videoRef]);

  const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef?.current) return;

    const video = videoRef.current;
    if (!video) return;

    const percent = e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
    video.currentTime = percent * video.duration;
  };

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - boundingRect.left;
    const hoverWidth = (mouseX / boundingRect.width) * 100;
    setHoverProgress(hoverWidth);
  };

  const handleMouseLeave = () => {
    setHoverProgress(0);
  };

  return (
    <div
      className="bg-white relative h-2 hover:h-3 transition-height duration-200 ease-in-out w-full rounded-sm hover:cursor-pointer"
      onClick={handleProgressBarClick}
      onMouseMove={handleHover}
      onDrag={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="bg-zinc-300 h-full absolute rounded-sm"
        style={{ width: `${bufferProgress}%` }}
      />
      <div
        className="bg-zinc-400 h-full absolute rounded-sm"
        style={{ width: `${hoverProgress}%` }}
      />
      <div
        className="bg-red-500 h-full absolute rounded-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
