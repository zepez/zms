import { FlowProducer } from "bullmq";
import config from "@packages/config-server";

export const flow = new FlowProducer({
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

export * from "./move-file";
export * from "./transcode";
