import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const media = sqliteTable("media", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  av_format: text("av_format"),
  av_duration: text("av_duration"),
  av_size: text("av_size"),
  av_bitrate: text("av_bitrate"),
  audio_codec: text("audio_codec"),
  audio_sample_rate: text("audio_sample_rate"),
  audio_channels: text("audio_channels"),
  video_codec: text("video_codec"),
  video_width: text("video_width"),
  video_height: text("video_height"),
  video_aspect_ratio: text("video_aspect_ratio"),
  video_fps: text("video_fps"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export type Media = InferSelectModel<typeof media>;
export type NewMedia = InferInsertModel<typeof media>;
