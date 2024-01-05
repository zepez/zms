import fs from "fs/promises";
import { Worker } from "bullmq";
import config from "@packages/config-server";
import { QUEUE_NAMES } from "@packages/constant";
import type { FinishIngestJobData } from "../types";

export const finishIngest = new Worker(
  QUEUE_NAMES.FINISH,
  async (job) => {
    const { inputFilePath, outputFilePath } = job.data as FinishIngestJobData;

    try {
      await fs.rename(inputFilePath, outputFilePath);
      console.log(`File moved from ${inputFilePath} to ${outputFilePath}`);
    } catch (error) {
      console.error("Error moving file:", error);
      throw error;
    }

    return true;
  },
  {
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    },
  },
);
