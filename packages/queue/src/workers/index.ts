import { finishIngest } from "./finish-ingest";
import { transcode } from "./transcode";

const workers = {
  finishIngest,
  transcode,
};

export default workers;
