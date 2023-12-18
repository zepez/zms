"use client";

import { useVideoContext } from "~/components/video/context";
import { cn } from "~/lib";
import { Fullscreen } from "./fullscreen";
import { Level } from "./level";
import { Progress } from "./progress";
import { PauseControl } from "./pause-control";
import { PauseIndicator } from "./pause-indicator";
import { Pause } from "./pause";
import { Speed } from "./speed";
import { TimeCodes } from "./time-codes";
import { Volume } from "./volume";

export const Controls = () => {
  const { isPlayerActive } = useVideoContext();

  return (
    <PauseControl>
      <div
        className="absolute bottom-0 left-0 z-10 h-full w-full transition-opacity duration-500 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(0deg, black 1%, transparent)`,
          opacity: isPlayerActive ? 1 : 0,
        }}
      >
        <div className="p-8 flex gap-2 flex-col justify-between items-center h-full">
          <div />
          <PauseIndicator />
          <div
            className={cn(
              "w-full transition-opacity duration-500 ease-in-out",
              isPlayerActive ? "opacity-100" : "opacity-0",
            )}
          >
            <Progress />
            <div className="flex justify-between items-center px-4 pt-4">
              <div className="flex justify-start items-center gap-4">
                <PauseControl>
                  <Pause />
                </PauseControl>
                <TimeCodes />
                <Volume />
              </div>
              <div className="flex items-center gap-4">
                <Speed />
                <Level />
                <Fullscreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PauseControl>
  );
};
