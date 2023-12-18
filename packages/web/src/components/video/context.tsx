"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  type MouseEvent,
} from "react";
import throttle from "lodash.throttle";
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

interface Context {
  videoRef: React.RefObject<HTMLVideoElement> | null;
  playerRef: React.RefObject<HTMLDivElement> | null;
  progressBarRef: React.RefObject<HTMLDivElement> | null;

  isPlayerActive: boolean;
  isPlayerFullscreen: boolean;
  togglePlayerFullscreen: () => void;
  isProgressBarDragging: boolean;
  videoVolume: number;
  setVideoVolume: (volume: number) => void;
  isVideoMuted: boolean;
  setVideoMuted: (muted: boolean) => void;
  isVideoPaused: boolean;
  toggleVideoPaused: () => void;
  videoCurrentTime: number;
  setVideoCurrentTime: (time: number) => void;
  videoCurrentPercent: number;
  videoBufferPercent: number;
  videoTotalTime: number;
  streamSource: string | null;
  streamResolution: { width: number; height: number } | null;
  streamLoading: boolean;
  streamError: string | null;
  handleProgressBarDrag: (e: MouseEvent<HTMLDivElement>) => void;
}

const VideoContext = createContext<Context>({
  videoRef: null,
  playerRef: null,
  progressBarRef: null,
  isPlayerActive: true,
  isPlayerFullscreen: false,
  togglePlayerFullscreen: () => {},
  isProgressBarDragging: false,
  videoVolume: 1,
  setVideoVolume: () => {},
  isVideoMuted: false,
  setVideoMuted: () => {},
  isVideoPaused: true,
  toggleVideoPaused: () => {},
  streamSource: null,
  streamResolution: null,
  streamLoading: true,
  streamError: null,
  videoCurrentTime: 0,
  setVideoCurrentTime: () => {},
  videoCurrentPercent: 0,
  videoBufferPercent: 0,
  videoTotalTime: 0,
  handleProgressBarDrag: (e: MouseEvent<HTMLDivElement>) => {},
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

  const { isPlayerActive } = usePlayerActive(playerRef);
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
  const { streamResolution, streamLoading, streamError } = useHlsStream(
    hlsRef,
    videoRef,
    src,
  );

  // ==============================
  // HANDLE: Scrollbar Dragging
  // ==============================
  const handleProgressBarDrag = throttle(
    useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!videoRef?.current || !progressBarRef?.current) return;
        const video = videoRef.current;
        const progressBar = progressBarRef.current;

        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;

        video.currentTime = percent * video.duration;
      },
      [videoRef, progressBarRef],
    ),
    100,
  );

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
        videoRef,
        playerRef,
        progressBarRef,
        isPlayerActive,
        isPlayerFullscreen,
        togglePlayerFullscreen,
        isProgressBarDragging,
        videoVolume,
        setVideoVolume,
        isVideoMuted,
        setVideoMuted,
        isVideoPaused,
        toggleVideoPaused,
        videoCurrentTime,
        setVideoCurrentTime,
        videoCurrentPercent,
        videoBufferPercent,
        videoTotalTime,
        streamSource: src,
        streamResolution,
        streamLoading,
        streamError,
        handleProgressBarDrag,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  return useContext(VideoContext);
};
