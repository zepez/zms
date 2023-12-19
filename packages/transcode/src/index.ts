import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { getMediaPath, ensureMediaPath } from "@packages/common";

const presets = [
  {
    name: "144p",
    resolution: "256x144",
    bandwidth: 80000,
    immediatelyAvailable: true,
  },
  {
    name: "480p",
    resolution: "640x480",
    bandwidth: 1200000,
    immediatelyAvailable: false,
  },
  {
    name: "720p",
    resolution: "1280x720",
    bandwidth: 2800000,
    immediatelyAvailable: false,
  },
  {
    name: "1080p",
    resolution: "1920x1080",
    bandwidth: 5000000,
    immediatelyAvailable: false,
  },
  {
    name: "2160p",
    resolution: "3840x2160",
    bandwidth: 14000000,
    immediatelyAvailable: false,
  },
];

interface TranscodeOptions {
  masterPath: string;
  inputPath: string;
  outputPath: string;
  name: string;
  bandwidth: number;
  resolution: string;
  segmentDuration: number;
  immediatelyAvailable: boolean;
}

const transcode = (options: TranscodeOptions) => {
  return new Promise((resolve, reject) => {
    const outputDir = `${options.outputPath}/${options.name}`;
    ensureMediaPath(outputDir);

    const playlistInfo = `#EXT-X-STREAM-INF:BANDWIDTH=${options.bandwidth},RESOLUTION=${options.resolution}\n${options.name}/playlist.m3u8\n`;

    if (options.immediatelyAvailable) {
      fs.appendFileSync(getMediaPath(options.masterPath), playlistInfo);
    }

    const callback = () => {
      console.log(`${options.name} transcoding finished`);

      if (!options.immediatelyAvailable) {
        fs.appendFileSync(getMediaPath(options.masterPath), playlistInfo);
      }
      resolve(true);
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
      .on("error", (err) => {
        console.error("Error:", err);
        reject(err);
      })
      .run();
  });
};

interface PipelineOptions {
  inputPath: string;
}

const pipeline = async ({ inputPath }: PipelineOptions) => {
  const baseFileName = path.basename(inputPath);
  const baseDirName = path.dirname(inputPath);

  const outputPath = `${baseDirName}/_${baseFileName}`;
  ensureMediaPath(outputPath);

  const masterPath = `${outputPath}/master.m3u8`;
  fs.writeFileSync(getMediaPath(masterPath), "#EXTM3U\n");

  for (const preset of presets) {
    await transcode({
      masterPath,
      inputPath,
      outputPath,
      name: preset.name,
      resolution: preset.resolution,
      bandwidth: preset.bandwidth,
      segmentDuration: 5,
      immediatelyAvailable: preset.immediatelyAvailable,
    });
  }
};

void pipeline({ inputPath: "movies/bunny.webm" });
