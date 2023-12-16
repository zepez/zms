"use client";

import React, { createContext, useContext, useRef } from "react";

interface Context {
  videoRef: React.RefObject<HTMLVideoElement> | null;
  layoutRef: React.RefObject<HTMLDivElement> | null;
}

const VideoContext = createContext<Context>({
  videoRef: null,
  layoutRef: null,
});

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  return (
    <VideoContext.Provider value={{ videoRef, layoutRef }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  return useContext(VideoContext);
};
