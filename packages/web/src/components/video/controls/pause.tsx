import { Pause as PauseIcon, Play as PlayIcon } from "lucide-react";
import { useVideoContext } from "~/components/video/context";

export const Pause = () => {
  const { isMediaPaused, toggleMediaPaused } = useVideoContext();

  return (
    <button
      className="p-2"
      onClick={toggleMediaPaused}
      title={isMediaPaused ? "Play" : "Pause"}
    >
      {isMediaPaused ? (
        <PlayIcon size={40} fill="white" />
      ) : (
        <PauseIcon size={40} fill="white" />
      )}
    </button>
  );
};
