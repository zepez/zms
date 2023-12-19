"use client";

import react from "react";
import { useVideoContext } from "~/components/video/context";

interface Props {
  children: React.ReactElement;
}

export const PauseControl = ({ children }: Props) => {
  const { toggleMediaPaused } = useVideoContext();

  const child = react.cloneElement(children, { onClick: toggleMediaPaused });

  return <>{child}</>;
};
