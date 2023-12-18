"use client";

import { useState, useEffect, useCallback } from "react";
import Hls, { type LevelSwitchedData, type Events } from "hls.js";

export const useHlsStream = (
  hlsRef: React.MutableRefObject<Hls | null>,
  videoRef: React.RefObject<HTMLVideoElement> | null,
  src: string,
) => {
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(true);

  const onStreamError = useCallback(
    (message: string) => {
      setStreamError(message);
      console.error(message);
    },
    [setStreamError],
  );

  const onManifestParsed = useCallback(() => {
    setStreamLoading(false);
  }, [setStreamLoading]);

  const onLevelSwitched = useCallback(
    (event: Events.LEVEL_SWITCHED, data: LevelSwitchedData) => {
      const level = hlsRef.current?.levels[data.level];
      if (level) {
        console.log(`Resolution changed: ${level.width}x${level.height}`);
      }
    },
    [hlsRef],
  );

  useEffect(() => {
    if (!videoRef?.current) return;
    const video = videoRef.current;

    const onHlsError = () => {
      const errorMessage = video.error
        ? `Video element error: ${video.error.code}`
        : "Unknown video element error";
      onStreamError(errorMessage);
    };

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) =>
        onStreamError(`${data.type}, ${data.details}`),
      );
      hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      hls.on(Hls.Events.LEVEL_SWITCHED, onLevelSwitched);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((error) => onStreamError(error.message));
      });
    }

    video.addEventListener("error", onHlsError);

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      video.removeEventListener("error", onHlsError);
    };
  }, [src, hlsRef, videoRef, onStreamError, onManifestParsed, onLevelSwitched]);

  return { streamLoading, streamError } as const;
};
