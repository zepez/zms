import { ensureDataPath } from "@packages/common";

const main = () => {
  ensureDataPath("db");
  ensureDataPath("queue/input");
  ensureDataPath("queue/success");
  ensureDataPath("queue/failure");
  ensureDataPath("store");
};

void main();
