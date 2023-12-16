import { Pause as PauseIcon, Play as PlayIcon } from "lucide-react";
import { useVideoContext } from "~/providers";

export const Pause = () => {
  const { streamPaused } = useVideoContext();

  return (
    <button className="p-2" title={streamPaused ? "Play" : "Pause"}>
      {streamPaused ? (
        <PlayIcon size={40} fill="white" />
      ) : (
        <PauseIcon size={40} fill="white" />
      )}
    </button>
  );
};
