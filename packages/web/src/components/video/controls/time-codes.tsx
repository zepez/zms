"use client";

import { useVideoContext } from "~/providers";

export const TimeCodes = () => {
  const { streamCurrentTime, streamTotalTime } = useVideoContext();

  const secondsToTimeCode = (seconds: number | null) => {
    if (!seconds) return "00:00:00";

    var date = new Date(0);

    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  return (
    <p className="whitespace-nowrap">
      {secondsToTimeCode(streamCurrentTime)} /{" "}
      {secondsToTimeCode(streamTotalTime)}
    </p>
  );
};
