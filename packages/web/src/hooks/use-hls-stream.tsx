"use client";

import { useState, useEffect, useCallback } from "react";
import Hls, { type LevelSwitchedData, type Events } from "hls.js";
import type {
  HlsRef,
  MediaRef,
  StreamResolution,
  SetStreamLevelOptions,
} from "~/types";

export const useHlsStream = (
  hlsRef: HlsRef,
  mediaRef: MediaRef,
  src: string,
) => {
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(true);
  const [streamLevel, setStreamLevelState] = useState<number>(-1);
  const [streamLevels, setStreamLevels] = useState<StreamResolution[]>([]);
  const [streamLevelPreferred, setStreamLevelPreferred] = useState<number>(-1);

  const setStreamLevel = useCallback(
    (level: number, opts: SetStreamLevelOptions) => {
      const hls = hlsRef.current;
      if (!hls) return;

      if (opts.preferred) setStreamLevelPreferred(level);
      opts.immediate ? (hls.currentLevel = level) : (hls.nextLevel = level);
    },
    [hlsRef],
  );

  const onStreamError = useCallback(
    (message: string) => {
      setStreamError(message);
      console.error(message);
    },
    [setStreamError],
  );

  const onManifestParsed = useCallback(() => {
    setStreamLoading(false);

    const levels = hlsRef.current?.levels;
    if (!levels) return;

    setStreamLevels(
      levels.map((level) => ({
        width: level.width,
        height: level.height,
      })),
    );
  }, [hlsRef, setStreamLoading]);

  const onLevelSwitched = useCallback(
    (event: Events.LEVEL_SWITCHED, data: LevelSwitchedData) => {
      const level = hlsRef.current?.levels[data.level];
      if (level) setStreamLevelState(data.level);
    },
    [hlsRef],
  );

  useEffect(() => {
    if (!mediaRef?.current) return;
    const media = mediaRef.current;

    const onHlsError = () => {
      const errorMessage = media.error
        ? `Media element error: ${media.error.code}`
        : "Unknown media element error";
      onStreamError(errorMessage);
    };

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(media);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        onStreamError(`${data.type}, ${data.details}`);
      });
      hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      hls.on(Hls.Events.LEVEL_SWITCHED, onLevelSwitched);
    } else if (media.canPlayType("application/vnd.apple.mpegurl")) {
      media.src = src;
      media.addEventListener("loadedmetadata", () => {
        media.play().catch((error) => onStreamError(error.message));
      });
    }

    media.addEventListener("error", onHlsError);

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      media.removeEventListener("error", onHlsError);
    };
  }, [src, hlsRef, mediaRef, onStreamError, onManifestParsed, onLevelSwitched]);

  return {
    streamLevel,
    setStreamLevel,
    streamLevels,
    streamLevelPreferred,
    streamLoading,
    streamError,
  } as const;
};
