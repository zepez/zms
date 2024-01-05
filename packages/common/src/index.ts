import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const getDataPath = (relativePath: string): string => {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const dataPath = path.join(currentDir, "../../../data", relativePath);

  return dataPath;
};

export const ensureDataPath = (filePath: string) => {
  const dataPath = getDataPath(filePath);
  fs.mkdirSync(dataPath, { recursive: true });
};

export const ensurePath = (filePath: string) => {
  fs.mkdirSync(filePath, { recursive: true });
};
