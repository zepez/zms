"use client";

import { useState, useCallback } from "react";
import throttle from "lodash.throttle";
import { useDrag } from "~/hooks";
import { useVideoContext } from "~/components/video/context";

export const Progress = () => {
  const {
    progressBarRef,
    mediaTotalTime,
    setMediaCurrentTime,
    mediaCurrentPercent,
    mediaBufferPercent,
    setStreamLevel,
  } = useVideoContext();
  const [hoverProgress, setHoverProgress] = useState(0);
  const { isDragging, onDragStart, onDragMove, onDragEnd } =
    useDrag(progressBarRef);

  const calculateMediaPercent = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const bar = progressBarRef?.current;
      if (!bar) return 0;

      const boundingRect = bar.getBoundingClientRect();
      const mouseX = e.clientX - boundingRect.left;
      const percent = (mouseX / boundingRect.width) * 100;

      return percent;
    },
    [progressBarRef],
  );

  const updateMediaCurrentTimeThrottled = throttle(
    (e: MouseEvent | React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const percent = calculateMediaPercent(e);
      const newTime = (percent / 100) * mediaTotalTime;

      setMediaCurrentTime(newTime);
    },
    50,
  );

  const updateMediaCurrentTime = useCallback(updateMediaCurrentTimeThrottled, [
    updateMediaCurrentTimeThrottled,
  ]);

  const updateMediaHoverTime = throttle(
    (e: MouseEvent | React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const percent = calculateMediaPercent(e);
      setHoverProgress(percent);
    },
    100,
  );

  onDragMove(updateMediaCurrentTime);
  onDragStart(() => setStreamLevel(0));
  onDragEnd(() => setStreamLevel(-1));

  return (
    <div
      className="bg-white relative h-2 hover:h-3 transition-height duration-200 ease-in-out w-full rounded-sm hover:cursor-pointer"
      ref={progressBarRef}
      onClick={updateMediaCurrentTime}
      onMouseMove={(e) => !isDragging && updateMediaHoverTime(e)}
      onMouseLeave={() => {
        updateMediaHoverTime.cancel();
        setHoverProgress(0);
      }}
    >
      <div
        className="bg-zinc-300 h-full absolute rounded-sm"
        style={{ width: `${mediaBufferPercent}%` }}
      />
      <div
        className="bg-zinc-400 h-full absolute rounded-sm"
        style={{ width: `${hoverProgress}%` }}
      />
      <div
        className="media-progress-bar bg-green-500 h-full absolute rounded-sm"
        style={{ width: `${mediaCurrentPercent}%` }}
      />
    </div>
  );
};
