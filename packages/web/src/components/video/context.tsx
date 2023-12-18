"use client";

import React, { createContext, useContext, useRef, useEffect } from "react";
import Hls from "hls.js";
import {
  useHlsStream,
  useMouseDown,
  usePlayerActive,
  usePlayerFullscreen,
  useVideoPause,
  useVideoVolume,
  useVideoProgress,
} from "./hooks";
import type { StreamResolution } from "~/components/video/types";

interface Context {
  // Refs
  videoRef: React.RefObject<HTMLVideoElement> | null;
  playerRef: React.RefObject<HTMLDivElement> | null;
  progressBarRef: React.RefObject<HTMLDivElement> | null;
  // Activity Tracking
  isPlayerActive: boolean;
  setPlayerForcedActive: (forced: boolean) => void;
  isProgressBarDragging: boolean;
  // Fullscreen
  isPlayerFullscreen: boolean;
  togglePlayerFullscreen: () => void;
  // Volume
  videoVolume: number;
  setVideoVolume: (volume: number) => void;
  isVideoMuted: boolean;
  setVideoMuted: (muted: boolean) => void;
  // Pause
  isVideoPaused: boolean;
  toggleVideoPaused: () => void;
  // Progress
  videoCurrentTime: number;
  setVideoCurrentTime: (time: number) => void;
  videoCurrentPercent: number;
  videoBufferPercent: number;
  videoTotalTime: number;
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
  videoRef: null,
  playerRef: null,
  progressBarRef: null,
  // Activity Tracking
  isPlayerActive: true,
  setPlayerForcedActive: () => {},
  isProgressBarDragging: false,
  // Fullscreen
  isPlayerFullscreen: false,
  togglePlayerFullscreen: () => {},
  // Volume
  videoVolume: 1,
  setVideoVolume: () => {},
  isVideoMuted: false,
  setVideoMuted: () => {},
  // Pause
  isVideoPaused: true,
  toggleVideoPaused: () => {},
  // Progress
  videoCurrentTime: 0,
  setVideoCurrentTime: () => {},
  videoCurrentPercent: 0,
  videoBufferPercent: 0,
  videoTotalTime: 0,
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { isPlayerActive, setPlayerForcedActive } = usePlayerActive(playerRef);
  const { isPlayerFullscreen, togglePlayerFullscreen } =
    usePlayerFullscreen(playerRef);
  const [isProgressBarDragging] = useMouseDown(progressBarRef);
  const { videoVolume, setVideoVolume, isVideoMuted, setVideoMuted } =
    useVideoVolume(videoRef);
  const { isVideoPaused, toggleVideoPaused } = useVideoPause(videoRef);
  const {
    videoCurrentTime,
    setVideoCurrentTime,
    videoCurrentPercent,
    videoBufferPercent,
    videoTotalTime,
    offsetVideoTime,
  } = useVideoProgress(videoRef);
  const {
    streamLevel,
    setStreamLevel,
    streamLevels,
    streamLoading,
    streamError,
  } = useHlsStream(hlsRef, videoRef, src);

  // ==============================
  // Shortcuts
  // ==============================
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Space":
          event.preventDefault();
          toggleVideoPaused();
          break;
        case "ArrowLeft":
          event.preventDefault();
          offsetVideoTime(-5);
          break;
        case "KeyJ":
          event.preventDefault();
          offsetVideoTime(-10);
          break;
        case "ArrowRight":
          event.preventDefault();
          offsetVideoTime(5);
          break;
        case "KeyL":
          event.preventDefault();
          offsetVideoTime(10);
          break;
        case "KeyF":
          event.preventDefault();
          togglePlayerFullscreen();
          break;
        case "KeyM":
          event.preventDefault();
          setVideoMuted(!isVideoMuted);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isVideoMuted,
    offsetVideoTime,
    setVideoMuted,
    togglePlayerFullscreen,
    toggleVideoPaused,
  ]);

  return (
    <VideoContext.Provider
      value={{
        // Refs
        videoRef,
        playerRef,
        progressBarRef,
        // Activity Tracking
        isPlayerActive,
        setPlayerForcedActive,
        isProgressBarDragging,
        // Fullscreen
        isPlayerFullscreen,
        togglePlayerFullscreen,
        // Volume
        videoVolume,
        setVideoVolume,
        isVideoMuted,
        setVideoMuted,
        // Pause
        isVideoPaused,
        toggleVideoPaused,
        // Progress
        videoCurrentTime,
        setVideoCurrentTime,
        videoCurrentPercent,
        videoBufferPercent,
        videoTotalTime,
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
