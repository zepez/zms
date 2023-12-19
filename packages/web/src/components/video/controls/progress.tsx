"use client";

import { useState, useCallback } from "react";
import throttle from "lodash.throttle";
import { useDrag } from "~/hooks";
import { useVideoContext } from "~/components/video/context";

export const Progress = () => {
  const throttleTime = 10;

  const {
    progressBarRef,
    mediaTotalTime,
    setMediaCurrentTime,
    mediaCurrentPercent,
    mediaBufferPercent,
    setStreamLevel,
    streamLevelPreferred,
  } = useVideoContext();
  const [hoverProgress, setHoverProgress] = useState(0);
  const { isDragging, onDragStart, onDragMove, onDragEnd } =
    useDrag(progressBarRef);

  const calculateMediaPercent = throttle(
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
    throttleTime,
  );

  const calculateMediaTime = throttle((percent: number, total: number) => {
    return (percent / 100) * total;
  }, throttleTime);

  const updateMediaCurrentTime = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const percent = calculateMediaPercent(e);
      if (!percent) return;

      const newTime = calculateMediaTime(percent, mediaTotalTime);
      if (!newTime) return;

      setMediaCurrentTime(newTime);
    },
    [
      setMediaCurrentTime,
      mediaTotalTime,
      calculateMediaPercent,
      calculateMediaTime,
    ],
  );

  const updateMediaHoverTime = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const percent = calculateMediaPercent(e);
      if (!percent) return;

      setHoverProgress(percent);
    },
    [setHoverProgress, calculateMediaPercent],
  );

  onDragMove(updateMediaCurrentTime);
  onDragStart(() => setStreamLevel(0, { immediate: true, preferred: false }));
  onDragEnd(() =>
    setStreamLevel(streamLevelPreferred, {
      immediate: false,
      preferred: false,
    }),
  );

  return (
    <div
      className="bg-white relative h-2 hover:h-3 transition-height duration-200 ease-in-out w-full rounded-sm hover:cursor-pointer"
      ref={progressBarRef}
      onClick={updateMediaCurrentTime}
      onMouseMove={(e) => {
        if (isDragging) return;
        updateMediaHoverTime(e);
      }}
      onMouseLeave={() => {
        if (isDragging) return;
        calculateMediaPercent.cancel();
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
