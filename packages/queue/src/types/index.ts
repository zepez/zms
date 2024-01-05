export type TranscodeJobData = {
  id: string;
  name: string;
  inputFilePath: string;
  outputDirPath: string;
  segmentDuration: number;
  preset: {
    name: string;
    resolution: string;
    bandwidth: number;
    immediate: boolean;
  };
};

export type FinishIngestJobData = {
  inputFilePath: string;
  outputFilePath: string;
};
