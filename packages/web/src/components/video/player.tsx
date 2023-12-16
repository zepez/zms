"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Video } from "~/components";
import { cn } from "~/lib";

interface Props {
  src: string;
}

export const Player = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const errorHandler = (message: string) => {
    console.error(message);
    setError(message);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(props.src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) =>
        errorHandler(`${data.type}, ${data.details}`),
      );

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        console.log(`Level switched: ${level.width}x${level.height}`);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = props.src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((error) => errorHandler(error.message));
      });
    }

    video.addEventListener("error", () => {
      const errorMessage = video.error
        ? `Video element error: ${video.error.code}`
        : "Unknown video element error";
      errorHandler(errorMessage);
    });

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      video.removeEventListener("error", () => {});
    };
  }, [props.src]);

  if (error) return <Video.Error message={error} />;

  return (
    <Video.Layout>
      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white rounded-full w-12 h-12 flex animate-spin">
            <div className="bg-black w-11 h-11 rounded-full" />
          </div>
          <p>Loading...</p>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        className={cn("w-full h-full", loading && "hidden")}
      />
    </Video.Layout>
  );
};
