import { Queue } from "bullmq";
import config from "@packages/config-server";
import { QUEUE_NAMES } from "@packages/constant";

export const transcode = new Queue(QUEUE_NAMES.TRANSCODE, {
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
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
