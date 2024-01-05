import fs from "fs/promises";
import { Worker } from "bullmq";
import config from "@packages/config-server";
import { QUEUE_NAMES } from "@packages/constant";
import type { IngestJobData } from "../types";

export const ingest = new Worker(
  QUEUE_NAMES.INGEST,
  async (job) => {
    const { inputFilePath, outputFilePath } = job.data as IngestJobData;

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
