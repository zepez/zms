import { Pause as PauseIcon, Play as PlayIcon } from "lucide-react";
import { useVideoContext } from "~/providers";
import { cn } from "~/lib";

export const PauseIndicator = () => {
  const { streamPaused } = useVideoContext();

  return (
    <div
      className={cn(
        "bg-zinc-800 opacity-70 w-32 h-32 flex justify-center items-center rounded-full transition-all duration-100",
        streamPaused ? "opacity-70 scale-100" : "opacity-0 scale-0",
      )}
    >
      {streamPaused ? (
        <PlayIcon size={50} fill="white" />
      ) : (
        <PauseIcon size={50} fill="white" />
      )}
    </div>
  );
};
