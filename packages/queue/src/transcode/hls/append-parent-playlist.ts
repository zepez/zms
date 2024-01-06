import fs from "fs/promises";
import type { TranscodeJobData } from "../../types";

export const appendParentPlaylist = async (
  parentPlaylistFilePath: string,
  type: TranscodeJobData["type"],
  preset: TranscodeJobData["preset"],
) => {
  let resolutionPlaylistInfo = null;

  switch (type) {
    case "audio":
      resolutionPlaylistInfo = `#EXT-X-STREAM-INF:BANDWIDTH=${preset.bandwidth}\n${preset.name}/playlist.m3u8\n`;
      break;
    case "video":
      resolutionPlaylistInfo = `#EXT-X-STREAM-INF:BANDWIDTH=${preset.bandwidth},RESOLUTION=${preset.resolution}\n${preset.name}/playlist.m3u8\n`;
      break;
  }

  await fs.appendFile(parentPlaylistFilePath, resolutionPlaylistInfo);
};
