import { useState, useCallback } from "react";
import type { PlayerRef } from "~/types";

export const usePlayerFullscreen = (playerRef: PlayerRef) => {
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);

  const setPlayerFullscreen = useCallback(
    async (fullscreen: boolean) => {
      if (!playerRef?.current) return;
      const player = playerRef.current;

      try {
        setIsPlayerFullscreen(fullscreen);

        if (fullscreen) {
          await player.requestFullscreen();
        } else {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
          }
        }
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      }
    },
    [playerRef],
  );

  const togglePlayerFullscreen = useCallback(async () => {
    if (!playerRef?.current) return;
    const player = playerRef.current;

    try {
      setIsPlayerFullscreen((prevState) => {
        const newState = !prevState;

        if (newState) {
          player.requestFullscreen().catch(() => {});
        } else if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }

        return newState;
      });
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }, [playerRef]);

  return {
    isPlayerFullscreen,
    setPlayerFullscreen,
    togglePlayerFullscreen,
  } as const;
};
