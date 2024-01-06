import process from "process";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import config from "@packages/config-server";
import { ensurePath } from "@packages/common";
import { ffmpegCommand } from "./ffmpeg-command";
import { appendParentPlaylist } from "./append-parent-playlist";
import { ensureParentPlaylist } from "./ensure-parent-playlist";
import type { TranscodeJobData } from "../../types";

const transcodingProcesses = new Map<string, ffmpeg.FfmpegCommand>();

export const hls = async (opts: TranscodeJobData) => {
  await new Promise(async (resolve, reject) => {
    const { type, preset } = opts;

    const parentPlaylistFilePath = ensureParentPlaylist(opts.outputDirPath);

    const presetDirPath = path.join(opts.outputDirPath, preset.name);
    const presetPlaylistFilePath = path.join(presetDirPath, "playlist.m3u8");

    ensurePath(presetDirPath);

    if (preset.immediate) {
      await appendParentPlaylist(parentPlaylistFilePath, type, preset);
    }

    const tempDirPath = path.join(opts.outputDirPath, "tmp");
    ensurePath(tempDirPath);
    process.chdir(tempDirPath);

    const transcodingProcess = ffmpegCommand(opts, presetPlaylistFilePath);
    transcodingProcess.addOutputOptions(config.FFMPEG_ADDITIONAL_ARGS);

    transcodingProcess.on("start", () => {
      transcodingProcesses.set(opts.id, transcodingProcess);
    });

    transcodingProcess.on("end", async () => {
      transcodingProcesses.delete(opts.id);

      if (!preset.immediate) {
        await appendParentPlaylist(parentPlaylistFilePath, type, preset);
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
