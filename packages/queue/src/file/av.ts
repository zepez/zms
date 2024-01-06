import ffmpeg, { type FfprobeData } from "fluent-ffmpeg";
import * as validate from "@packages/validation";
import { File } from "./file";

export abstract class AvFile extends File {
  av = validate.av.parse({});
  audio = validate.audio.parse({});
  video = validate.video.parse({});

  ffProbeData: FfprobeData | null = null;

  constructor(input: string) {
    super(input);
  }

  override async init() {
    if (this.initialized) return this;

    await this.probe();

    this.collectMetadata();

    super.init();

    return this;
  }

  override async probe() {
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

      await super.probe();
    } catch (e) {}
  }

  getAVStream(type: "audio" | "video" | "image") {
    if (!this.ffProbeData) return null;

    if (type === "image") {
      const maybeImageStream = this.ffProbeData.streams.filter(
        (s) => s.codec_type === "video",
      )[0];

      if (maybeImageStream?.avg_frame_rate === "0/0") return maybeImageStream;
    }

    const stream = this.ffProbeData.streams.filter(
      (s) => s.codec_type === type,
    )[0];

    return stream ?? null;
  }

  override collectMetadata() {
    this.av = validate.av.parse({
      av_format: this.ffProbeData?.format.format_name,
      av_duration: this.ffProbeData?.format.duration,
      av_size: this.ffProbeData?.format.size,
      av_bitrate: this.ffProbeData?.format.bit_rate,
    });

    const audioStream = this.getAVStream("audio");
    this.audio = validate.audio.parse({
      audio_codec: audioStream?.codec_name,
      audio_sample_rate: audioStream?.sample_rate,
      audio_channels: audioStream?.channels,
    });

    const videoStream = this.getAVStream("video");
    this.video = validate.video.parse({
      video_codec: videoStream?.codec_name,
      video_width: videoStream?.width,
      video_height: videoStream?.height,
      video_aspect_ratio: videoStream?.display_aspect_ratio,
      video_fps: videoStream?.r_frame_rate,
    });
  }

  override getMetadata() {
    const schema = validate.media.omit({ id: true });
    const meta = schema.parse({
      name: this.name,
      ...this.av,
      ...this.audio,
      ...this.video,
    });

    return meta;
  }
}
