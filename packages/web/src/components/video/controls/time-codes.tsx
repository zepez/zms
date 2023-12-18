"use client";

import { useVideoContext } from "~/components/video/context";

export const TimeCodes = () => {
  const { videoCurrentTime, videoTotalTime } = useVideoContext();

  const secondsToTimeCode = (seconds: number | null) => {
    if (!seconds) return "00:00:00";

    var date = new Date(0);

    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  return (
    <p className="whitespace-nowrap">
      {secondsToTimeCode(videoCurrentTime)} /{" "}
      {secondsToTimeCode(videoTotalTime)}
    </p>
  );
};
