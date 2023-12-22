import fs from "fs/promises";
import { Queue, Worker } from "bullmq";
import config from "@packages/config-server";
import type { MoveFileJobData } from "../types";

const connection = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
};

const moveFileQueue = new Queue("move-file-queue", {
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

const moveFileWorker = new Worker(
  "move-file-queue",
  async (job) => {
    const { inputFilePath, outputFilePath } = job.data as MoveFileJobData;

    try {
      await fs.rename(inputFilePath, outputFilePath);
      console.log(`File moved from ${inputFilePath} to ${outputFilePath}`);
    } catch (error) {
      console.error("Error moving file:", error);
      throw error;
    }

    return true;
  },
  { connection },
);

export const moveFile = {
  queue: moveFileQueue,
  worker: moveFileWorker,
};
