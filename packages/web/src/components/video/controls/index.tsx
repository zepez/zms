"use client";

import { Fullscreen } from "./fullscreen";
import { Progress } from "./progress";
import { PauseControl } from "./pause-control";
import { PauseIndicator } from "./pause-indicator";
import { Pause } from "./pause";
import { TimeCodes } from "./time-codes";
import { Volume } from "./volume";

export const Controls = () => {
  return (
    <PauseControl>
      <div
        className="absolute bottom-0 left-0 z-10 h-full w-full"
        style={{
          backgroundImage: `linear-gradient(0deg, black 15%, transparent)`,
        }}
      >
        <div className="p-8 flex gap-2 flex-col justify-between items-center h-full">
          <div />
          <PauseIndicator />
          <div className="w-full">
            <Progress />
            <div className="flex justify-between items-center px-4 pt-4">
              <div className="flex justify-start items-center gap-4">
                <PauseControl>
                  <Pause />
                </PauseControl>
                <TimeCodes />
                <Volume />
              </div>
              <div>
                <Fullscreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PauseControl>
  );
};
