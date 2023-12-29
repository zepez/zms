import { db, schema } from "@packages/db";
import { sql } from "drizzle-orm";

export const insertMediaPrepared = db
  .insert(schema.media)
  .values({
    id: sql.placeholder("id"),
    name: sql.placeholder("name"),
    av_format: sql.placeholder("av_format"),
    av_duration: sql.placeholder("av_duration"),
    av_size: sql.placeholder("av_size"),
    av_bitrate: sql.placeholder("av_bitrate"),
    audio_codec: sql.placeholder("audio_codec"),
    audio_sample_rate: sql.placeholder("audio_sample_rate"),
    audio_channels: sql.placeholder("audio_channels"),
    video_codec: sql.placeholder("video_codec"),
    video_width: sql.placeholder("video_width"),
    video_height: sql.placeholder("video_height"),
    video_aspect_ratio: sql.placeholder("video_aspect_ratio"),
    video_fps: sql.placeholder("video_fps"),
  })
  .onConflictDoNothing({ target: schema.media.id })
  .prepare();
