import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useVideoContext } from "~/providers";

export const Volume = () => {
  const { videoRef } = useVideoContext();
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!videoRef?.current) return;
    videoRef.current.volume = volume;
  }, [volume, videoRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setVolume(Number(e.target.value));
  };

  const handleIconClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setVolume(volume === 0 ? 1 : 0);
  };

  return (
    <div className="cursor-pointer flex gap-4 pl-3">
      {volume > 0 ? (
        <Volume2 className="cursor-pointer" onClick={handleIconClick} />
      ) : (
        <VolumeX className="cursor-pointer" onClick={handleIconClick} />
      )}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:p-1"
        aria-label="Volume control"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
