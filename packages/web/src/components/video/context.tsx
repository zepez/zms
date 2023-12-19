"use client";

import React, { createContext, useContext, useRef, useEffect } from "react";
import Hls from "hls.js";
import {
  useHlsStream,
  useMediaPause,
  useMediaProgress,
  useMediaVolume,
  usePlayerActive,
  usePlayerFullscreen,
} from "~/hooks";
import type {
  MediaRef,
  PlayerRef,
  ProgressBarRef,
  StreamResolution,
} from "~/types";

interface Context {
  // Refs
  mediaRef: MediaRef<HTMLVideoElement>;
  playerRef: PlayerRef;
  progressBarRef: ProgressBarRef;
  // Activity Tracking
  isPlayerActive: boolean;
  setPlayerForcedActive: (forced: boolean) => void;
  // Fullscreen
  isPlayerFullscreen: boolean;
  togglePlayerFullscreen: () => void;
  // Volume
  mediaVolume: number;
  setMediaVolume: (volume: number) => void;
  isMediaMuted: boolean;
  setMediaMuted: (muted: boolean) => void;
  // Pause
  isMediaPaused: boolean;
  toggleMediaPaused: () => void;
  // Progress
  mediaCurrentTime: number;
  setMediaCurrentTime: (time: number) => void;
  mediaCurrentPercent: number;
  mediaBufferPercent: number;
  mediaTotalTime: number;
  // Stream
  streamSource: string | null;
  streamLevel: number;
  setStreamLevel: (level: number) => void;
  streamLevels: StreamResolution[];
  streamLoading: boolean;
  streamError: string | null;
}

const VideoContext = createContext<Context>({
  // Refs
  mediaRef: null,
  playerRef: null,
  progressBarRef: null,
  // Activity Tracking
  isPlayerActive: true,
  setPlayerForcedActive: () => {},
  // Fullscreen
  isPlayerFullscreen: false,
  togglePlayerFullscreen: () => {},
  // Volume
  mediaVolume: 1,
  setMediaVolume: () => {},
  isMediaMuted: false,
  setMediaMuted: () => {},
  // Pause
  isMediaPaused: true,
  toggleMediaPaused: () => {},
  // Progress
  mediaCurrentTime: 0,
  setMediaCurrentTime: () => {},
  mediaCurrentPercent: 0,
  mediaBufferPercent: 0,
  mediaTotalTime: 0,
  // Stream
  streamSource: null,
  streamLevel: -1,
  setStreamLevel: () => {},
  streamLevels: [],
  streamLoading: true,
  streamError: null,
});

export const Provider = ({
  children,
  src,
}: {
  children: React.ReactNode;
  src: string;
}) => {
  const hlsRef = useRef<Hls | null>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { isPlayerActive, setPlayerForcedActive } = usePlayerActive(playerRef);
  const { isPlayerFullscreen, togglePlayerFullscreen } =
    usePlayerFullscreen(playerRef);
  const { mediaVolume, setMediaVolume, isMediaMuted, setMediaMuted } =
    useMediaVolume(mediaRef);
  const { isMediaPaused, toggleMediaPaused } = useMediaPause(mediaRef);
  const {
    mediaCurrentTime,
    setMediaCurrentTime,
    mediaCurrentPercent,
    mediaBufferPercent,
    mediaTotalTime,
    offsetMediaTime,
  } = useMediaProgress(mediaRef);
  const {
    streamLevel,
    setStreamLevel,
    streamLevels,
    streamLoading,
    streamError,
  } = useHlsStream(hlsRef, mediaRef, src);

  // ==============================
  // Shortcuts
  // ==============================
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Space":
          event.preventDefault();
          toggleMediaPaused();
          break;
        case "ArrowLeft":
          event.preventDefault();
          offsetMediaTime(-5);
          break;
        case "KeyJ":
          event.preventDefault();
          offsetMediaTime(-10);
          break;
        case "ArrowRight":
          event.preventDefault();
          offsetMediaTime(5);
          break;
        case "KeyL":
          event.preventDefault();
          offsetMediaTime(10);
          break;
        case "KeyF":
          event.preventDefault();
          togglePlayerFullscreen();
          break;
        case "KeyM":
          event.preventDefault();
          setMediaMuted(!isMediaMuted);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isMediaMuted,
    offsetMediaTime,
    setMediaMuted,
    togglePlayerFullscreen,
    toggleMediaPaused,
  ]);

  return (
    <VideoContext.Provider
      value={{
        // Refs
        mediaRef,
        playerRef,
        progressBarRef,
        // Activity Tracking
        isPlayerActive,
        setPlayerForcedActive,
        // Fullscreen
        isPlayerFullscreen,
        togglePlayerFullscreen,
        // Volume
        mediaVolume,
        setMediaVolume,
        isMediaMuted,
        setMediaMuted,
        // Pause
        isMediaPaused,
        toggleMediaPaused,
        // Progress
        mediaCurrentTime,
        setMediaCurrentTime,
        mediaCurrentPercent,
        mediaBufferPercent,
        mediaTotalTime,
        // Stream
        streamSource: src,
        streamLevel,
        setStreamLevel,
        streamLevels,
        streamLoading,
        streamError,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  return useContext(VideoContext);
};
