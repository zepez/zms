"use client";

import { Expand, Shrink } from "lucide-react";
import { useVideoContext } from "~/components/video/context";

export const Fullscreen = () => {
  const { togglePlayerFullscreen, isPlayerFullscreen } = useVideoContext();

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    togglePlayerFullscreen();
  };

  return (
    <button
      onClick={handleFullscreenClick}
      title={isPlayerFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      className="ml-4"
    >
      {isPlayerFullscreen ? <Shrink size={30} /> : <Expand size={30} />}
    </button>
  );
};
