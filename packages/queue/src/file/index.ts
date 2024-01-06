import { AudioFile } from "./audio";
import { VideoFile } from "./video";

export const provision = async (path: string, type: string | null) => {
  let file: AudioFile | VideoFile | null = null;

  switch (type) {
    case "video":
      file = await new VideoFile(path).init();
      break;
    case "audio":
      file = await new AudioFile(path).init();
      break;
  }

  if (!file) throw new Error("Unsupported file type");

  return file;
};

export * from "./audio";
export * from "./video";
