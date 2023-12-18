"use client";

import { useVideoContext } from "~/components/video/context";
import { Video } from "~/components";
import { cn } from "~/lib";

export const Player = () => {
  const { videoRef, streamLoading, streamError } = useVideoContext();

  if (streamError) return <Video.Error message={streamError} />;

  return (
    <Video.Layout>
      {streamLoading && (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white rounded-full w-12 h-12 flex animate-spin">
            <div className="bg-black w-11 h-11 rounded-full" />
          </div>
          <p>Loading...</p>
        </div>
      )}
      <div className={cn("relative w-full h-full", streamLoading && "hidden")}>
        <Video.Controls />
        <video ref={videoRef} className="w-full h-full">
          Your browser does not support HLS video.
        </video>
      </div>
    </Video.Layout>
  );
};
