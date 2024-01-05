import { Worker } from "bullmq";
import config from "@packages/config-server";
import { QUEUE_NAMES } from "@packages/constant";
import * as transcodeLogic from "../transcode";
import type { TranscodeJobData } from "../types";

export const transcode = new Worker(
  QUEUE_NAMES.TRANSCODE,
  async (job) => {
    const data = job.data as TranscodeJobData;

    console.log(`Start transcode: ${data.name}, ${data.preset.resolution}`);
    await transcodeLogic.hls(data);
    console.log(`Finish transcode: ${data.name}, ${data.preset.resolution}`);

    return true;
  },
  {
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    },
  },
);
