"use client";

import { useState } from "react";
import { Expand, Shrink } from "lucide-react";
import { useVideoContext } from "~/providers";

export const Fullscreen = () => {
  const { layoutRef } = useVideoContext();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    if (!layoutRef?.current) return;

    if (!document.fullscreenElement) {
      layoutRef.current.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }

    setIsFullscreen((v) => !v);
  };

  return (
    <button
      onClick={handleFullscreenToggle}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? <Shrink size={30} /> : <Expand size={30} />}
    </button>
  );
};
