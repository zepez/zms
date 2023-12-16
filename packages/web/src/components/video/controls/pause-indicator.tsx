import { useState, useEffect } from "react";
import { Pause as PauseIcon, Play as PlayIcon } from "lucide-react";
import { useVideoContext } from "~/providers";
import { cn } from "~/lib";

export const PauseIndicator = () => {
  const [paused, setPaused] = useState(true);
  const { videoRef } = useVideoContext();

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
    <div
      className={cn(
        "bg-zinc-800 opacity-70 w-32 h-32 flex justify-center items-center rounded-full transition-all duration-100",
        paused ? "opacity-70 scale-100" : "opacity-0 scale-0",
      )}
    >
      {paused ? (
        <PlayIcon size={50} fill="white" />
      ) : (
        <PauseIcon size={50} fill="white" />
      )}
    </div>
  );
};
