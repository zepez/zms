import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useVideoContext } from "~/components/video/context";

export const Volume = () => {
  const { mediaVolume, setMediaVolume, isMediaMuted, setMediaMuted } =
    useVideoContext();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="cursor-pointer flex gap-4 pl-3">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setMediaMuted(!isMediaMuted);
        }}
        title={isMediaMuted ? "Enable audio" : "Mute audio"}
        suppressHydrationWarning
      >
        {isClient && (
          <>{isMediaMuted || mediaVolume === 0 ? <VolumeX /> : <Volume2 />}</>
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMediaMuted ? 0 : mediaVolume}
        onChange={(e) => {
          console.log(e.target.value);
          e.preventDefault();
          e.stopPropagation();

          setMediaMuted(false);
          setMediaVolume(parseFloat(e.target.value));
        }}
        className="cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:p-1"
        aria-label="Volume control"
      />
    </div>
  );
};
