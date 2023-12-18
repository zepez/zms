"use client";

import { useState, useEffect, useCallback } from "react";
import throttle from "lodash.throttle";
import { useVideoContext } from "~/components/video/context";

export const Progress = () => {
  const {
    progressBarRef,
    videoTotalTime,
    setVideoCurrentTime,
    videoCurrentPercent,
    videoBufferPercent,
  } = useVideoContext();
  const [hoverProgress, setHoverProgress] = useState(0);
  const [isDragging, setDragging] = useState(false);

  const calculateVideoPercent = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
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

  const calculateVideoNewTime = useCallback(
    (percent: number) => {
      return (percent / 100) * videoTotalTime;
    },
    [videoTotalTime],
  );

  const updateVideoCurrentTime = useCallback(
    throttle((e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const percent = calculateVideoPercent(e);
      const newTime = calculateVideoNewTime(percent);

      setVideoCurrentTime(newTime);
    }, 100),
    [calculateVideoPercent, calculateVideoNewTime, setVideoCurrentTime],
  );

  const startDragging = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setDragging(true);
      updateVideoCurrentTime(e);
    },
    [updateVideoCurrentTime],
  );

  const stopDragging = useCallback(() => {
    setDragging(false);
  }, []);

  const onDragging = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();

        updateVideoCurrentTime(e);
      }
    },
    [isDragging, updateVideoCurrentTime],
  );

  const updateVideoHoverTime = useCallback(
    throttle((e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const percent = calculateVideoPercent(e as unknown as MouseEvent);
      setHoverProgress(percent);
    }, 100),
    [setHoverProgress, calculateVideoPercent],
  );

  useEffect(() => {
    const bar = progressBarRef?.current;
    if (!bar) return;

    bar.addEventListener("mousedown", startDragging as any);
    window.addEventListener("mousemove", onDragging as any);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      bar.removeEventListener("mousedown", startDragging as any);
      window.removeEventListener("mousemove", onDragging as any);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [progressBarRef, startDragging, onDragging, stopDragging]);

  return (
    <div
      className="bg-white relative h-2 hover:h-3 transition-height duration-200 ease-in-out w-full rounded-sm hover:cursor-pointer"
      ref={progressBarRef}
      onClick={updateVideoCurrentTime}
      onMouseMove={updateVideoHoverTime}
      onMouseLeave={() => setHoverProgress(0)}
    >
      <div
        className="bg-zinc-300 h-full absolute rounded-sm"
        style={{ width: `${videoBufferPercent}%` }}
      />
      <div
        className="bg-zinc-400 h-full absolute rounded-sm"
        style={{ width: `${hoverProgress}%` }}
      />
      <div
        className="video-progress-bar bg-green-500 h-full absolute rounded-sm"
        style={{ width: `${videoCurrentPercent}%` }}
      />
    </div>
  );
};
