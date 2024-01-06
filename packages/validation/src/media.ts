import * as z from "zod";

export type AV = z.infer<typeof av>;
export const av = z.object({
  av_format: z.string().nullable().default(null),
  av_duration: z.number().nullable().default(null),
  av_size: z.number().nullable().default(null),
  av_bitrate: z.number().nullable().default(null),
});

export type Audio = z.infer<typeof audio>;
export const audio = z.object({
  audio_codec: z.string().nullable().default(null),
  audio_sample_rate: z.number().nullable().default(null),
  audio_channels: z.number().nullable().default(null),
});

export type Video = z.infer<typeof video>;
export const video = z.object({
  video_codec: z.string().nullable().default(null),
  video_width: z.number().nullable().default(null),
  video_height: z.number().nullable().default(null),
  video_aspect_ratio: z.string().nullable().default(null),
  video_fps: z.string().nullable().default(null),
});

export type Media = z.infer<typeof media>;
export const media = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .merge(av)
  .merge(video)
  .merge(audio);
