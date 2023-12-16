import { useState, useEffect } from "react";
import { Pause as PauseIcon, Play as PlayIcon } from "lucide-react";
import { useVideoContext } from "~/providers";

export const Pause = () => {
  const { videoRef } = useVideoContext();
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (!videoRef?.current) return;

    const video = videoRef.current;
    const handlePlay = () => setPaused(false);
    const handlePause = () => setPaused(true);

    if (video) {
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
    }

    return () => {
      if (video) {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
      }
    };
  }, [videoRef]);

  return (
    <button className="p-2" title={paused ? "Play" : "Pause"}>
      {paused ? (
        <PlayIcon size={40} fill="white" />
      ) : (
        <PauseIcon size={40} fill="white" />
      )}
    </button>
  );
};
