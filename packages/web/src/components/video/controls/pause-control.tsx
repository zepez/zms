"use client";

import react from "react";
import { useVideoContext } from "~/providers";

interface Props {
  children: React.ReactElement;
}

export const PauseControl = ({ children }: Props) => {
  const { videoRef } = useVideoContext();

  const togglePause = () => {
    if (!videoRef?.current) return;

    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const child = react.cloneElement(children, { onClick: togglePause });

  return <>{child}</>;
};
