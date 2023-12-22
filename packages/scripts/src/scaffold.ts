import { ensureDataPath } from "@packages/common";

const main = () => {
  ensureDataPath("db");
  ensureDataPath("queue");
  ensureDataPath("archive");
  ensureDataPath("error");
  ensureDataPath("store");
};

void main();
