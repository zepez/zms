import * as z from "zod";

export const av = z.object({
  av_format: z.string().nullable().default(null),
  av_duration: z.number().nullable().default(null),
  av_size: z.number().nullable().default(null),
  av_bitrate: z.number().nullable().default(null),
});

export const audio = z.object({
  audio_codec: z.string().nullable().default(null),
  audio_sample_rate: z.number().nullable().default(null),
  audio_channels: z.number().nullable().default(null),
});

export const video = z.object({
  video_codec: z.string().nullable().default(null),
  video_width: z.number().nullable().default(null),
  video_height: z.number().nullable().default(null),
  video_aspect_ratio: z.string().nullable().default(null),
  video_fps: z.string().nullable().default(null),
});
