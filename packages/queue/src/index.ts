import chokidar from "chokidar";
import { getDataPath } from "@packages/common";
import { insertMedia } from "@packages/query";
import File from "./file";
import * as qs from "./qs";
import * as transcode from "./transcode";
import type { TranscodeJobData, MoveFileJobData } from "./types";

const provision = async (path: string) => {
  console.log("New file detected:", path);
  const file = await new File(path).init();

  const hash = file.getHash();
  file.dumpMetadata();
  file.dumpPosterImage();
  file.dumpBackdropImage();

  await insertMedia({
    id: hash,
    ...file.getMetadata(),
  });

  const selectedPresets = transcode.presets.filter((preset) => {
    const [, presetHeight = 0] = preset.resolution.split("x").map(Number);
    const videoHeight = file.video.video_height || 0;

    return presetHeight <= videoHeight;
  });

  await qs.flow.add({
    name: `${hash}:${file.name}`,
    queueName: "move-file-queue",
    data: {
      inputFilePath: file.inputFilePath,
      outputFilePath: file.getOutputFilePath(),
    } as MoveFileJobData,
    children: selectedPresets.map((preset) => {
      return {
        name: `${hash}:${file.name}:${preset.name}`,
        data: {
          id: hash,
          name: file.name,
          inputFilePath: file.inputFilePath,
          outputDirPath: file.getOutputDirPath(),
          segmentDuration: 3,
          preset,
        } as TranscodeJobData,
        queueName: "transcode-queue",
      };
    }),
  });
};

const watcher = chokidar.watch(getDataPath("/queue"), {
  ignored: /(^|[\/\\])\../,
  persistent: true,
});

watcher.on("add", provision);

const gracefulShutdown = async () => {
  console.log("Stopping file queue watcher...");
  watcher.close();

  console.log("Stopping all ffmpeg processes...");
  transcode.sendFfmpegSignal("SIGTERM");

  console.log("Stopping transcode queue worker...");
  await qs.transcode.worker.close();

  console.log("All tasks completed. Exiting...");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
