"use client";

import { useVideoContext } from "~/components/video/context";
import { Video } from "~/components";
import { cn } from "~/lib";

export const Player = () => {
  const { playerRef, mediaRef, streamLoading, streamError } = useVideoContext();

  return (
    <div
      ref={playerRef}
      className="select-none w-screen h-screen flex items-center justify-center bg-black"
    >
      <div className={cn("relative w-full h-full")}>
        {streamLoading || streamError ? (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10 bg-zinc-900/80">
            <Video.States />
          </div>
        ) : (
          <Video.Controls />
        )}

        <video ref={mediaRef} controls={false} className="w-full h-full">
          Your browser does not support HLS video.
        </video>
      </div>
    </div>
  );
};
