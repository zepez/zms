import chokidar from "chokidar";
import mime from "mime";
import { getDataPath } from "@packages/common";
import { TRANSCODE_SEGMENT_DURATION, QUEUE_NAMES } from "@packages/constant";
import { insertMedia } from "@packages/query";
import { qs } from "@packages/db";
import * as files from "./file";
import workers from "./workers";
import * as transcode from "./transcode";
import type { TranscodeJobData, IngestJobData } from "./types";

const provision = async (path: string) => {
  console.log("New file detected:", path);
  const mimetype = mime.getType(path);
  const type = mimetype?.split("/")[0] ?? null;

  if (!type) throw new Error("Unable to parse file type");

  const file = await files.provision(path, type);
  const hash = file.getHash();

  await file.writeMetadata();
  await file.writePosterImage();
  await file.writeBackdropImage();

  await insertMedia({
    id: hash,
    ...file.getMetadata(),
  });

  const presets = transcode.presets.determine(file);

  await qs.flow.add({
    name: `${hash}:${file.name}`,
    queueName: QUEUE_NAMES.INGEST,
    data: {
      inputFilePath: file.inputFilePath,
      outputFilePath: file.getOutputFilePath(),
    } as IngestJobData,
    children: presets.map((preset) => {
      return {
        name: `${hash}:${file.name}:${preset.name}`,
        data: {
          type,
          id: hash,
          name: file.name,
          inputFilePath: file.inputFilePath,
          outputDirPath: file.getOutputDirPath(),
          segmentDuration: TRANSCODE_SEGMENT_DURATION,
          preset,
        } as TranscodeJobData,
        queueName: QUEUE_NAMES.TRANSCODE,
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
  await workers.transcode.close();

  console.log("All tasks completed. Exiting...");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
