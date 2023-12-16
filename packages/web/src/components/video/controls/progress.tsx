"use client";

import { useState } from "react";
import { useVideoContext } from "~/providers";

export const Progress = () => {
  const {
    progressBarRef,
    streamCurrentPercent,
    streamBufferPercent,
    handleProgressBarDrag,
  } = useVideoContext();
  const [hoverProgress, setHoverProgress] = useState(0);

  const updateVideoBufferTime = (e: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - boundingRect.left;
    const hoverWidth = (mouseX / boundingRect.width) * 100;
    setHoverProgress(hoverWidth);
  };

  const resetVideoBufferTime = () => {
    setHoverProgress(0);
  };

  return (
    <div
      className="bg-white relative h-2 hover:h-3 transition-height duration-200 ease-in-out w-full rounded-sm hover:cursor-pointer"
      ref={progressBarRef}
      onClick={handleProgressBarDrag}
      onMouseMove={updateVideoBufferTime}
      onMouseLeave={resetVideoBufferTime}
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
