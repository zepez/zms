export type TranscodeJobData = {
  type: "audio" | "video";
  id: string;
  name: string;
  inputFilePath: string;
  outputDirPath: string;
  segmentDuration: number;
  preset: {
    name: string;
    resolution: string | null;
    bandwidth: number;
    immediate: boolean;
  };
};

export type IngestJobData = {
  inputFilePath: string;
  outputFilePath: string;
};
