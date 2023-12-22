import path from "path";
import fs from "fs";
import config from "@packages/config-server";

export const getDataPath = (relativePath: string): string => {
  const projectRoot = !config.FLAG_NEXT_BUNDLE
    ? path.resolve(__dirname, "../../..")
    : path.resolve(__dirname, "../../../../../../../..");
  const dataPath = path.join(projectRoot, "data", relativePath);

  return dataPath;
};

export const ensureDataPath = (filePath: string) => {
  const dataPath = getDataPath(filePath);
  fs.mkdirSync(dataPath, { recursive: true });
};
