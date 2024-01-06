import ffmpeg from "fluent-ffmpeg";
import type { TranscodeJobData } from "../../types";

export const ffmpegCommand = (opts: TranscodeJobData, output: string) => {
  const { type, preset } = opts;

  switch (type) {
    case "video": {
      return ffmpeg(opts.inputFilePath)
        .outputOptions([
          "-profile:v baseline",
          `-s ${preset.resolution}`,
          `-b:v ${preset.bandwidth / 1000}k`,
          "-sc_threshold 0",
          "-start_number 0",
          `-hls_time ${opts.segmentDuration}`,
          "-hls_list_size 0",
          "-f hls",
          "-loglevel debug",
        ])
        .output(output);
    }
    case "audio": {
      return ffmpeg(opts.inputFilePath)
        .audioCodec("aac")
        .audioBitrate(`${preset.bandwidth / 1000}k`)
        .outputOptions([
          "-vn",
          `-ac 2`,
          "-ar 48000",
          "-sc_threshold 0",
          "-start_number 0",
          `-hls_time ${opts.segmentDuration}`,
          "-hls_list_size 0",
          "-f hls",
          "-loglevel debug",
        ])
        .output(output);
    }
  }
};
