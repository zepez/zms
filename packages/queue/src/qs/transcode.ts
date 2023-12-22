import { Queue, Worker } from "bullmq";
import config from "@packages/config-server";
import * as transcodeLogic from "../transcode";
import type { TranscodeJobData } from "../types";

const connection = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
};

const transcodeQueue = new Queue("transcode-queue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

const transcodeWorker = new Worker(
  "transcode-queue",
  async (job) => {
    const data = job.data as TranscodeJobData;

    console.log(`Start transcode: ${data.name}, ${data.preset.resolution}`);
    await transcodeLogic.hls(data);
    console.log(`Finish transcode: ${data.name}, ${data.preset.resolution}`);

    return true;
  },
  { connection },
);

export const transcode = {
  queue: transcodeQueue,
  worker: transcodeWorker,
};
