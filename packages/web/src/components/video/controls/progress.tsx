"use client";

import { useState, type MouseEvent } from "react";
import { useVideoContext } from "~/providers";

export const Progress = () => {
  const { videoRef, streamCurrentPercent, streamBufferPercent } =
    useVideoContext();
  const [hoverProgress, setHoverProgress] = useState(0);

  const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!videoRef?.current) return;
    const video = videoRef.current;

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
        style={{ width: `${streamBufferPercent}%` }}
      />
      <div
        className="bg-zinc-400 h-full absolute rounded-sm"
        style={{ width: `${hoverProgress}%` }}
      />
      <div
        className="bg-red-500 h-full absolute rounded-sm"
        style={{ width: `${streamCurrentPercent}%` }}
      />
    </div>
  );
};
