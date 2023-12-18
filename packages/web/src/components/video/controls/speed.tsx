import { useState } from "react";
import { useVideoContext } from "~/components/video/context";

export const Speed = () => {
  const playerSpeeds = [0.1, 0.5, 1, 1.5, 2];
  const defaultPlayerSpeedIndex = 2;

  const { videoRef } = useVideoContext();
  const [playerSpeed, setPlayerSpeed] = useState(
    playerSpeeds[defaultPlayerSpeedIndex],
  );

  const onPlayerSpeedChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef?.current;
    if (!video) return;

    const currentIndex = playerSpeeds.indexOf(playerSpeed);
    const newSpeed = playerSpeeds[currentIndex + 1] || playerSpeeds[0];
    video.playbackRate = newSpeed;
    setPlayerSpeed(newSpeed);
  };

  return (
    <button
      onClick={onPlayerSpeedChange}
      className="border-zinc-100 border-2 py-1 w-12 rounded-md text-sm"
    >
      {playerSpeed}x
    </button>
  );
};
