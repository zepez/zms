import crypto from "crypto";
import * as fs from "fs/promises";
import path from "path";
import type { Stats } from "fs";
import ffmpeg, { type FfprobeData } from "fluent-ffmpeg";
import { getDataPath, ensurePath } from "@packages/common";
import * as validate from "./validation";

export default class File {
  inputFilePath: string;
  name: string;
  type: "audio" | "video" | null = null;
  stats: Stats | null = null;
  initialized: boolean = false;

  av = validate.av.parse({});
  audio = validate.audio.parse({});
  video = validate.video.parse({});

  ffProbeData: FfprobeData | null = null;

  constructor(input: string) {
    this.inputFilePath = input;
    this.name = path.basename(input);
  }

  async init() {
    if (this.initialized) return this;

    await this.probeStats();
    await this.probeAV();

    this.collectMetadata();

    this.initialized = true;

    return this;
  }

  async probeStats() {
    this.stats = await fs.stat(this.inputFilePath);
  }

  async probeAV() {
    try {
      const probeData = (await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(this.inputFilePath, (err, data: FfprobeData) => {
          if (err) {
            console.error(err);
            reject(err);
          }

          resolve(data);
        });
      })) as FfprobeData;

      this.ffProbeData = probeData;

      this.type = this.getAVStream("video") ? "video" : "audio";
    } catch (e) {}
  }

  getAVStream(type: string) {
    if (!this.ffProbeData) return null;

    const stream = this.ffProbeData.streams.filter(
      (s) => s.codec_type === type,
    )[0];

    return stream ?? null;
  }

  collectMetadata() {
    this.collectAVMetadata();
    this.collectAudioMetadata();
    this.collectVideoMetadata();
  }

  async collectAVMetadata() {
    if (!this.ffProbeData) {
      this.av = validate.av.parse({});
      return;
    }

    this.av = validate.av.parse({
      av_format: this.ffProbeData.format.format_name,
      av_duration: this.ffProbeData.format.duration,
      av_size: this.ffProbeData.format.size,
      av_bitrate: this.ffProbeData.format.bit_rate,
    });
  }

  collectAudioMetadata() {
    const stream = this.getAVStream("audio");
    if (!stream) {
      this.audio = validate.audio.parse({});
      return;
    }

    this.audio = validate.audio.parse({
      audio_codec: stream.codec_name,
      audio_sample_rate: stream.sample_rate,
      audio_channels: stream.channels,
    });
  }

  collectVideoMetadata() {
    const stream = this.getAVStream("video");
    if (!stream) {
      this.video = validate.video.parse({});
      return;
    }

    this.video = validate.video.parse({
      video_codec: stream.codec_name,
      video_width: stream.width,
      video_height: stream.height,
      video_aspect_ratio: stream.display_aspect_ratio,
      video_fps: stream.r_frame_rate,
    });
  }

  getMetadata() {
    return {
      path: this.inputFilePath,
      name: this.name,
      ...this.av,
      ...this.audio,
      ...this.video,
    };
  }

  getHash() {
    const meta = JSON.stringify(this.getMetadata());

    return crypto.createHash("md5").update(meta).digest("hex");
  }

  getOutputDirPath() {
    const hash = this.getHash();
    return path.join(getDataPath("/store"), hash);
  }

  getOutputFilePath() {
    return path.join(getDataPath("/archive"), this.name);
  }

  dumpMetadata() {
    const outputDirPath = this.getOutputDirPath();
    ensurePath(outputDirPath);

    const metaPath = path.join(outputDirPath, "metadata.json");
    const metaData = JSON.stringify(this.getMetadata(), null, 2);

    fs.writeFile(metaPath, metaData);
  }
}
