import fs from "fs";
import path from "path";
import { ensurePath } from "@packages/common";
import type { TranscodeJobData } from "../../types";

export const ensureParentPlaylist = (
  parentDirPath: TranscodeJobData["outputDirPath"],
) => {
  ensurePath(parentDirPath);

  const parentPlaylistFilePath = path.join(parentDirPath, "playlist.m3u8");
  const parentPlaylistFileExists = fs.existsSync(parentPlaylistFilePath);

  if (!parentPlaylistFileExists) {
    fs.writeFileSync(parentPlaylistFilePath, "#EXTM3U\n");
  }

  return parentPlaylistFilePath;
};
