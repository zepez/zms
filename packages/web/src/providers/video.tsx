"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type MouseEvent,
  type ChangeEvent,
} from "react";
import { useLocalStorage } from "react-use";
import throttle from "lodash.throttle";
import Hls from "hls.js";

interface Context {
  videoRef: React.RefObject<HTMLVideoElement> | null;
  layoutRef: React.RefObject<HTMLDivElement> | null;
  progressBarRef: React.RefObject<HTMLDivElement> | null;
  isActive: boolean;
  isFullscreen: boolean;
  isMouseDown: boolean;
  streamSource: string | null;
  streamLoading: boolean;
  streamError: string | null;
  streamPaused: boolean;
  streamCurrentTime: number;
  streamCurrentPercent: number;
  streamBufferPercent: number;
  streamTotalTime: number;
  getStreamVolume: () => number;
  togglePlayPause: (e: MouseEvent<HTMLButtonElement>) => void;
  toggleFullscreen: (e: MouseEvent<HTMLButtonElement>) => void;
  toggleVolume: (e: MouseEvent<HTMLButtonElement>) => void;
  changeVolume: (e: ChangeEvent<HTMLInputElement>) => void;
  handleProgressBarDrag: (e: MouseEvent<HTMLDivElement>) => void;
}

const VideoContext = createContext<Context>({
  videoRef: null,
  layoutRef: null,
  progressBarRef: null,
  isActive: true,
  isFullscreen: false,
  isMouseDown: false,
  streamSource: null,
  streamLoading: true,
  streamError: null,
  streamPaused: true,
  streamCurrentTime: 0,
  streamCurrentPercent: 0,
  streamBufferPercent: 0,
  streamTotalTime: 0,
  getStreamVolume: () => 1,
  togglePlayPause: (e: MouseEvent<HTMLButtonElement>) => {},
  toggleFullscreen: (e: MouseEvent<HTMLButtonElement>) => {},
  toggleVolume: (e: MouseEvent<HTMLButtonElement>) => {},
  changeVolume: (e: ChangeEvent<HTMLInputElement>) => {},
  handleProgressBarDrag: (e: MouseEvent<HTMLDivElement>) => {},
});

export const VideoProvider = ({
  children,
  src,
}: {
  children: React.ReactNode;
  src: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [streamLoading, setStreamLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamPaused, setStreamPaused] = useState(true);
  const [streamCurrentTime, setStreamCurrentTime] = useState(0);
  const [streamCurrentPercent, setStreamCurrentPercent] = useState(0);
  const [streamBufferPercent, setStreamBufferPercent] = useState(0);
  const [streamTotalTime, setStreamTotalTime] = useState(0);
  const [streamVolume, setStreamVolume] = useLocalStorage(
    "zms-stream-volume",
    1,
  );

  // ==============================
  // HANDLE: Calculate Inactivity
  // ==============================
  let inactivityTimer: NodeJS.Timeout;
  const handleResetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    setIsActive(true);
    inactivityTimer = setTimeout(() => setIsActive(false), 2000);
  };

  // ==============================
  // HANDLE: Timecodes / Progress Control
  // ==============================
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const updateProgress = () => {
      setStreamCurrentTime(video.currentTime);
      setStreamCurrentPercent((video.currentTime / video.duration) * 100);
      setStreamTotalTime(video.duration);

      const bufferedRanges = video.buffered;
      let maxBufferedEnd = 0;

      for (let i = 0; i < bufferedRanges.length; i++) {
        if (bufferedRanges.end(i) > maxBufferedEnd) {
          maxBufferedEnd = bufferedRanges.end(i);
        }
      }

      setStreamBufferPercent((maxBufferedEnd / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      if (video) video.removeEventListener("timeupdate", updateProgress);
    };
  }, [videoRef]);

  // ==============================
  // HANDLE: Scrollbar Dragging
  // ==============================
  const handleProgressBarDrag = throttle(
    useCallback(
      (e: MouseEvent) => {
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
  // DISPATCH: Dispatch Event Handlers
  // ==============================
  const multiEventHandler = (
    event: MouseEvent | KeyboardEvent | TouchEvent | UIEvent,
  ) => {
    handleResetInactivityTimer();

    switch (event.type) {
      case "mousedown":
        setIsMouseDown(true);
        break;
      case "mouseup":
        setIsMouseDown(false);
        break;
      case "mousemove":
        if (isMouseDown) handleProgressBarDrag(event as MouseEvent);
        break;
    }
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "mouseup",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) =>
      window.addEventListener(event, multiEventHandler as EventListener),
    );

    handleResetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) =>
        window.removeEventListener(event, multiEventHandler as EventListener),
      );
    };
  }, [isMouseDown]);

  // ==============================
  // Streaming
  // ==============================
  const handleStreamError = (message: string) => {
    console.error(message);
    setStreamError(message);
  };

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) =>
        handleStreamError(`${data.type}, ${data.details}`),
      );

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStreamLoading(false);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        console.log(`Resolution changed: ${level.width}x${level.height}`);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((error) => handleStreamError(error.message));
      });
    }

    video.addEventListener("error", () => {
      const errorMessage = video.error
        ? `Video element error: ${video.error.code}`
        : "Unknown video element error";
      handleStreamError(errorMessage);
    });

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      video.removeEventListener("error", () => {});
    };
  }, [src]);

  // ==============================
  // HANDLE: Play / Pause Control
  // ==============================
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (video.paused) {
      video.play();
      setStreamPaused(false);
    } else {
      video.pause();
      setStreamPaused(true);
    }
  };

  // ==============================
  // HANDLE: Scrub Control
  // ==============================
  const offsetVideoProgress = (offsetSeconds: number) => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    video.currentTime = video.currentTime + offsetSeconds;
  };

  // ==============================
  // HANDLE: Fullscreen Control
  // ==============================
  const toggleFullscreen = (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
  ) => {
    e.stopPropagation();

    if (!layoutRef.current) return;
    const layout = layoutRef.current;

    try {
      if (!document.fullscreenElement) layout.requestFullscreen();
      else {
        if (document.exitFullscreen) document.exitFullscreen();
      }

      setIsFullscreen((v) => !v);
    } catch (e) {
      console.error(`Unable to toggle fullscreen: ${e}`);
    }
  };

  // ==============================
  // HANDLE: Volume Control
  // ==============================
  const getStreamVolume = () => {
    return streamVolume ?? 1;
  };

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    video.volume = getStreamVolume();
  }, [streamVolume, videoRef]);

  const toggleVolume = (
    e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent,
  ) => {
    e.stopPropagation();
    setStreamVolume(getStreamVolume() === 0 ? 1 : 0);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setStreamVolume(Number(e.target.value));
  };

  // ==============================
  // DISPATCH: Shortcuts
  // ==============================
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.code);
      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          event.preventDefault();
          offsetVideoProgress(-5);
          break;
        case "ArrowRight":
          event.preventDefault();
          offsetVideoProgress(5);
          break;
        case "KeyF":
          event.preventDefault();
          toggleFullscreen(event);
          break;
        case "KeyM":
          event.preventDefault();
          toggleVolume(event);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [streamVolume]);

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        layoutRef,
        progressBarRef,
        isActive,
        isFullscreen,
        isMouseDown,
        streamSource: src,
        streamLoading,
        streamError,
        streamPaused,
        streamCurrentTime,
        streamCurrentPercent,
        streamBufferPercent,
        streamTotalTime,
        getStreamVolume,
        togglePlayPause,
        toggleFullscreen,
        toggleVolume,
        changeVolume,
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
