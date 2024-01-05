import { FlowProducer } from "bullmq";
import config from "@packages/config-server";
import { finishIngest } from "./finish-ingest";
import { transcode } from "./transcode";

const flow = new FlowProducer({
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

export const qs = {
  flow,
  finishIngest,
  transcode,
};
