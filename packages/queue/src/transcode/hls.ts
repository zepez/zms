import process from "process";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import config from "@packages/config-server";
import { ensurePath } from "@packages/common";
import type { TranscodeJobData } from "../types";

const transcodingProcesses = new Map<string, ffmpeg.FfmpegCommand>();

const ensureParentPlaylist = (
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

const addToParentPlaylist = (
  parentPlaylistFilePath: string,
  preset: TranscodeJobData["preset"],
) => {
  const resolutionPlaylistInfo = `#EXT-X-STREAM-INF:BANDWIDTH=${preset.bandwidth},RESOLUTION=${preset.resolution}\n${preset.name}/playlist.m3u8\n`;
  fs.appendFileSync(parentPlaylistFilePath, resolutionPlaylistInfo);
};

export const hls = async (opts: TranscodeJobData) => {
  await new Promise((resolve, reject) => {
    const { preset } = opts;

    const parentPlaylistFilePath = ensureParentPlaylist(opts.outputDirPath);

    const resolutionOutDirPath = path.join(opts.outputDirPath, preset.name);
    const resolutionOutPlaylistFilePath = path.join(
      resolutionOutDirPath,
      "playlist.m3u8",
    );

    ensurePath(resolutionOutDirPath);

    if (preset.immediate) {
      addToParentPlaylist(parentPlaylistFilePath, preset);
    }

    const tempDirPath = path.join(opts.outputDirPath, "tmp");
    ensurePath(tempDirPath);
    process.chdir(tempDirPath);

    const transcodingProcess = ffmpeg(opts.inputFilePath)
      .outputOptions([
        "-profile:v baseline",
        `-s ${preset.resolution}`,
        "-sc_threshold 0",
        "-start_number 0",
        `-hls_time ${opts.segmentDuration}`,
        "-hls_list_size 0",
        "-f hls",
        "-loglevel debug",
      ])
      .output(resolutionOutPlaylistFilePath);

    transcodingProcess.addOutputOptions(config.FFMPEG_ADDITIONAL_ARGS);

    transcodingProcess.on("start", () => {
      transcodingProcesses.set(opts.id, transcodingProcess);
    });

    transcodingProcess.on("end", () => {
      transcodingProcesses.delete(opts.id);

      if (!preset.immediate) {
        addToParentPlaylist(parentPlaylistFilePath, preset);
      }

      resolve(true);
    });

    transcodingProcess.on("error", (err) => {
      transcodingProcesses.delete(opts.id);

      console.error(err);
      reject(new Error(err.message));
    });

    transcodingProcess.run();
  });
};

export const sendFfmpegSignal = (signal: string) => {
  transcodingProcesses.forEach((process, id) => {
    console.log(`Stopping ffmpeg process for job ${id}`);
    process.kill(signal);
  });
};
