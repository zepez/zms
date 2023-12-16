import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { getMediaPath, ensureMediaPath } from "@packages/common";

interface TranscodeOptions {
  masterPath: string;
  inputPath: string;
  outputPath: string;
  name: string;
  bandwidth: number;
  resolution: string;
  segmentDuration: number;
}

const transcode = (options: TranscodeOptions) => {
  const outputDir = `${options.outputPath}/${options.name}`;
  ensureMediaPath(outputDir);

  const callback = () => {
    fs.appendFileSync(
      getMediaPath(options.masterPath),
      `#EXT-X-STREAM-INF:BANDWIDTH=${options.bandwidth},RESOLUTION=${options.resolution}\n${options.name}/playlist.m3u8\n`,
    );

    console.log(`${options.name} transcoding finished`);
  };

  ffmpeg(getMediaPath(options.inputPath))
    .outputOptions([
      "-profile:v baseline",
      "-level 3.0",
      `-s ${options.resolution}`,
      "-start_number 0",
      `-hls_time ${options.segmentDuration}`,
      "-hls_list_size 0",
      "-f hls",
    ])
    .output(getMediaPath(`${outputDir}/playlist.m3u8`))
    .on("end", callback)
    .on("error", (err) => console.error("Error:", err))
    .run();
};

interface PipelineOptions {
  inputPath: string;
}

const pipeline = ({ inputPath }: PipelineOptions) => {
  const baseFileName = path.basename(inputPath);
  const baseDirName = path.dirname(inputPath);

  const outputPath = `${baseDirName}/_${baseFileName}`;
  ensureMediaPath(outputPath);

  const masterPath = `${outputPath}/master.m3u8`;
  fs.writeFileSync(getMediaPath(masterPath), "#EXTM3U\n");

  transcode({
    masterPath,
    inputPath,
    outputPath,
    name: "360p",
    resolution: "640x360",
    bandwidth: 800000,
    segmentDuration: 10,
  });

  transcode({
    masterPath,
    inputPath,
    outputPath,
    name: "720p",
    resolution: "1280x720",
    bandwidth: 2800000,
    segmentDuration: 10,
  });

  transcode({
    masterPath,
    inputPath,
    outputPath,
    name: "1080p",
    resolution: "1920x1080",
    bandwidth: 5000000,
    segmentDuration: 10,
  });
};

void pipeline({ inputPath: "movies/the_yard.mp4" });
