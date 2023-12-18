import { Pause as PauseIcon, Play as PlayIcon } from "lucide-react";
import { useVideoContext } from "~/components/video/context";

export const Pause = () => {
  const { isVideoPaused } = useVideoContext();

  return (
    <button className="p-2" title={isVideoPaused ? "Play" : "Pause"}>
      {isVideoPaused ? (
        <PlayIcon size={40} fill="white" />
      ) : (
        <PauseIcon size={40} fill="white" />
      )}
    </button>
  );
};
