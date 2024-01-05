import { ingest } from "./ingest";
import { transcode } from "./transcode";

const workers = {
  ingest,
  transcode,
};

export default workers;
