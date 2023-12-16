"use client";

import { Expand, Shrink } from "lucide-react";
import { useVideoContext } from "~/providers";

export const Fullscreen = () => {
  const { toggleFullscreen, isFullscreen } = useVideoContext();

  return (
    <button
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? <Shrink size={30} /> : <Expand size={30} />}
    </button>
  );
};
