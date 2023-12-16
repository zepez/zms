"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type MouseEvent,
  type ChangeEvent,
} from "react";
import { useLocalStorage } from "react-use";
import Hls from "hls.js";

interface Context {
  videoRef: React.RefObject<HTMLVideoElement> | null;
  layoutRef: React.RefObject<HTMLDivElement> | null;
  isActive: boolean;
  isFullscreen: boolean;
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
}

const VideoContext = createContext<Context>({
  videoRef: null,
  layoutRef: null,
  isActive: true,
  isFullscreen: false,
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
  const [isActive, setIsActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
  // Calculate inactivity
  // ==============================
  let inactivityTimer: NodeJS.Timeout;
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    setIsActive(true);
    inactivityTimer = setTimeout(() => setIsActive(false), 2000);
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer),
    );
    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer),
      );
    };
  }, []);

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
  // Play / Pause control
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
  // Scrub control
  // ==============================
  const offsetVideoProgress = (offsetSeconds: number) => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    video.currentTime = video.currentTime + offsetSeconds;
  };

  // ==============================
  // Shortcuts
  // ==============================
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ==============================
  // Fullscreen control
  // ==============================
  const toggleFullscreen = (e: MouseEvent<HTMLButtonElement>) => {
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
  // Timecodes / Progress control
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
  // Volume control
  // ==============================
  const getStreamVolume = () => {
    return streamVolume ?? 1;
  };

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    video.volume = getStreamVolume();
  }, [streamVolume, videoRef]);

  const toggleVolume = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setStreamVolume(getStreamVolume() === 0 ? 1 : 0);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setStreamVolume(Number(e.target.value));
  };

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        layoutRef,
        isActive,
        isFullscreen,
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
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  return useContext(VideoContext);
};
