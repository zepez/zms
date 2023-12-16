"use client";

import react from "react";
import { useVideoContext } from "~/providers";

interface Props {
  children: React.ReactElement;
}

export const PauseControl = ({ children }: Props) => {
  const { togglePlayPause } = useVideoContext();

  const child = react.cloneElement(children, { onClick: togglePlayPause });

  return <>{child}</>;
};
