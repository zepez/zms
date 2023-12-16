import path from "path";
import fs from "fs";

export const getMediaPath = (
  relativePath: string,
  options = { bundle: false },
): string => {
  const projectRoot = !options.bundle
    ? path.resolve(__dirname, "../../..")
    : path.resolve(__dirname, "../../../../../../../..");
  const mediaPath = path.join(projectRoot, "media", relativePath);

  return mediaPath;
};

export const ensureMediaPath = (filePath: string) => {
  const mediaPath = getMediaPath(filePath);
  fs.mkdirSync(mediaPath, { recursive: true });
};
